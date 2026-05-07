import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NamespaceBadgeComponent } from './namespace-badge.component';
import type { Badge } from '../../data/types';
import type { NamespaceId } from '../../data/namespaces';

/**
 * The page hero: namespace badge + name in big italic Fraunces, secondary
 * badges underneath, and the lede paragraph. The title is the visual peak
 * of every page. Two design moves:
 *
 *   • Title uses the .fr-display-l + .text-grad-brand combination so it
 *     gets the indigo→violet gradient typography.
 *
 *   • All non-namespace badges sit on a single wrap-friendly row beneath
 *     the title; the namespace badge sits ABOVE the title as a category
 *     line, mirroring the way magazine articles use a kicker.
 */
@Component({
    selector: 'forte-hero-block',
    standalone: true,
    imports: [NamespaceBadgeComponent],
    template: `
    <header class="hero">
      <forte-namespace-badge [ns]="namespace()" />

      <h1 class="hero-title fr-display-l text-grad-brand">{{ name() }}</h1>

      @if (otherBadges().length) {
        <div class="hero-badges">
          @for (b of otherBadges(); track b.label) {
            <span class="hero-badge" [attr.data-variant]="b.variant">
              {{ b.label }}
            </span>
          }
        </div>
      }

      <p class="hero-lead">{{ lead() }}</p>
    </header>
  `,
    styles: [`
    :host { display: block; }

    .hero { display: flex; flex-direction: column; gap: var(--space-4); }

    .hero-title {
      margin: 0;
      max-width: 18ch;
      font-size: clamp(36px, 5vw, 56px);
    }

    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .hero-badge {
      font: var(--font-mono-meta);
      letter-spacing: 0.04em;
      padding: 3px 9px;
      border-radius: var(--r-pill);
      border: 0.5px solid var(--border);
      background: var(--bg-surface);
      color: var(--fg-muted);
    }
    .hero-badge[data-variant='ok'] {
      color: var(--c-success);
      background: color-mix(in srgb, var(--c-success) 8%, var(--bg-surface));
      border-color: color-mix(in srgb, var(--c-success) 30%, transparent);
    }
    .hero-badge[data-variant='warn'] {
      color: var(--c-warn);
      background: color-mix(in srgb, var(--c-warn) 8%, var(--bg-surface));
      border-color: color-mix(in srgb, var(--c-warn) 30%, transparent);
    }
    .hero-badge[data-variant='neutral'] {
      /* Default styling — already correct above. */
    }

    .hero-lead {
      font: var(--font-body);
      font-size: 15px;
      line-height: 1.7;
      color: var(--fg-muted);
      margin: 0;
      max-width: 64ch;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBlockComponent {
    readonly name = input.required<string>();
    readonly namespace = input.required<NamespaceId>();
    readonly badges = input.required<ReadonlyArray<Badge>>();
    readonly lead = input.required<string>();

    readonly otherBadges = (): ReadonlyArray<Badge> =>
        this.badges().filter(b => b.variant !== 'namespace');
}