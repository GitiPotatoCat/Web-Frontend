import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
    private readonly doc = inject(DOCUMENT);

    /** Whether the palette is currently visible. Components observe this. */
    readonly isOpen = signal(false);

    constructor() {
        if (typeof window === 'undefined') return;

        // Global hotkeys: Cmd+K / Ctrl+K from anywhere; "/" from anywhere
        // EXCEPT when an editable element has focus (input, textarea,
        // contenteditable) — we don't want to hijack actual typing.
        this.doc.addEventListener('keydown', (e: KeyboardEvent) => {
            const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
            const isSlash = e.key === '/' && !this.editableTarget(e);

            if (isCmdK || isSlash) {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape' && this.isOpen()) {
                e.preventDefault();
                this.close();
            }
        });
    }

    open(): void {
        this.isOpen.set(true);
        // Lock body scroll while the modal is open. We restore on close.
        this.doc.body.style.overflow = 'hidden';
    }

    close(): void {
        this.isOpen.set(false);
        this.doc.body.style.overflow = '';
    }

    toggle(): void {
        this.isOpen() ? this.close() : this.open();
    }

    private editableTarget(e: KeyboardEvent): boolean {
        const t = e.target as HTMLElement | null;
        if (!t) return false;
        const tag = t.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
        if (t.isContentEditable) return true;
        return false;
    }
}