import type { Structure } from '../types';

export const IMMUTABLE_DICTIONARY_DATA: Structure = {
    slug: 'immutable-dictionary',
    name: 'ImmutableDictionary<TKey, TValue>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableDictionary<TKey, TValue> — persistent unordered map backed by a HAMT (hash array mapped trie). O(log n) for everything. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'HAMT — fast in practice' },
        { variant: 'warn', label: 'Unordered' },
    ],

    lead:
        'A persistent unordered key-value map backed by a hash array mapped trie (HAMT). Add, lookup, and remove are all O(log n) but with very small constants — in practice the trie depth is bounded near 6, so reads behave close to O(1). Each modification returns a new dictionary that shares unchanged subtries with its predecessor.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'returns a new map; trie depth ~6 in practice' },
        { label: 'Lookup', value: 'O(log n)', note: 'one hash, one trie walk' },
        { label: 'Remove', value: 'O(log n)', note: 'returns a new map; subtrees mostly shared' },
    ],

    whenToUse:
        'Reach for ImmutableDictionary whenever a key-value snapshot must remain valid even as new versions are produced — configuration with hot-reload, view models flowing through a pipeline, time-travel state in a Redux-style store. Use ConcurrentDictionary when many threads mutate the SAME map; use Dictionary when only one thread mutates and snapshots aren\u2019t needed.',

    callout: {
        variant: 'note',
        title: 'Builders for batched writes',
        body:
            'A loop of SetItem calls allocates a new path per call. Use ToBuilder when you have a batch of changes — the builder mutates internally, then ToImmutable hands off the result with structural sharing intact. Performance gap is dramatic for k operations: O(k log n) vs O(k log n) with much smaller constants and fewer allocations.',
    },

    examples: [
        {
            caption: 'Snapshots and updates',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

// Construct
ImmutableDictionary<string, int> empty = ImmutableDictionary<string, int>.Empty;
ImmutableDictionary<string, int> a = empty
    .Add("one",   1)
    .Add("two",   2)
    .Add("three", 3);

// Lookup — returns new dictionary on writes
bool found = a.TryGetValue("one", out int n);       // n = 1
int    val = a["two"];                               // 2
bool   has = a.ContainsKey("three");

// Modifications return new instances
ImmutableDictionary<string, int> b = a.SetItem("one", 11);
ImmutableDictionary<string, int> c = b.Remove("two");

// Builder for batches
ImmutableDictionary<string, int>.Builder builder = a.ToBuilder();
for (int i = 0; i < 1_000; i++)
    builder["key-" + i] = i;
ImmutableDictionary<string, int> bulk = builder.ToImmutable();

// Custom comparer — case-insensitive keys
ImmutableDictionary<string, int> ci =
    ImmutableDictionary.Create<string, int>(StringComparer.OrdinalIgnoreCase)
        .Add("Hello", 1);

// Iteration — order is unspecified (HAMT walk order)
foreach ((string key, int value) in a)
    Console.WriteLine($"{key} → {value}");`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of pairs in the map.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
        { name: 'Keys', type: 'IEnumerable<TKey>', description: 'Unordered view of keys; safe to enumerate while other threads hold their own snapshots.' },
        { name: 'Values', type: 'IEnumerable<TValue>', description: 'Unordered view of values.' },
        { name: 'KeyComparer', type: 'IEqualityComparer<TKey>', description: 'Key equality comparer in use.' },
        { name: 'ValueComparer', type: 'IEqualityComparer<TValue>', description: 'Value equality comparer for SetItem no-op detection.' },
        { name: 'this[TKey key]', type: 'TValue', description: 'Indexer — O(log n) read. Throws KeyNotFoundException on miss; the map cannot be assigned via the indexer.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(TKey key, TValue value) → ImmutableDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'SetItem', signature: 'SetItem(TKey key, TValue value) → ImmutableDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(TKey key) → ImmutableDictionary<TKey, TValue>', complexity: 'O(log n)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey key, out TValue value) → bool', complexity: 'O(log n)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(log n)' },
        { name: 'ContainsValue', signature: 'ContainsValue(TValue value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → ImmutableDictionary<TKey, TValue>', complexity: 'O(1)' },
        { name: 'ToBuilder', signature: 'ToBuilder() → ImmutableDictionary<TKey, TValue>.Builder', complexity: 'O(1)' },
        { name: 'WithComparers', signature: 'WithComparers(IEqualityComparer<TKey>?, IEqualityComparer<TValue>?) → ImmutableDictionary<TKey, TValue>', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'id', label: 'ImmutableDictionary', accent: 'immutable' },
            { id: 'isd', label: 'ImmutableSortedDictionary', accent: 'immutable' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
            { id: 'cd', label: 'ConcurrentDictionary', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Backing', cells: { id: 'HAMT.', isd: 'AVL tree.', d: 'Hash table.', cd: 'Striped hash table.' } },
            { aspect: 'Add / Lookup', cells: { id: 'O(log n) — small constants.', isd: 'O(log n).', d: 'O(1) average.', cd: 'O(1) average, lock-free reads.' } },
            { aspect: 'Order', cells: { id: 'Unordered.', isd: 'Sorted by key.', d: 'Insertion order on iter.', cd: 'Unordered.' } },
            { aspect: 'Mutation', cells: { id: 'Returns new instance.', isd: 'Returns new instance.', d: 'In place.', cd: 'In place.' } },
            { aspect: 'Best for', cells: { id: 'Snapshot key-value state.', isd: 'Snapshot ordered map.', d: 'The default map.', cd: 'Multi-writer maps.' } },
        ],
    },

    related: [
        { slug: 'immutable-sorted-dictionary' },
        { slug: 'dictionary' },
        { slug: 'concurrent-dictionary' },
        { slug: 'immutable-hash-set' },
    ],
};