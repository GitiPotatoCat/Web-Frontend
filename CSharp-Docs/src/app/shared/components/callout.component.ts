import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Callout } from '../../data/types';

/**
 * The "watch out for this" / "secret superpower" / "design insight" block.
 * Variant drives the colour key (warn → amber, highlight → emerald, note
 * → indigo). We render with a coloured left border and a coloured eyebrow
 * label so the variant reads at a glance even in greyscale.
 */
@Component({
    selector: 'forte-callout',
    standalone: true,
    template: `
    <aside class="callout" [attr.data-variant]="data().variant">
      <p class="callout-eyebrow">{{ eyebrowFor(data().variant) }}</p>
      <h3 class="callout-title">{{ data().title }}</h3>
      <p class="callout-body">{{ data().body }}</p>
    </aside>
  `,
    styles: [`
    :host { display: block; }

    .callout {
      padding: var(--space-5) var(--space-6);
      background: var(--bg-surface);
      border: 0.5px solid var(--border);
      border-left: 3px solid var(--c-brand);
      border-radius: var(--r-lg);
    }

    .callout[data-variant='warn']      { border-left-color: var(--c-warn); }
    .callout[data-variant='highlight'] { border-left-color: var(--c-success); }
    .callout[data-variant='note']      { border-left-color: var(--c-brand); }

    .callout-eyebrow {
      margin: 0 0 6px;
      font: var(--font-mono-meta);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .callout[data-variant='warn']      .callout-eyebrow { color: var(--c-warn); }
    .callout[data-variant='highlight'] .callout-eyebrow { color: var(--c-success); }
    .callout[data-variant='note']      .callout-eyebrow { color: var(--c-brand); }

    .callout-title {
      margin: 0 0 8px;
      font: var(--font-h3);
      color: var(--fg-primary);
    }

    .callout-body {
      margin: 0;
      font: 300 italic 14px / 1.7 'Fraunces', Georgia, serif;
      font-variation-settings: 'opsz' 24, 'SOFT' 30;
      color: var(--fg-muted);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {
    readonly data = input.required<Callout>();

    protected eyebrowFor(v: Callout['variant']): string {
        switch (v) {
            case 'warn': return 'Watch out';
            case 'highlight': return 'Notable strength';
            case 'note': return 'Design note';
        }
    }
}