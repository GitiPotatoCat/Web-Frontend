import type { Structure } from '../types';

export const IMMUTABLE_SORTED_SET_DATA: Structure = {
    slug: 'immutable-sorted-set',
    name: 'ImmutableSortedSet<T>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableSortedSet<T> — persistent ordered set backed by an AVL tree. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'AVL tree' },
        { variant: 'ok', label: 'O(log n) by index' },
    ],

    lead:
        'A persistent ordered set backed by an AVL tree. Add, Contains, and Remove are O(log n); iteration walks in order. Unique among the immutable collections, the tree carries subtree counts, so accessing the i-th element is O(log n) via an indexer — sorted snapshots that double as indexable sequences.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'rotation + path copy' },
        { label: 'Contains', value: 'O(log n)', note: 'descend the tree' },
        { label: 'Indexer', value: 'O(log n)', note: 'subtree counts make rank lookup logarithmic' },
    ],

    whenToUse:
        'Reach for ImmutableSortedSet when ordered membership matters AND snapshots must persist — sorted leaderboards passed across modules, range views shared between threads, time-windowed audit sets. Use SortedSet when no snapshot is needed; use ImmutableHashSet when ordering doesn\u2019t matter.',

    callout: {
        variant: 'highlight',
        title: 'Indexable sorted set',
        body:
            'ImmutableSortedSet exposes an indexer — set[42] returns the 42nd element in sorted order, O(log n). The AVL nodes carry subtree sizes so rank queries are logarithmic. No other immutable collection in the BCL gives you sorted indexing without first materialising to a list.',
    },

    examples: [
        {
            caption: 'Sorted, ranged, indexable',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

ImmutableSortedSet<int> empty = ImmutableSortedSet<int>.Empty;
ImmutableSortedSet<int> a = empty
    .Add(7).Add(2).Add(9).Add(4).Add(1);

// Iteration is sorted
foreach (int n in a) Console.WriteLine(n);          // 1, 2, 4, 7, 9

// Sorted-set indexer — unique to this type
int third = a[2];                                   // 4

// Min and Max — both O(log n)
int min = a.Min;
int max = a.Max;

// Range view — like SortedSet.GetViewBetween
ImmutableSortedSet<int> mid = a.Range(3, 8);        // {4, 7}

// Set algebra returns new sets
ImmutableSortedSet<int> b = a.Union(new[] { 5, 6 });
ImmutableSortedSet<int> c = a.Intersect(new[] { 4, 7, 100 });

// Reverse — lazy enumerable, not a new set
foreach (int n in a.Reverse())
    Console.WriteLine(n);

// Custom comparer — descending integers
ImmutableSortedSet<int> desc =
    ImmutableSortedSet.Create<int>(Comparer<int>.Create((x, y) => y.CompareTo(x)))
        .Union(a);`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of items.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
        { name: 'Min', type: 'T', description: 'Smallest element. O(log n).' },
        { name: 'Max', type: 'T', description: 'Largest element. O(log n).' },
        { name: 'KeyComparer', type: 'IComparer<T>', description: 'Order comparer in use.' },
        { name: 'this[int index]', type: 'T', description: 'Sorted-set indexer — O(log n) by rank.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T value) → ImmutableSortedSet<T>', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(T value) → ImmutableSortedSet<T>', complexity: 'O(log n)' },
        { name: 'Contains', signature: 'Contains(T value) → bool', complexity: 'O(log n)' },
        { name: 'Range', signature: 'Range(T fromValue, T toValue) → ImmutableSortedSet<T>', complexity: 'O(log n)' },
        { name: 'Reverse', signature: 'Reverse() → IEnumerable<T>', complexity: 'O(1)' },
        { name: 'Union', signature: 'Union(IEnumerable<T> other) → ImmutableSortedSet<T>', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Intersect', signature: 'Intersect(IEnumerable<T> other) → ImmutableSortedSet<T>', complexity: 'O(min(n,k) log n)' as Structure['methods'][number]['complexity'] },
        { name: 'Except', signature: 'Except(IEnumerable<T> other) → ImmutableSortedSet<T>', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'IsSubsetOf', signature: 'IsSubsetOf(IEnumerable<T> other) → bool', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'Clear', signature: 'Clear() → ImmutableSortedSet<T>', complexity: 'O(1)' },
        { name: 'ToBuilder', signature: 'ToBuilder() → ImmutableSortedSet<T>.Builder', complexity: 'O(1)' },
        { name: 'WithComparer', signature: 'WithComparer(IComparer<T>?) → ImmutableSortedSet<T>', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'iss', label: 'ImmutableSortedSet<T>', accent: 'immutable' },
            { id: 'ihs', label: 'ImmutableHashSet<T>', accent: 'immutable' },
            { id: 'ss', label: 'SortedSet<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { iss: 'AVL tree, persistent.', ihs: 'HAMT, persistent.', ss: 'Red-black tree.' } },
            { aspect: 'Add', cells: { iss: 'O(log n) — returns new.', ihs: 'O(log n) — returns new.', ss: 'O(log n) in place.' } },
            { aspect: 'Order', cells: { iss: 'Sorted.', ihs: 'Unordered.', ss: 'Sorted.' } },
            { aspect: 'Indexable', cells: { iss: 'Yes — O(log n) by rank.', ihs: 'No.', ss: 'No.' } },
            { aspect: 'Best for', cells: { iss: 'Snapshot ordered sets.', ihs: 'Snapshot membership sets.', ss: 'Single-thread ordered.' } },
        ],
    },

    related: [
        { slug: 'immutable-hash-set' },
        { slug: 'sorted-set' },
        { slug: 'immutable-sorted-dictionary' },
    ],
};