// =============================================================================
// Forte · namespace registry
// =============================================================================
// The five C# BCL namespaces represented in this docs site. Order here
// determines display order in the sidenav, the home page, and the search
// results. Each entry carries:
//
//   • a stable id (the literal type drives all other type-checking)
//   • a display label
//   • a CSS dot class (matches --ns-*-bg in tokens.scss)
//   • the SVG icon path under /assets/icons
//   • the official C# namespace string (for breadcrumbs and SEO)
//   • a one-sentence description used on the home page namespace decks
// =============================================================================

/**
 * Literal union of all namespace ids. Used everywhere a namespace is
 * referenced (Structure.namespace, ComparisonColumn.accent, etc.) so
 * typos are compile errors, not 404s.
 */
export type NamespaceId =
    | 'primitive'
    | 'generic'
    | 'legacy'
    | 'concurrent'
    | 'immutable';

export interface NamespaceMeta {
    readonly id: NamespaceId;
    readonly label: string;
    readonly fullName: string;
    readonly description: string;
    readonly iconPath: string;
    /** CSS color token name — read by components via var(--ns-${id}). */
    readonly cssVar: string;
}

export const NAMESPACES: ReadonlyArray<NamespaceMeta> = [
    {
        id: 'primitive',
        label: 'Array · Span',
        fullName: 'System',
        description:
            'Raw memory primitives — fixed arrays, stack-allocated slices, async-safe heap regions. The foundation everything else is built on.',
        iconPath: 'assets/icons/ns-primitive.svg',
        cssVar: '--ns-primitive',
    },
    {
        id: 'generic',
        label: 'Generic',
        fullName: 'System.Collections.Generic',
        description:
            'The everyday collections — List, Dictionary, HashSet, Stack, Queue, and friends. What you reach for nine times out of ten.',
        iconPath: 'assets/icons/ns-generic.svg',
        cssVar: '--ns-generic',
    },
    {
        id: 'legacy',
        label: 'Legacy',
        fullName: 'System.Collections',
        description:
            'Pre-generics collections kept for compatibility. ArrayList, Hashtable, BitArray. Documented for completeness; almost never the right choice today.',
        iconPath: 'assets/icons/ns-legacy.svg',
        cssVar: '--ns-legacy',
    },
    {
        id: 'concurrent',
        label: 'Concurrent',
        fullName: 'System.Collections.Concurrent',
        description:
            'Lock-free, thread-safe collections for multi-producer / multi-consumer code. ConcurrentDictionary, ConcurrentQueue, BlockingCollection.',
        iconPath: 'assets/icons/ns-concurrent.svg',
        cssVar: '--ns-concurrent',
    },
    {
        id: 'immutable',
        label: 'Immutable',
        fullName: 'System.Collections.Immutable',
        description:
            'Persistent collections with structural sharing — every modification returns a new instance, the old one stays valid. The functional toolbox.',
        iconPath: 'assets/icons/ns-immutable.svg',
        cssVar: '--ns-immutable',
    },
] as const;

/**
 * O(1) lookup helper. Avoid `NAMESPACES.find()` calls scattered across
 * components — call this instead so we have one place to optimise later.
 */
export function getNamespace(id: NamespaceId): NamespaceMeta {
    const found = NAMESPACES.find(n => n.id === id);
    // Cannot legally happen because NamespaceId is a closed union, but we
    // throw rather than return undefined so any future mistake is loud.
    if (!found) throw new Error(`Unknown namespace id: ${id}`);
    return found;
}