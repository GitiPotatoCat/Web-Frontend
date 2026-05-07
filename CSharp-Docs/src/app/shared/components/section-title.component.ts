import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Consistent section header used between every major block on a structure
 * page. An optional eyebrow label sits above an h2 in Geist medium.
 */
@Component({
    selector: 'forte-section-title',
    standalone: true,
    template: `
    @if (eyebrow()) {
      <p class="eyebrow">{{ eyebrow() }}</p>
    }
    <h2 class="section-h">{{ title() }}</h2>
  `,
    styles: [`
    :host { display: block; margin-bottom: var(--space-4); }
    .section-h {
      font: var(--font-h2);
      color: var(--fg-primary);
      margin: 0;
      letter-spacing: -0.005em;
    }
    .eyebrow { margin: 0 0 4px; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
    readonly eyebrow = input<string | undefined>(undefined);
    readonly title = input.required<string>();
}