import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ComparisonTable } from '../../data/types';

/**
 * The "X vs alternatives" matrix. We render as a real HTML <table> for
 * a11y and SEO. The first column is row labels (the aspect being compared),
 * each subsequent column is one alternative.
 *
 * Header cells take an optional namespace tint so users can see at a
 * glance which column belongs to which group.
 *
 * On narrow viewports (<700px) the table becomes horizontally scrollable
 * with a sticky first column — that way you can scan an aspect across
 * options without losing the row label. We do this with a simple wrapper
 * + `position: sticky` rather than a full responsive transform, because
 * column-vs-row layouts in CSS get unwieldy fast and the scroll behavior
 * works on every browser we target.
 */
@Component({
    selector: 'forte-comparison-table',
    standalone: true,
    template: `
    <div class="cmp-wrap">
      <table class="cmp">
        <thead>
          <tr>
            <th class="cmp-th-aspect" scope="col">Aspect</th>
            @for (c of data().columns; track c.id) {
              <th
                scope="col"
                class="cmp-th-col"
                [attr.data-ns]="c.accent ?? null">
                {{ c.label }}
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data().rows; track row.aspect) {
            <tr>
              <th scope="row" class="cmp-th-row">{{ row.aspect }}</th>
              @for (c of data().columns; track c.id) {
                <td class="cmp-td">{{ row.cells[c.id] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    :host { display: block; }

    .cmp-wrap {
      overflow-x: auto;
      border: 0.5px solid var(--border);
      border-radius: var(--r-lg);
      background: var(--bg-surface);
    }

    .cmp {
      width: 100%;
      border-collapse: collapse;
      font: var(--font-body-sm);
    }

    .cmp th, .cmp td {
      padding: 12px var(--space-4);
      text-align: left;
      vertical-align: top;
      border-bottom: 0.5px solid var(--border-soft);
    }
    .cmp tr:last-child th,
    .cmp tr:last-child td { border-bottom: 0; }

    .cmp-th-aspect, .cmp-th-row {
      font: var(--font-mono-meta);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--fg-subtle);
      white-space: nowrap;
      background: var(--bg-raised);
      position: sticky;
      left: 0;
      /* sticky needs the header bg so content doesn't bleed through under it */
    }
    thead .cmp-th-aspect { background: var(--bg-raised); }

    .cmp-th-col {
      font: 500 13px/1.4 'Geist', system-ui, sans-serif;
      color: var(--fg-primary);
      white-space: nowrap;
    }
    .cmp-th-col[data-ns='primitive']  { color: var(--ns-primitive);  }
    .cmp-th-col[data-ns='generic']    { color: var(--ns-generic);    }
    .cmp-th-col[data-ns='legacy']     { color: var(--ns-legacy);     }
    .cmp-th-col[data-ns='concurrent'] { color: var(--ns-concurrent); }
    .cmp-th-col[data-ns='immutable']  { color: var(--ns-immutable);  }

    .cmp-td {
      color: var(--fg-muted);
      min-width: 14ch;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonTableComponent {
    readonly data = input.required<ComparisonTable>();
}