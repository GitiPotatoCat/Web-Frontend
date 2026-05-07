import type { Structure } from '../types';

export const IMMUTABLE_HASH_SET_DATA: Structure = {
    slug: 'immutable-hash-set',
    name: 'ImmutableHashSet<T>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableHashSet<T> — persistent set backed by a HAMT. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'HAMT' },
        { variant: 'warn', label: 'Unordered' },
    ],

    lead:
        'A persistent unordered set backed by a hash array mapped trie. Add, Contains, and Remove are O(log n) with very small constants. Set algebra operations (Union, Intersect, Except) return new sets with maximum structural sharing — the unchanged elements are not re-allocated.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'returns new set; subtrie copy on path' },
        { label: 'Contains', value: 'O(log n)', note: 'one hash, one trie walk' },
        { label: 'Remove', value: 'O(log n)', note: 'returns new set; mostly shared' },
    ],

    whenToUse:
        'Reach for ImmutableHashSet when membership snapshots must persist as new versions form — feature flag sets that flow through middleware, allow-lists handed across modules, deduped accumulators in functional pipelines. Use HashSet when the same thread mutates and no snapshot is needed.',

    callout: {
        variant: 'note',
        title: 'Set algebra produces new sets, cheaply',
        body:
            'Union, Intersect, and Except each return a new ImmutableHashSet that structurally shares as much of both inputs as possible. A union with one element added is essentially Add; a large intersection still walks the smaller side once. The cost is honest, the result is reusable forever.',
    },

    examples: [
        {
            caption: 'Snapshot membership',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

ImmutableHashSet<string> empty = ImmutableHashSet<string>.Empty;
ImmutableHashSet<string> a = empty
    .Add("alpha")
    .Add("beta")
    .Add("gamma");

// Contains — O(log n)
bool has = a.Contains("alpha");

// Add returns new set; original unchanged
ImmutableHashSet<string> b = a.Add("delta");

// Set algebra — every result is a new set
ImmutableHashSet<string> u = a.Union(new[] { "delta", "epsilon" });
ImmutableHashSet<string> i = a.Intersect(new[] { "alpha", "zeta" });   // {alpha}
ImmutableHashSet<string> x = a.Except(new[] { "beta" });                // {alpha, gamma}

// Custom comparer — case-insensitive
ImmutableHashSet<string> ci =
    ImmutableHashSet.Create<string>(StringComparer.OrdinalIgnoreCase)
        .Add("Hello")
        .Add("HELLO");                                                    // dedupes to one entry

// Builder for batched writes
ImmutableHashSet<string>.Builder builder = a.ToBuilder();
foreach (string s in LoadAllowList())
    builder.Add(s);
ImmutableHashSet<string> result = builder.ToImmutable();

IEnumerable<string> LoadAllowList() => new[] { "x", "y" };`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of items.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
        { name: 'KeyComparer', type: 'IEqualityComparer<T>', description: 'Equality comparer in use.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → ImmutableHashSet<T>', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(T item) → ImmutableHashSet<T>', complexity: 'O(log n)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(log n)' },
        { name: 'Union', signature: 'Union(IEnumerable<T> other) → ImmutableHashSet<T>', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Intersect', signature: 'Intersect(IEnumerable<T> other) → ImmutableHashSet<T>', complexity: 'O(min(n,k) log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Except', signature: 'Except(IEnumerable<T> other) → ImmutableHashSet<T>', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'SymmetricExcept', signature: 'SymmetricExcept(IEnumerable<T> other) → ImmutableHashSet<T>', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'IsSubsetOf', signature: 'IsSubsetOf(IEnumerable<T> other) → bool', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'IsSupersetOf', signature: 'IsSupersetOf(IEnumerable<T> other) → bool', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Overlaps', signature: 'Overlaps(IEnumerable<T> other) → bool', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Clear', signature: 'Clear() → ImmutableHashSet<T>', complexity: 'O(1)' },
        { name: 'ToBuilder', signature: 'ToBuilder() → ImmutableHashSet<T>.Builder', complexity: 'O(1)' },
        { name: 'WithComparer', signature: 'WithComparer(IEqualityComparer<T>?) → ImmutableHashSet<T>', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'ihs', label: 'ImmutableHashSet<T>', accent: 'immutable' },
            { id: 'iss', label: 'ImmutableSortedSet<T>', accent: 'immutable' },
            { id: 'hs', label: 'HashSet<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { ihs: 'HAMT, persistent.', iss: 'AVL tree, persistent.', hs: 'Hash table.' } },
            { aspect: 'Add', cells: { ihs: 'O(log n) — small constants.', iss: 'O(log n).', hs: 'O(1) average.' } },
            { aspect: 'Order', cells: { ihs: 'Unordered.', iss: 'Sorted.', hs: 'Insertion order on iter.' } },
            { aspect: 'Snapshot', cells: { ihs: 'Each version stays valid.', iss: 'Each version stays valid.', hs: 'Mutates in place.' } },
            { aspect: 'Best for', cells: { ihs: 'Snapshot membership sets.', iss: 'Snapshot ordered sets.', hs: 'Single-thread membership.' } },
        ],
    },

    related: [
        { slug: 'immutable-sorted-set' },
        { slug: 'hash-set' },
        { slug: 'immutable-dictionary' },
    ],
};