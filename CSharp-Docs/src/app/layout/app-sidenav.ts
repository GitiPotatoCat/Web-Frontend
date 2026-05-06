import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    signal,
} from '@angular/core';

/**
 * Floating dock sidenav. Two states:
 *
 *   collapsed (default) — 64px wide rail with one icon per namespace.
 *   expanded            — 260px wide; reveals the full nav under each.
 *
 * Expansion triggers:
 *   • mouseenter on the host
 *   • focus inside the host (keyboard navigation)
 *
 * The nav structure here is hardcoded for step 2. In step 6 we replace
 * it with a typed registry pulled from src/app/data so it reflects every
 * structure data file.
 */
@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './app-sidenav.html',
    styleUrl: './app-sidenav.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidenavComponent {
    /** Whether the dock is currently expanded. */
    protected readonly expanded = signal(false);

    /** Whether the user is keyboard-focused inside us — locks expansion open. */
    protected readonly focusLocked = signal(false);

    @HostBinding('class.is-expanded')
    get isExpanded(): boolean {
        return this.expanded() || this.focusLocked();
    }

    @HostListener('mouseenter') onEnter(): void { this.expanded.set(true); }
    @HostListener('mouseleave') onLeave(): void { this.expanded.set(false); }
    @HostListener('focusin') onFocusIn(): void { this.focusLocked.set(true); }
    @HostListener('focusout', ['$event']) onFocusOut(e: FocusEvent): void {
        // Only release when focus leaves the host entirely.
        const next = e.relatedTarget as Node | null;
        if (!next || !(e.currentTarget as HTMLElement).contains(next)) {
            this.focusLocked.set(false);
        }
    }

    /**
     * Step-2 nav stub. The five namespace groups, with a flat dummy entry
     * each so the dock visibly populates. Real routes wire up in step 6.
     */
    protected readonly groups = [
        { id: 'primitive', label: 'Array · Span', icon: 'ns-primitive', count: 3 },
        { id: 'generic', label: 'Generic', icon: 'ns-generic', count: 11 },
        { id: 'legacy', label: 'Legacy', icon: 'ns-legacy', count: 7 },
        { id: 'concurrent', label: 'Concurrent', icon: 'ns-concurrent', count: 5 },
        { id: 'immutable', label: 'Immutable', icon: 'ns-immutable', count: 8 },
    ] as const;
}