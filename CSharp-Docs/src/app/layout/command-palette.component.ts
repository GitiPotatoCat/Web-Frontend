import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { CommandPaletteService } from '../core/command-palette.service';
import { RecentSearchesService } from '../core/recent-searches.service';
import { SearchService, type SearchHit } from '../core/search.service';

interface NameSegment {
    readonly text: string;
    readonly highlight: boolean;
}

/**
 * The Cmd+K modal. Mounted globally from <app-root> so its keyboard
 * shortcut works from any page. Three layers stacked vertically:
 *
 *   1. Search input row (icon + input + Esc hint)
 *   2. Results list — recents when query empty; matches when not
 *   3. Footer hint row (↑↓ navigate · ↵ open · ⎋ close)
 *
 * The whole panel is a glass surface with a brand-tinted shadow. The
 * scrim behind it is a translucent dark wash; clicking it dismisses.
 */
@Component({
    selector: 'forte-command-palette',
    standalone: true,
    templateUrl: './command-palette.html',
    styleUrl: './command-palette.scss',
    animations: [
        trigger('palette', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('120ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('100ms ease-in', style({ opacity: 0 })),
            ]),
        ]),
        trigger('panel', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(8px) scale(0.98)' }),
                animate(
                    '180ms cubic-bezier(0.16, 1.0, 0.3, 1.0)',
                    style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
                ),
            ]),
            transition(':leave', [
                animate(
                    '120ms cubic-bezier(0.4, 0, 1, 1)',
                    style({ opacity: 0, transform: 'translateY(4px) scale(0.99)' }),
                ),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
    protected readonly palette = inject(CommandPaletteService);
    protected readonly search = inject(SearchService);
    protected readonly recent = inject(RecentSearchesService);
    private readonly router = inject(Router);

    /** Reference to the input — used for autofocus on open. */
    private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

    /** Index of the active row (-1 means "no row active"). */
    protected readonly active = signal(-1);

    /** True when the user has typed; drives empty-state vs results layout. */
    protected readonly hasQuery = computed(
        () => this.search.query().trim().length > 0,
    );

    /** Pre-segmented result names with highlight ranges resolved. */
    protected readonly resultRows = computed(() =>
        this.search.results().map(hit => ({
            hit,
            segments: this.segmentName(hit),
        })),
    );

    constructor() {
        // Auto-focus + reset on every transition to "open".
        effect(() => {
            if (this.palette.isOpen()) {
                // Reset any stale query/active so the palette opens fresh.
                this.search.query.set('');
                this.active.set(-1);
                // Defer focus to after the :enter animation has begun rendering.
                queueMicrotask(() => this.inputEl()?.nativeElement.focus());
            }
        });

        // Reset active row whenever the result set changes shape.
        effect(() => {
            const len = this.search.results().length;
            // Clamp the active index — if results shrink, don't dangle past the end.
            if (this.active() >= len) this.active.set(len > 0 ? 0 : -1);
        });
    }

    // ---- Input handlers --------------------------------------------------

    protected onQueryInput(value: string): void {
        this.search.query.set(value);
    }

    /**
     * The single keyboard router. Lives on the input so we don't fight
     * focus order with the rest of the document.
     */
    protected onInputKey(e: KeyboardEvent): void {
        const len = this.search.results().length;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.active.set(Math.min(this.active() + 1, len - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.active.set(Math.max(this.active() - 1, 0));
                break;
            case 'Enter': {
                e.preventDefault();
                const i = this.active();
                const hit = this.search.results()[i];
                if (hit) this.openHit(hit);
                break;
            }
        }
    }

    // ---- Activation ------------------------------------------------------

    protected openHit(hit: SearchHit): void {
        this.recent.push(hit.name);
        this.router.navigate(['/s', hit.slug]);
        this.palette.close();
    }

    protected reuseRecent(query: string): void {
        this.search.query.set(query);
        queueMicrotask(() => this.inputEl()?.nativeElement.focus());
    }

    protected removeRecent(e: MouseEvent, query: string): void {
        e.stopPropagation();
        this.recent.remove(query);
    }

    // ---- Click outside ---------------------------------------------------

    /** Scrim click closes the palette. The panel itself stops propagation. */
    protected onScrimClick(): void {
        this.palette.close();
    }

    /** Defensive: catch Escape even if the input loses focus. */
    @HostListener('document:keydown.escape')
    protected onEscape(): void {
        if (this.palette.isOpen()) this.palette.close();
    }

    // ---- Highlight segmentation -----------------------------------------

    /**
     * Walks `hit.ranges` and produces alternating plain/highlight segments
     * for the template — no innerHTML, no XSS, no DOM injection.
     */
    private segmentName(hit: SearchHit): ReadonlyArray<NameSegment> {
        const { name, ranges } = hit;
        if (!ranges.length) return [{ text: name, highlight: false }];

        const segments: NameSegment[] = [];
        let cursor = 0;
        for (const [start, end] of ranges) {
            if (start > cursor) {
                segments.push({ text: name.slice(cursor, start), highlight: false });
            }
            segments.push({ text: name.slice(start, end), highlight: true });
            cursor = end;
        }
        if (cursor < name.length) {
            segments.push({ text: name.slice(cursor), highlight: false });
        }
        return segments;
    }
}