import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { NamespaceId } from '../../data/namespaces';
import { getNamespace } from '../../data/namespaces';

/**
 * The big coloured pill that opens every hero badge row. Renders the full
 * namespace name (System.Collections.Generic) in mono with the namespace
 * tint applied. Clickable in the future — for step 4 we keep it as a
 * static badge and let the user reach namespace landings via the sidenav.
 */
@Component({
    selector: 'forte-namespace-badge',
    standalone: true,
    template: `
    <span class="ns-badge" [attr.data-ns]="ns()">
      <span class="ns-badge-dot" aria-hidden="true"></span>
      <span class="ns-badge-text">{{ meta().fullName }}</span>
    </span>
  `,
    styles: [`
    :host { display: inline-flex; }

    .ns-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 4px 10px;
      font: var(--font-mono-meta);
      letter-spacing: 0.04em;
      border: 0.5px solid var(--border);
      border-radius: var(--r-pill);
      background: var(--bg-surface);
    }

    .ns-badge[data-ns='primitive']  { color: var(--ns-primitive);  border-color: color-mix(in srgb, var(--ns-primitive) 35%, transparent); background: var(--ns-primitive-bg); }
    .ns-badge[data-ns='generic']    { color: var(--ns-generic);    border-color: color-mix(in srgb, var(--ns-generic)   35%, transparent); background: var(--ns-generic-bg); }
    .ns-badge[data-ns='legacy']     { color: var(--ns-legacy);     border-color: color-mix(in srgb, var(--ns-legacy)    35%, transparent); background: var(--ns-legacy-bg); }
    .ns-badge[data-ns='concurrent'] { color: var(--ns-concurrent); border-color: color-mix(in srgb, var(--ns-concurrent)35%, transparent); background: var(--ns-concurrent-bg); }
    .ns-badge[data-ns='immutable']  { color: var(--ns-immutable);  border-color: color-mix(in srgb, var(--ns-immutable) 35%, transparent); background: var(--ns-immutable-bg); }

    .ns-badge-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor;
    }

    .ns-badge-text { color: inherit; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NamespaceBadgeComponent {
    readonly ns = input.required<NamespaceId>();
    readonly meta = computed(() => getNamespace(this.ns()));
}