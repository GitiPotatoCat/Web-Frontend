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