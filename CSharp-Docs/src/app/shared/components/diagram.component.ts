import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Diagram } from '../../data/types';

/**
 * A boxed monospace illustration. Pre-formatted whitespace, soft surface,
 * subtle gradient corner — quietly distinct from a code block so readers
 * don't confuse the two.
 */
@Component({
    selector: 'forte-diagram',
    standalone: true,
    template: `
    <figure class="diagram">
      @if (data().caption) {
        <figcaption class="diagram-caption eyebrow">{{ data().caption }}</figcaption>
      }
      <pre class="diagram-body">{{ data().body }}</pre>
    </figure>
  `,
    styles: [`
    :host { display: block; }

    .diagram {
      margin: 0;
      padding: var(--space-5) var(--space-6);
      background: var(--bg-raised);
      border: 0.5px solid var(--border);
      border-radius: var(--r-lg);
      position: relative;
      overflow: hidden;
    }
    .diagram::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(at 100% 0%, var(--c-brand-bg) 0%, transparent 50%);
      opacity: 0.4;
      pointer-events: none;
    }

    .diagram-caption { margin: 0 0 var(--space-3); position: relative; }

    .diagram-body {
      margin: 0;
      font: var(--font-code-sm);
      line-height: 1.6;
      color: var(--fg-muted);
      white-space: pre;
      overflow-x: auto;
      position: relative;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramComponent {
    readonly data = input.required<Diagram>();
}