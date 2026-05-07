import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    signal,
    viewChild,
    viewChildren,
} from '@angular/core';

/**
 * One entry in the TOC — corresponds to one section heading on the page.
 */
export interface TocEntry {
    /** DOM id of the section heading on the page (must be unique). */
    readonly id: string;
    /** Label rendered in the rail. */
    readonly label: string;
    /** Optional eyebrow above the label, e.g. "Decision". */
    readonly eyebrow?: string;
}

/**
 * Right-rail "On this page" navigation with scroll spy.
 *
 * Lifecycle:
 *
 *   1. After view init, find every section element by id and observe it
 *      with a single IntersectionObserver.
 *
 *   2. The observer's callback updates a Set<id> of currently-visible
 *      sections. The active entry is the FIRST sections-array entry whose
 *      id is in that Set — i.e., the topmost visible section. Falling
 *      back to the closest section above the viewport when nothing is
 *      visible (during fast scrolls between very-tall sections).
 *
 *   3. When the input identity changes (route navigation), the existing
 *      observer is disconnected and a fresh one is built. This keeps the
 *      component reusable across routes without needing to remount.
 */
@Component({
    selector: 'forte-page-toc',
    standalone: true,
    templateUrl: './page-toc.html',
    styleUrl: './page-toc.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTocComponent implements AfterViewInit {
    /** Sections to track. Array order matters — it determines the rail order. */
    readonly sections = input.required<ReadonlyArray<TocEntry>>();

    /** Optional heading shown above the rail. Defaults to "On this page". */
    readonly heading = input<string>('On this page');

    /** Active section id (or null when nothing is being tracked). */
    protected readonly activeId = signal<string | null>(null);

    /** Pixel offset (top) of the active rail item — used by the indicator bar. */
    protected readonly indicatorTop = signal<number>(0);
    protected readonly indicatorHeight = signal<number>(0);

    private readonly destroyRef = inject(DestroyRef);
    private readonly itemRefs = viewChildren<ElementRef<HTMLLIElement>>('item');
    private readonly listRef = viewChild<ElementRef<HTMLUListElement>>('list');

    /** Set of ids currently intersecting. Mutable, not exposed. */
    private readonly visibleIds = new Set<string>();
    private observer: IntersectionObserver | null = null;
    /** Cached map of section elements so we don't query the DOM twice per tick. */
    private trackedElements: ReadonlyArray<HTMLElement> = [];

    constructor() {
        // Re-wire when the section list changes (route navigation between
        // structure pages). We schedule a microtask so the new sections have
        // had a chance to render before we observe them.
        effect(() => {
            // Read the input to register the dependency.
            this.sections();
            queueMicrotask(() => this.rewireObserver());
        });

        // Reposition the indicator when active changes.
        effect(() => {
            this.activeId();
            // Defer to allow Angular's binding to settle the active row's classes
            // before we measure offsetTop.
            queueMicrotask(() => this.updateIndicatorPosition());
        });

        this.destroyRef.onDestroy(() => this.disconnectObserver());
    }

    ngAfterViewInit(): void {
        this.rewireObserver();
    }

    /** Click handler — scrolls the page section into view. */
    protected scrollTo(id: string, e?: MouseEvent): void {
        e?.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;

        // We push the URL hash so the address bar reflects the section. We
        // do this manually rather than rely on routerLink fragment because the
        // page uses smooth scroll already from styles.scss html { scroll-behavior }.
        history.replaceState(null, '', '#' + id);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.activeId.set(id);
    }

    // ---- Observer lifecycle ---------------------------------------------

    private rewireObserver(): void {
        this.disconnectObserver();
        this.visibleIds.clear();

        const ids = this.sections().map(s => s.id);
        const elements = ids
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (!elements.length) return;
        this.trackedElements = elements;

        // Trigger zone: top of the viewport down to ~45%. The negative bottom
        // margin shrinks the observation rectangle so a section is "active"
        // only while its top is in roughly the upper third of the screen.
        this.observer = new IntersectionObserver(
            entries => {
                for (const e of entries) {
                    const id = (e.target as HTMLElement).id;
                    if (e.isIntersecting) this.visibleIds.add(id);
                    else this.visibleIds.delete(id);
                }
                this.recomputeActive();
            },
            {
                rootMargin: '-80px 0px -55% 0px',
                threshold: 0,
            },
        );

        elements.forEach(el => this.observer?.observe(el));
    }

    private disconnectObserver(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    /** Pick the highest-priority visible section as active. */
    private recomputeActive(): void {
        const ids = this.sections().map(s => s.id);

        // Topmost visible — preserves the array order and feels right when
        // multiple sections fit in the viewport at once.
        const firstVisible = ids.find(id => this.visibleIds.has(id));
        if (firstVisible) {
            this.activeId.set(firstVisible);
            return;
        }

        // No section is in the trigger zone (e.g. a fast scroll, or a tall
        // section took up the entire viewport). Pick the section closest to,
        // but above, the viewport top. This keeps the rail responsive even
        // during rapid scrolling.
        const scrollY = window.scrollY;
        let best: { id: string; top: number } | null = null;
        for (const el of this.trackedElements) {
            const top = el.getBoundingClientRect().top + scrollY;
            if (top <= scrollY + 100) {
                if (!best || top > best.top) best = { id: el.id, top };
            }
        }
        this.activeId.set(best?.id ?? ids[0] ?? null);
    }

    /** Move the indicator bar to align with the active row. */
    private updateIndicatorPosition(): void {
        const id = this.activeId();
        if (!id) return;

        const items = this.itemRefs();
        const list = this.listRef()?.nativeElement;
        if (!list) return;

        for (const ref of items) {
            const li = ref.nativeElement;
            if (li.dataset['id'] === id) {
                const listRect = list.getBoundingClientRect();
                const itemRect = li.getBoundingClientRect();
                this.indicatorTop.set(itemRect.top - listRect.top);
                this.indicatorHeight.set(itemRect.height);
                return;
            }
        }
    }
}