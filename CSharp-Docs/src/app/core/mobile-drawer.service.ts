import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

/**
 * Open/close state for the mobile sidenav drawer. Used only at viewport
 * widths below the 720px breakpoint where the dock pattern collapses.
 *
 * The state is shared across:
 *   • AppHeaderComponent — the hamburger button toggles open
 *   • AppComponent — renders a scrim that closes on click
 *   • AppSidenavComponent — adds .is-drawer-open class when true
 *
 * Body scroll is locked while open. When the user taps a nav link the
 * close() call here is what dismisses the drawer; AppSidenavComponent
 * delegates to this service rather than tracking its own state.
 */
@Injectable({ providedIn: 'root' })
export class MobileDrawerService {
    private readonly doc = inject(DOCUMENT);

    readonly isOpen = signal(false);

    constructor() {
        // Body scroll lock is the only side effect — keep it co-located with
        // the signal so closing always restores correctly.
        effect(() => {
            this.doc.body.style.overflow = this.isOpen() ? 'hidden' : '';
        });
    }

    open(): void { this.isOpen.set(true); }
    close(): void { this.isOpen.set(false); }
    toggle(): void { this.isOpen.update(v => !v); }
}