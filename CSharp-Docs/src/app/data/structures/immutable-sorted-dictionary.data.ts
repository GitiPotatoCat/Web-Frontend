import type { Structure } from '../types';

export const IMMUTABLE_SORTED_DICTIONARY_DATA: Structure = {
    slug: 'immutable-sorted-dictionary',
    name: 'ImmutableSortedDictionary<TKey, TValue>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableSortedDictionary<TKey, TValue> — persistent ordered map backed by an AVL tree. O(log n) for everything. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Sorted by key' },
        { variant: 'ok', label: 'AVL tree' },
    ],

    lead:
        'A persistent ordered key-value map backed by an AVL tree. Every operation is O(log n); iteration is in key order. Each modification returns a new dictionary that shares unchanged subtrees with the predecessor — same shape as ImmutableSortedSet, with a value attached to each key.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'tree rotation; returns a new map' },
        { label: 'Lookup', value: 'O(log n)', note: 'descend the tree' },
        { label: 'Iteration', value: 'O(n)', note: 'in-order traversal, sorted' },
    ],

    whenToUse:
        'Reach for ImmutableSortedDictionary when ordered iteration matters AND snapshots must stay valid as new versions are produced — sorted views in a UI that flow through pipelines, key-ordered audit logs that retain history, time-series caches keyed by timestamp. Use ImmutableDictionary when order doesn\u2019t matter; use SortedDictionary when no snapshots are needed.',

    callout: {
        variant: 'note',
        title: 'Custom comparers via WithComparers',
        body:
            'The default comparer is Comparer<TKey>.Default. To re-key by a custom order — case-insensitive strings, reverse numeric, locale-aware sorts — call WithComparers and pass an IComparer<TKey>. The result is a new map; the operation is O(n) because the tree must be rebuilt under the new order.',
    },

    examples: [
        {
            caption: 'Sorted snapshots',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

ImmutableSortedDictionary<string, int> empty =
    ImmutableSortedDictionary<string, int>.Empty;

ImmutableSortedDictionary<string, int> a = empty
    .Add("Linus", 54)
    .Add("Ada",   36)
    .Add("Grace", 85);

// Iteration is sorted by key
foreach ((string name, int years) in a)
    Console.WriteLine($"{name}: {years}");
// Ada, Grace, Linus

// SetItem — overwrite or add
ImmutableSortedDictionary<string, int> b = a.SetItem("Ada", 37);

// Remove returns a new map
ImmutableSortedDictionary<string, int> c = b.Remove("Linus");

// Builder pattern for batches
ImmutableSortedDictionary<string, int>.Builder builder = a.ToBuilder();
for (int i = 0; i < 1_000; i++)
    builder["key-" + i] = i;
ImmutableSortedDictionary<string, int> bulk = builder.ToImmutable();

// Custom comparer — reverse alphabetical
ImmutableSortedDictionary<string, int> rev =
    ImmutableSortedDictionary
        .Create<string, int>(Comparer<string>.Create((x, y) => y.CompareTo(x)))
        .AddRange(a);`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of pairs.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
        { name: 'Keys', type: 'IEnumerable<TKey>', description: 'Sorted view of keys.' },
        { name: 'Values', type: 'IEnumerable<TValue>', description: 'Values in key-sorted order.' },
        { name: 'KeyComparer', type: 'IComparer<TKey>', description: 'Key order comparer in use.' },
        { name: 'ValueComparer', type: 'IEqualityComparer<TValue>', description: 'Value equality comparer for SetItem no-op detection.' },
        { name: 'this[TKey key]', type: 'TValue', description: 'Indexer — O(log n) read. Throws KeyNotFoundException on miss; cannot be assigned.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(TKey key, TValue value) → ImmutableSortedDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'SetItem', signature: 'SetItem(TKey key, TValue value) → ImmutableSortedDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(TKey key) → ImmutableSortedDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey key, out TValue value) → bool', complexity: 'O(log n)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(log n)' },
        { name: 'ContainsValue', signature: 'ContainsValue(TValue value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → ImmutableSortedDictionary<TKey, TValue>', complexity: 'O(1)' },
        { name: 'ToBuilder', signature: 'ToBuilder() → ImmutableSortedDictionary<TKey, TValue>.Builder', complexity: 'O(1)' },
        { name: 'WithComparers', signature: 'WithComparers(IComparer<TKey>?, IEqualityComparer<TValue>?) → ImmutableSortedDictionary<TKey, TValue>', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'isd', label: 'ImmutableSortedDictionary', accent: 'immutable' },
            { id: 'id', label: 'ImmutableDictionary', accent: 'immutable' },
            { id: 'sd', label: 'SortedDictionary<K,V>', accent: 'generic' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { isd: 'AVL tree, persistent.', id: 'HAMT, persistent.', sd: 'AVL tree.', d: 'Hash table.' } },
            { aspect: 'Add / Lookup', cells: { isd: 'O(log n).', id: 'O(log n) — small constants.', sd: 'O(log n).', d: 'O(1) average.' } },
            { aspect: 'Order', cells: { isd: 'Sorted by key.', id: 'Unordered.', sd: 'Sorted by key.', d: 'Insertion order on iter.' } },
            { aspect: 'Snapshots', cells: { isd: 'Each version stays valid.', id: 'Each version stays valid.', sd: 'No — mutates in place.', d: 'No.' } },
            { aspect: 'Best for', cells: { isd: 'Snapshot ordered map.', id: 'Snapshot key-value state.', sd: 'Single-thread ordered.', d: 'The default map.' } },
        ],
    },

    related: [
        { slug: 'immutable-dictionary' },
        { slug: 'sorted-dictionary' },
        { slug: 'immutable-sorted-set' },
        { slug: 'dictionary' },
    ],
};