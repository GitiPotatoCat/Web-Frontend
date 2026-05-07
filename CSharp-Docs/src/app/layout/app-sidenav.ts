import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostBinding,
    HostListener,
    inject,
    signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MobileDrawerService } from '../core/mobile-drawer.service';
import { listStructuresGrouped } from '../data/structures';

/**
 * Floating dock sidenav, registry-backed.
 *
 * Two presentation modes:
 *
 *   Desktop (≥ 720px)
 *     The dock is sticky and 64px wide collapsed. Hover or focus inside
 *     expands it to 260px revealing per-structure links underneath each
 *     namespace icon.
 *
 *   Mobile (< 720px)
 *     The dock becomes a drawer that slides in from the left. Its
 *     open/close state is controlled by MobileDrawerService — the
 *     hamburger in the header opens it, tapping a link closes it.
 *
 * The presentational logic doesn't differ between modes; only the host's
 * CSS does (see component.scss). The data and the link rendering are
 * identical, so we never have two divergent template paths to maintain.
 */
@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './app-sidenav.html',
    styleUrl: './app-sidenav.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidenavComponent {
    protected readonly drawer = inject(MobileDrawerService);

    /** Hover-driven expansion state on desktop. */
    protected readonly hoverExpanded = signal(false);

    /** Focus-driven expansion state — locks dock open while keyboard nav is inside. */
    protected readonly focusLocked = signal(false);

    /**
     * The dock visibly expanded? Three things can drive this:
     *   • Hover on desktop
     *   • Focus inside on desktop
     *   • Drawer open on mobile (drawer mode is always "expanded" content-wise)
     */
    protected readonly expanded = computed(
        () => this.hoverExpanded() || this.focusLocked() || this.drawer.isOpen(),
    );

    @HostBinding('class.is-expanded')
    get hostExpanded(): boolean { return this.expanded(); }

    @HostBinding('class.is-drawer-open')
    get hostDrawerOpen(): boolean { return this.drawer.isOpen(); }

    /** Same data flow used by the home page deck. */
    protected readonly groups = listStructuresGrouped();

    // ---- Hover / focus expansion (desktop only) -------------------------

    @HostListener('mouseenter')
    onEnter(): void {
        if (!this.isMobileViewport()) this.hoverExpanded.set(true);
    }

    @HostListener('mouseleave')
    onLeave(): void {
        this.hoverExpanded.set(false);
    }

    @HostListener('focusin')
    onFocusIn(): void {
        if (!this.isMobileViewport()) this.focusLocked.set(true);
    }

    @HostListener('focusout', ['$event'])
    onFocusOut(e: FocusEvent): void {
        const next = e.relatedTarget as Node | null;
        const host = e.currentTarget as HTMLElement;
        if (!next || !host.contains(next)) this.focusLocked.set(false);
    }

    // ---- Drawer dismissal ----------------------------------------------

    /** Tapping a link closes the drawer on mobile; on desktop this is a no-op. */
    protected onLinkActivate(): void {
        if (this.drawer.isOpen()) this.drawer.close();
    }

    // ---- Utility -------------------------------------------------------

    private isMobileViewport(): boolean {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 720px)').matches;
    }
}