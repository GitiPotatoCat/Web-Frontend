// =============================================================================
// Forte · slug union — the closed set of valid URL paths
// =============================================================================
// The slugs here are URL fragments under /s/{slug}. Adding a new docs page
// means: (1) add its slug to this union, (2) write data/structures/{slug}.data.ts,
// (3) register it in data/structures/index.ts. The type system enforces all
// three steps stay in sync — leave any of them out and TypeScript fails.
//
// Slugs use kebab-case, hyphenated. We avoid generics in slugs ("list-t" is
// preferred over "list<t>") because <> are URL-encoded ugly characters and
// because the route-friendly form is what users will actually share.
// =============================================================================

export type Slug =
    // Primitive / System
    | 'array'
    | 'span'
    | 'memory'

    // Generic
    | 'list'
    | 'linked-list'
    | 'stack'
    | 'queue'
    | 'priority-queue'
    | 'dictionary'
    | 'sorted-dictionary'
    | 'sorted-list'
    | 'hash-set'
    | 'sorted-set'
    | 'observable-collection'

    // Legacy
    | 'array-list'
    | 'hashtable'
    | 'legacy-stack'
    | 'legacy-queue'
    | 'legacy-sorted-list'
    | 'bit-array'
    | 'string-collection'

    // Concurrent
    | 'concurrent-dictionary'
    | 'concurrent-queue'
    | 'concurrent-stack'
    | 'concurrent-bag'
    | 'blocking-collection'

    // Immutable
    | 'immutable-array'
    | 'immutable-list'
    | 'immutable-dictionary'
    | 'immutable-sorted-dictionary'
    | 'immutable-hash-set'
    | 'immutable-sorted-set'
    | 'immutable-queue'
    | 'immutable-stack';




// At the bottom of slugs.ts, alongside the existing exports:

/**
 * The closed list of every slug — same shape as the Slug union, available
 * at runtime for narrowing. If you add a new slug, the as-const guarantees
 * the union and array stay aligned.
 */
export const SLUGS = [
    'array',
    'span',
    'memory',
    'list',
    'linked-list',
    'stack',
    'queue',
    'priority-queue',
    'dictionary',
    'sorted-dictionary',
    'sorted-list',
    'hash-set',
    'sorted-set',
    'observable-collection',
    'array-list',
    'hashtable',
    'legacy-stack',
    'legacy-queue',
    'legacy-sorted-list',
    'bit-array',
    'string-collection',
    'concurrent-dictionary',
    'concurrent-queue',
    'concurrent-stack',
    'concurrent-bag',
    'blocking-collection',
    'immutable-array',
    'immutable-list',
    'immutable-dictionary',
    'immutable-sorted-dictionary',
    'immutable-hash-set',
    'immutable-sorted-set',
    'immutable-queue',
    'immutable-stack',
] as const satisfies readonly Slug[];

const SLUG_SET: ReadonlySet<string> = new Set(SLUGS);

/** Type-guard: narrows an arbitrary string to the Slug union. */
export function isSlug(value: string): value is Slug {
    return SLUG_SET.has(value);
}