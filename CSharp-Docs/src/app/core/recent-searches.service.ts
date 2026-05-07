import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'forte-recent-searches';
const MAX_ENTRIES = 5;

@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
    /** Reactive list of recent queries — most recent first. */
    readonly recent = signal<ReadonlyArray<string>>(this.read());

    /** Push a new query to the top. Deduplicates and caps to MAX_ENTRIES. */
    push(query: string): void {
        const q = query.trim();
        if (!q) return;

        const next = [q, ...this.recent().filter(x => x !== q)].slice(0, MAX_ENTRIES);
        this.recent.set(next);
        this.write(next);
    }

    /** Drop one entry. Used by the per-row delete button in the palette. */
    remove(query: string): void {
        const next = this.recent().filter(x => x !== query);
        this.recent.set(next);
        this.write(next);
    }

    /** Clear all recents — for the "Clear" link in the palette empty state. */
    clear(): void {
        this.recent.set([]);
        this.write([]);
    }

    // ---- internals -------------------------------------------------------

    private read(): ReadonlyArray<string> {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : [];
        } catch {
            return [];
        }
    }

    private write(next: ReadonlyArray<string>): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            /* private mode etc. — silent */
        }
    }
}