import { useMemo, useState } from 'preact/hooks';

interface TagOption {
  label: string;
  slug: string;
  count: number;
}

interface Props {
  tags: TagOption[];
  /** CSS selector for post cards that have data-tags="slug1,slug2" */
  targetSelector?: string;
}

export default function TagFilter({ tags, targetSelector = '[data-tags]' }: Props) {
  const [active, setActive] = useState<string[]>([]);

  const sorted = useMemo(
    () => [...tags].sort((a, b) => a.label.localeCompare(b.label)),
    [tags],
  );

  function applyFilter(next: string[]) {
    setActive(next);
    const cards = document.querySelectorAll<HTMLElement>(targetSelector);
    cards.forEach((card) => {
      const cardTags = (card.dataset.tags || '').split(',').filter(Boolean);
      const show =
        next.length === 0 || next.every((slug) => cardTags.includes(slug));
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
    const empty = document.getElementById('filter-empty');
    if (empty) {
      const visible = [...cards].some((c) => c.style.display !== 'none');
      empty.hidden = visible;
    }
  }

  function toggle(slug: string) {
    const next = active.includes(slug)
      ? active.filter((s) => s !== slug)
      : [...active, slug];
    applyFilter(next);
  }

  function clear() {
    applyFilter([]);
  }

  return (
    <div class="space-y-3" role="group" aria-label="Filter posts by tag">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class={
            active.length === 0
              ? 'rounded-full bg-cornflower-600 px-3 py-1.5 text-xs font-semibold text-white'
              : 'rounded-full border border-beluga-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-beluga-700 hover:border-hydrangea-300'
          }
          onClick={clear}
          aria-pressed={active.length === 0}
        >
          All
        </button>
        {sorted.map((tag) => {
          const isOn = active.includes(tag.slug);
          return (
            <button
              type="button"
              key={tag.slug}
              class={
                isOn
                  ? 'rounded-full bg-hydrangea-700 px-3 py-1.5 text-xs font-semibold text-white'
                  : 'rounded-full bg-hydrangea-200/80 px-3 py-1.5 text-xs font-semibold text-hydrangea-700 hover:bg-hydrangea-300'
              }
              onClick={() => toggle(tag.slug)}
              aria-pressed={isOn}
            >
              {tag.label}
              <span class="ml-1 opacity-70">({tag.count})</span>
            </button>
          );
        })}
      </div>
      {active.length > 0 && (
        <p class="text-xs text-muted">
          Showing posts with: {active.map((s) => sorted.find((t) => t.slug === s)?.label).join(', ')}
          {' · '}
          <button type="button" class="underline" onClick={clear}>
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}
