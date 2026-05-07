import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Metric } from '../../data/types';
import { ComplexityGraphComponent } from './complexity-graph';

/**
 * The trio of complexity cards under the hero. We render them as a
 * horizontal grid that wraps gracefully. Each card uses a layered
 * presentation: small uppercase label, big mono complexity, italic note.
 *
 * The complexity badge has a subtle hover glow that only activates on
 * mouseover — a small interactive moment that signals these aren't just
 * static stats; the animated complexity-graph component (step 8) will
 * eventually swap in for the value text.
 */
@Component({
    selector: 'forte-metric-card',
    standalone: true,
    imports: [ComplexityGraphComponent],
    template: `
    <article class="metric-card">
        <p class="metric-label eyebrow">{{ metric().label }}</p>
        <p class="metric-value">{{ metric().value }}</p>
        <forte-complexity-graph [complexity]="metric().value" />
        <p class="metric-note">{{ metric().note }}</p>
    </article>
  `,
    styles: [`
    :host { display: block; }

    .metric-card {
      padding: var(--space-5);
      background: var(--bg-surface);
      border: 0.5px solid var(--border);
      border-radius: var(--r-lg);
      transition:
        border-color var(--dur-fast) var(--ease-standard),
        box-shadow var(--dur-fast) var(--ease-standard),
        transform var(--dur-base) var(--ease-emphasis);
    }
    .metric-card:hover {
      border-color: var(--c-brand-soft);
      box-shadow: var(--shadow-2);
      transform: translateY(-1px);
    }

    .metric-label { margin: 0 0 8px; }

    .metric-value {
      margin: 0 0 6px;
      font: var(--font-code);
      font-size: 22px;
      font-weight: 500;
      color: var(--fg-primary);
      letter-spacing: -0.01em;
    }

    .metric-note {
      margin: 0;
      font: 300 italic 13px / 1.55 'Fraunces', Georgia, serif;
      font-variation-settings: 'opsz' 24;
      color: var(--fg-muted);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
    readonly metric = input.required<Metric>();
}