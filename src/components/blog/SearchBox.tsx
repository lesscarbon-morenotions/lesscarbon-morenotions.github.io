import { useEffect, useRef, useState } from 'preact/hooks';

interface Result {
  url: string;
  meta: { title?: string };
  excerpt?: string;
}

declare global {
  interface Window {
    pagefind?: {
      search: (q: string) => Promise<{ results: { data: () => Promise<Result> }[] }>;
    };
  }
}

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Runtime import after Pagefind postbuild — avoid Vite bundling
        const mod = await new Function('return import("/pagefind/pagefind.js")')();
        if (!cancelled) {
          window.pagefind = mod;
          setReady(true);
        }
      } catch {
        setReady(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q || !window.pagefind) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const search = await window.pagefind!.search(q);
      const items = await Promise.all(
        search.results.slice(0, 6).map((r) => r.data()),
      );
      if (!cancelled) {
        setResults(items);
        setOpen(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div class="relative" ref={rootRef}>
      <label class="sr-only" for="site-search">
        Search posts
      </label>
      <input
        id="site-search"
        type="search"
        placeholder={ready ? 'Search notions…' : 'Search (after build)'}
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        onFocus={() => results.length && setOpen(true)}
        class="w-full rounded-full border border-beluga-200 bg-white/80 px-4 py-2 text-sm text-ink shadow-sm outline-none placeholder:text-beluga-500 focus:border-hydrangea-500 focus:ring-2 focus:ring-hydrangea-300/50"
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-expanded={open}
      />
      {open && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          class="absolute right-0 z-50 mt-2 max-h-80 w-full min-w-[16rem] overflow-auto rounded-2xl border border-beluga-200 bg-white p-2 shadow-xl sm:w-80"
        >
          {results.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                class="block rounded-xl px-3 py-2 no-underline hover:bg-hydrangea-200/40"
                onClick={() => setOpen(false)}
              >
                <span class="block text-sm font-semibold text-ink">
                  {r.meta?.title || r.url}
                </span>
                {r.excerpt && (
                  <span
                    class="mt-0.5 block text-xs text-muted line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
