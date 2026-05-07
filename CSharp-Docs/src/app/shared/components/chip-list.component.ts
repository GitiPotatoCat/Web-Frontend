import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { RelatedChip } from '../../data/types';
import { getStructure } from '../../data/structures';

/**
 * The "Related structures" chip row at the bottom of every page. Each chip
 * is a routerLink that navigates to /s/{slug}. Labels default to the target
 * structure's display name; can be overridden by the data file.
 *
 * If a slug is unknown (which should be impossible in production but is
 * possible during step 9 while we author the remaining 32 structures), we
 * skip rendering that chip rather than 404-linking. Defensive but quiet.
 */
@Component({
    selector: 'forte-chip-list',
    standalone: true,
    imports: [RouterLink],
    template: `
    <nav class="chips" aria-label="Related structures">
      @for (chip of resolved(); track chip.slug) {
        
        <a class="chip"
          [routerLink]="['/s', chip.slug]"
          [attr.data-ns]="chip.namespace">
          <span class="chip-dot" aria-hidden="true"></span>
          <span class="chip-label">{{ chip.label }}</span>
          <span class="material-symbols-rounded chip-arrow">arrow_forward</span>
        </a>
      }
    </nav>
  `,
    styles: [`
    :host { display: block; }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      font: var(--font-mono-meta);
      letter-spacing: 0.04em;
      color: var(--fg-muted);
      background: var(--bg-surface);
      border: 0.5px solid var(--border);
      border-radius: var(--r-pill);
      text-decoration: none;
      transition:
        color var(--dur-fast) var(--ease-standard),
        border-color var(--dur-fast) var(--ease-standard),
        box-shadow var(--dur-fast) var(--ease-standard);
    }
    .chip:hover {
      color: var(--fg-primary);
      border-color: var(--c-brand-soft);
      box-shadow: var(--shadow-1);
    }

    .chip-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; opacity: 0.6;
    }
    .chip[data-ns='primitive']  { color: var(--ns-primitive);  }
    .chip[data-ns='generic']    { color: var(--ns-generic);    }
    .chip[data-ns='legacy']     { color: var(--ns-legacy);     }
    .chip[data-ns='concurrent'] { color: var(--ns-concurrent); }
    .chip[data-ns='immutable']  { color: var(--ns-immutable);  }

    .chip-arrow {
      font-size: 14px;
      opacity: 0;
      transform: translateX(-2px);
      transition: opacity var(--dur-fast), transform var(--dur-fast);
    }
    .chip:hover .chip-arrow {
      opacity: 0.7;
      transform: translateX(0);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListComponent {
    readonly chips = input.required<ReadonlyArray<RelatedChip>>();

    /** Resolves slugs to display labels and namespace tints. */
    protected readonly resolved = computed(() =>
        this.chips()
            .map(c => {
                const target = getStructure(c.slug);
                if (!target) return null;
                return {
                    slug: c.slug,
                    label: c.label ?? target.name,
                    namespace: target.namespace,
                };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null),
    );
}