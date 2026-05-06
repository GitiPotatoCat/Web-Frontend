import { computed, effect, Injectable, signal } from '@angular/core';

/**
 * The user-selectable mode. 'auto' tracks the OS preference live.
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * The actually-resolved theme. This is what gets applied to the DOM
 * and reflected back in the data-theme attribute.
 */
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'forte-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService 
{
    /** The user's chosen mode — drives everything. */
    readonly mode = signal<ThemeMode>(this.readStoredMode());

    /** Live-tracked OS preference (toggling system settings updates this). */
    private readonly systemDark = signal<boolean>(
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches,
    );

    /** The resolved theme — what the page actually shows. */
    readonly resolved = computed<ResolvedTheme>(() => {
        const m = this.mode();
        if (m === 'auto') return this.systemDark() ? 'dark' : 'light';
        return m;
    });

    constructor() 
    {
        // Subscribe to OS-level theme changes so 'auto' keeps tracking live.
        if (typeof window !== 'undefined') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            mq.addEventListener('change', e => this.systemDark.set(e.matches));
        }

        // Whenever the resolved theme changes, push it to the DOM.
        effect(() => {
            const next = this.resolved();
            this.applyToDom(next);
        });

        // Persist the user's mode (not the resolved value).
        effect(() => {
            try {
                localStorage.setItem(STORAGE_KEY, this.mode());
            } catch {
                /* private mode etc. — silent */
            }
        });
    }

    /** Toggle through light → dark → auto (cycle). */
    cycle(): void 
    {
        const order: ThemeMode[] = ['light', 'dark', 'auto'];
        const next = order[(order.indexOf(this.mode()) + 1) % order.length];
        this.set(next);
    }

    /** Set an explicit mode, with a View Transitions API wipe if available. */
    set(mode: ThemeMode): void 
    {
        const supportsViewTransitions =
            typeof document !== 'undefined' &&
            'startViewTransition' in document &&
            typeof (document as Document & {
                startViewTransition?: (cb: () => void) => unknown;
            }).startViewTransition === 'function';

        if (!supportsViewTransitions) {
            this.mode.set(mode);
            return;
        }

        // Smooth crossfade. Angular signals + View Transitions cooperate well —
        // we only need to set the signal inside the transition callback and the
        // effect() above does the DOM apply within the transition's frame.
        (document as Document & {
            startViewTransition: (cb: () => void) => unknown;
        }).startViewTransition(() => this.mode.set(mode));
    }

    // ---- internals -------------------------------------------------------

    private readStoredMode(): ThemeMode 
    {
        try {
            const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
            if (stored === 'light' || stored === 'dark' || stored === 'auto') {
                return stored;
            }
        } catch {
            /* SSR / private mode — fall through */
        }
        return 'auto';
    }

    private applyToDom(theme: ResolvedTheme): void 
    {
        if (typeof document === 'undefined') return;
        document.documentElement.dataset['theme'] = theme;
    }
}