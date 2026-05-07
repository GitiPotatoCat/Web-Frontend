// =============================================================================
// Forte · structure registry
// =============================================================================
// One map — { [slug]: Structure } — that the rest of the app reads from.
//
// Adding a new structure:
//   1. Add the slug to data/slugs.ts
//   2. Author data/structures/{slug}.data.ts
//   3. Import + register here
//
// The TypeScript signature `Record<Slug, Structure>` enforces step 1+3
// automatically — leaving an entry out is a compile error, and registering
// a slug that's not in the union is also a compile error.
//
// As we add the remaining 32 structures (step 9), this file grows; until
// then it intentionally only registers the two authored in step 3 plus
// `as Partial<Record<...>>` so the build doesn't fail. We tighten the
// signature to the full `Record<Slug, Structure>` once all 34 land.
// =============================================================================

import type { Structure } from '../types';
import type { Slug } from '../slugs';
import { LIST_DATA } from './list.data';
import { DICTIONARY_DATA } from './dictionary.data';

/**
 * The registry. Keys are URL slugs; values are the page-shaped objects
 * the structure-page component renders. During step 3 only two entries
 * exist; in step 9 we'll widen this to a strict `Record<Slug, Structure>`.
 */
export const STRUCTURES: Partial<Record<Slug, Structure>> = {
    list: LIST_DATA,
    dictionary: DICTIONARY_DATA,
} as const;

/**
 * O(1) lookup. Returns undefined for unknown slugs so callers (e.g. the
 * router resolver in step 4) can decide whether to redirect to /404.
 */
export function getStructure(slug: Slug): Structure | undefined {
    return STRUCTURES[slug];
}

/**
 * All authored structures, in registration order. Used by:
 *   • the search index (step 5)
 *   • the sidenav nav generation (step 6)
 *   • the home page namespace decks (step 4)
 */
export function listStructures(): ReadonlyArray<Structure> {
    return Object.values(STRUCTURES) as ReadonlyArray<Structure>;
}

/**
 * Filter helper — used by namespace landing pages and the sidenav grouping.
 */
export function listStructuresIn(
    namespaceId: Structure['namespace'],
): ReadonlyArray<Structure> {
    return listStructures().filter(s => s.namespace === namespaceId);
}



import { NAMESPACES, type NamespaceMeta } from '../namespaces';

/**
 * Groups every authored structure by its namespace. Returns one entry per
 * namespace in display order — even namespaces with zero authored
 * structures are included so the sidenav layout stays stable as content
 * is added (no jumpy reflow when a fresh group fills in).
 */
export function listStructuresGrouped(): ReadonlyArray<{
    readonly namespace: NamespaceMeta;
    readonly structures: ReadonlyArray<Structure>;
}> {
    return NAMESPACES.map(ns => ({
        namespace: ns,
        structures: listStructuresIn(ns.id),
    }));
}