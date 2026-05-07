import { computed, Injectable, signal } from '@angular/core';

import type { NamespaceId } from '../data/namespaces';
import type { Slug } from '../data/slugs';
import type { Structure } from '../data/types';
import { listStructures } from '../data/structures';

// =============================================================================
// Types
// =============================================================================

/** A character span [start, end) inside a haystack. */
export type Range = readonly [number, number];

/** One entry in the flattened search index. */
interface IndexEntry {
    readonly slug: Slug;
    readonly name: string;
    readonly namespace: NamespaceId;
    readonly group: string;            // human-readable namespace label
    readonly keywords: string;         // synonyms / aliases / shorthand
}

/** Result of scoring one token against one haystack string. */
interface StageResult {
    readonly score: number;            // -1 = miss; >= 0 = hit
    readonly ranges: ReadonlyArray<Range>;
}

/** Final ranked match returned by the service. */
export interface SearchHit {
    readonly slug: Slug;
    readonly name: string;
    readonly namespace: NamespaceId;
    readonly group: string;
    readonly score: number;
    readonly ranges: ReadonlyArray<Range>;  // ranges into `name`
}

// =============================================================================
// Keyword index — synonyms users actually type
// =============================================================================
// We keep keywords here, NOT inside the structure data files, because they
// are search-engine concern, not editorial content. Putting them in
// data/structures/*.data.ts would conflate two responsibilities.
//
// As we author the remaining 32 structures, we add each one's keywords
// here in lockstep. Compile error if a slug appears here that's not in the
// Slug union — keeps the index honest.
// =============================================================================

const KEYWORDS_BY_SLUG: Partial<Record<Slug, string>> = {
    // Primitive
    'array': 'array raw fixed contiguous buffer t[]',
    'span': 'span slice view stackalloc ref struct window',
    'memory': 'memory heap span async buffer region',

    // Generic
    'list': 'list array-backed resizable dynamic arraylist vector',
    'linked-list': 'linked list doubly linkedlist node chain',
    'stack': 'stack lifo push pop last-in first-out',
    'queue': 'queue fifo enqueue dequeue ring buffer first-in first-out',
    'priority-queue': 'priority queue heap min-heap max-heap pq scheduler',
    'dictionary': 'dictionary dict map hashmap hash map kv lookup associative',
    'sorted-dictionary': 'sorted dictionary ordered map treemap red-black tree',
    'sorted-list': 'sorted list ordered map array-backed indexable',
    'hash-set': 'hashset set unique membership union intersect',
    'sorted-set': 'sorted set ordered unique treeset red-black tree min max',
    'observable-collection': 'observable collection inotify changed binding mvvm wpf maui',

    // Legacy
    'array-list': 'arraylist legacy non-generic object boxing',
    'hashtable': 'hashtable legacy non-generic map dictionary',
    'legacy-stack': 'stack legacy non-generic object lifo',
    'legacy-queue': 'queue legacy non-generic object fifo',
    'legacy-sorted-list': 'sorted list legacy non-generic ordered map',
    'bit-array': 'bitarray bitset bit array flags packed bits bitmap',
    'string-collection': 'stringcollection string collection legacy specialized',

    // Concurrent
    'concurrent-dictionary': 'concurrent dictionary thread-safe lock-free hashmap map striped',
    'concurrent-queue': 'concurrent queue lock-free thread-safe fifo mpmc',
    'concurrent-stack': 'concurrent stack lock-free thread-safe lifo cas',
    'concurrent-bag': 'concurrent bag thread-local work stealing unordered pool',
    'blocking-collection': 'blocking collection producer consumer bounded completeadding channel',

    // Immutable
    'immutable-array': 'immutable array struct frozen readonly persistent snapshot',
    'immutable-list': 'immutable list persistent avl tree structural sharing',
    'immutable-dictionary': 'immutable dictionary persistent map hamt trie frozen',
    'immutable-sorted-dictionary': 'immutable sorted dictionary persistent ordered map avl tree',
    'immutable-hash-set': 'immutable hashset persistent set hamt frozen unique',
    'immutable-sorted-set': 'immutable sorted set persistent ordered unique avl tree min max index',
    'immutable-queue': 'immutable queue persistent fifo two-stack functional',
    'immutable-stack': 'immutable stack persistent lifo cons list functional',
};

// =============================================================================
// Service
// =============================================================================

@Injectable({ providedIn: 'root' })
export class SearchService {
    /** Cached flat index. Rebuilt only if the registry changes — for now,
        it's effectively immutable, so this is a one-shot lazy build. */
    private indexCache: ReadonlyArray<IndexEntry> | null = null;

    /**
     * Reactive query string. Components two-way-bind to this via the
     * palette's input. We expose it as a signal so consumers (and the
     * recent-searches store) can react to changes.
     */
    readonly query = signal<string>('');

    /**
     * Computed signal: the current ranked match list. Recomputes on every
     * query change. Capped at 10 results — beyond that the list becomes
     * impractical to scan, and the lower-ranked tail is rarely useful.
     */
    readonly results = computed<ReadonlyArray<SearchHit>>(() => {
        const q = this.query().trim();
        if (!q) return [];
        return this.search(q, 10);
    });

    // ---- Public API -------------------------------------------------------

    /** Imperative search — used by tests, by the recent-searches preview,
        and by any caller that doesn't want signal reactivity. */
    search(query: string, limit = 10): ReadonlyArray<SearchHit> {
        const tokens = this.tokenize(query);
        if (!tokens.length) return [];

        const index = this.getIndex();
        const matches: SearchHit[] = [];

        for (const entry of index) {
            const r = this.scoreEntry(tokens, entry);
            if (r) {
                matches.push({
                    slug: entry.slug,
                    name: entry.name,
                    namespace: entry.namespace,
                    group: entry.group,
                    score: r.score,
                    ranges: r.ranges,
                });
            }
        }

        matches.sort((a, b) => b.score - a.score);
        return matches.slice(0, limit);
    }

    // ---- Index ------------------------------------------------------------

    private getIndex(): ReadonlyArray<IndexEntry> {
        if (this.indexCache) return this.indexCache;

        const index: IndexEntry[] = listStructures().map(s => ({
            slug: s.slug,
            name: s.name,
            namespace: s.namespace,
            group: this.namespaceLabel(s.namespace),
            keywords: KEYWORDS_BY_SLUG[s.slug] ?? '',
        }));

        this.indexCache = index;
        return index;
    }

    private namespaceLabel(id: NamespaceId): string {
        switch (id) {
            case 'primitive': return 'System';
            case 'generic': return 'Generic';
            case 'legacy': return 'Legacy';
            case 'concurrent': return 'Concurrent';
            case 'immutable': return 'Immutable';
        }
    }

    // ---- Scoring ----------------------------------------------------------

    private tokenize(s: string): ReadonlyArray<string> {
        return s.toLowerCase().trim().split(/\s+/).filter(Boolean);
    }

    /**
     * Scores ONE token against ONE haystack string. Five stages, scored
     * highest-first; the first matching stage wins for that token-haystack
     * pairing. Returns the score plus matched ranges (so the caller can
     * highlight in the rendered result).
     */
    private stageScore(tok: string, hay: string): StageResult {
        if (!tok || !hay) return { score: -1, ranges: [] };

        // Stage 1 — identical
        if (hay === tok) {
            return { score: 1000, ranges: [[0, tok.length]] };
        }

        // Stage 2 — prefix
        if (hay.indexOf(tok) === 0) {
            return { score: 720 - hay.length, ranges: [[0, tok.length]] };
        }

        // Stage 3 — word-start (after non-alphanumeric)
        const wordStart = new RegExp(
            '(^|[^a-z0-9])(' + this.escapeRegExp(tok) + ')',
            'i',
        );
        const m = wordStart.exec(hay);
        if (m) {
            const idx = m.index + m[1]!.length;
            return { score: 500 - idx, ranges: [[idx, idx + tok.length]] };
        }

        // Stage 4 — plain substring
        const i = hay.indexOf(tok);
        if (i > 0) {
            return { score: 300 - i, ranges: [[i, i + tok.length]] };
        }

        // Stage 5 — subsequence (every char in order)
        let qi = 0;
        let first = -1;
        let last = -1;
        const ranges: Range[] = [];
        for (let j = 0; j < hay.length && qi < tok.length; j++) {
            if (hay.charAt(j) === tok.charAt(qi)) {
                if (first < 0) first = j;
                last = j;
                ranges.push([j, j + 1]);
                qi++;
            }
        }
        if (qi === tok.length) {
            const span = last - first + 1;
            return { score: Math.max(5, 140 - span - first), ranges };
        }

        return { score: -1, ranges: [] };
    }

    private scoreEntry(
        tokens: ReadonlyArray<string>,
        entry: IndexEntry,
    ): { score: number; ranges: ReadonlyArray<Range> } | null {
        const nameLower = entry.name.toLowerCase();
        const kwLower = entry.keywords.toLowerCase();

        let total = 0;
        const ranges: Range[] = [];

        for (const tok of tokens) {
            const inName = this.stageScore(tok, nameLower);
            const inKw = this.stageScore(tok, kwLower);

            // Name matches outweigh keyword matches by a small bonus, plus
            // keyword scores are dampened to 55% — keeps "list" above
            // structures that merely *mention* lists in their keywords.
            const nameScore = inName.score >= 0 ? inName.score + 25 : -1;
            const kwScore = inKw.score >= 0 ? inKw.score * 0.55 : -1;

            if (nameScore < 0 && kwScore < 0) return null;     // hard miss

            if (nameScore >= kwScore) {
                total += nameScore;
                ranges.push(...inName.ranges);
            } else {
                total += kwScore;
                // Keyword matches don't contribute highlight ranges — we only
                // highlight what the user actually sees on screen.
            }
        }

        // Single-token queries reward shorter names: "list" → List<T> first,
        // not LinkedList<T> or ImmutableList<T>.
        if (tokens.length === 1) {
            total -= nameLower.length * 0.25;
        }

        return { score: total, ranges: this.mergeRanges(ranges) };
    }

    /** Merges overlapping/adjacent highlight ranges into a clean disjoint set. */
    private mergeRanges(rs: ReadonlyArray<Range>): ReadonlyArray<Range> {
        if (!rs.length) return rs;
        const sorted = [...rs].sort((a, b) => a[0] - b[0]);
        const out: Array<[number, number]> = [[...sorted[0]!] as [number, number]];
        for (let i = 1; i < sorted.length; i++) {
            const cur = sorted[i]!;
            const top = out[out.length - 1]!;
            if (cur[0] <= top[1]) top[1] = Math.max(top[1], cur[1]);
            else out.push([...cur] as [number, number]);
        }
        return out;
    }

    private escapeRegExp(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}