// =============================================================================
// Dictionary<TKey, TValue> — System.Collections.Generic
// =============================================================================
// Hash-table-backed associative array. The most-used non-list collection
// in C#. O(1) average for everything; degrades on bad hash distributions.
// =============================================================================

import type { Structure } from '../types';

export const DICTIONARY_DATA: Structure = {
    slug: 'dictionary',
    name: 'Dictionary<K,V>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.Dictionary<TKey, TValue> — hash-backed associative array, O(1) average for Add, Lookup, Remove. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Unordered' },
    ],

    lead:
        'A hash table from keys to values. Add, lookup and remove are O(1) on average — the constants are small but the fixed cost per operation is higher than a List index access. The default associative collection in C#, and the right answer almost any time you need a key-to-value map.',

    metrics: [
        {
            label: 'Add',
            value: 'O(1)',
            note: 'amortised — rehashes on load-factor overflow',
        },
        {
            label: 'Lookup',
            value: 'O(1)',
            note: 'one hash, one bucket walk',
        },
        {
            label: 'Remove',
            value: 'O(1)',
            note: 'unlinks from the bucket chain',
        },
    ],

    whenToUse:
        'Reach for Dictionary<K,V> whenever you have keys and values, lookups dominate, and order does not matter. If you need ordered iteration, consider SortedDictionary; if you need thread-safety, ConcurrentDictionary; if you need an immutable snapshot, ImmutableDictionary.',

    callout: {
        variant: 'note',
        title: 'TryGetValue is the idiom',
        body:
            'Avoid the ContainsKey-then-index pattern — it hashes twice. TryGetValue performs the lookup once and returns whether the key existed in a single call. Same in CollectionsMarshal.GetValueRefOrNullRef when you need to mutate a value in place.',
    },

    diagram: {
        caption: 'How a key resolves',
        body:
            `  key ──hash──▶  bucket index ──▶  bucket chain
                                          │
                                          ├─▶ entry: key, value, next
                                          ├─▶ entry: key, value, next
                                          └─▶ ∅

  collisions land in the same bucket and chain forward.
  load factor too high → rehash to next prime size.`,
    },

    examples: [
        {
            caption: 'Construct, lookup, mutate',
            language: 'csharp',
            source:
                `// Construct — empty, with capacity, with comparer, or seeded
Dictionary<string, int> ages = new();
Dictionary<string, int> sized = new(capacity: 1024);
Dictionary<string, int> caseInsensitive = new(StringComparer.OrdinalIgnoreCase);

// Add — throws if the key already exists
ages.Add("Ada", 36);

// Indexer — sets or overwrites; reads throw KeyNotFoundException on miss
ages["Ada"] = 37;

// TryGetValue — the idiomatic safe lookup
if (ages.TryGetValue("Ada", out int age))
    Console.WriteLine($"Ada is {age}");

// TryAdd — returns false if the key was already present (no throw)
if (ages.TryAdd("Linus", 54))
    Console.WriteLine("added");

// Iterate — KeyValuePair<K, V> by reference, no allocations
foreach ((string name, int years) in ages)
    Console.WriteLine($"{name}: {years}");

// Remove — returns whether anything was removed
ages.Remove("Ada");

// Bulk seed via collection expression (C# 12+)
Dictionary<string, int> seeded = new()
{
    ["x"] = 1,
    ["y"] = 2,
};`,
        },
    ],

    properties: [
        {
            name: 'Count',
            type: 'int',
            description: 'Number of key-value pairs currently stored.',
        },
        {
            name: 'Keys',
            type: 'KeyCollection',
            description:
                'Live view over the keys. Iterating it is allocation-free; not a snapshot — mutations to the dictionary are visible through it.',
        },
        {
            name: 'Values',
            type: 'ValueCollection',
            description:
                'Live view over the values. Same allocation and snapshot semantics as Keys.',
        },
        {
            name: 'Comparer',
            type: 'IEqualityComparer<TKey>',
            description:
                'The key comparer in use. Defaults to EqualityComparer<TKey>.Default; override at construction for case-insensitive or custom equality.',
        },
        {
            name: 'this[TKey key]',
            type: 'TValue',
            description:
                'Indexer — O(1) average. Setting overwrites; reading throws KeyNotFoundException for missing keys.',
        },
    ],

    methods: [
        { name: 'Add', signature: 'Add(TKey key, TValue value) → void', complexity: 'O(1)' },
        { name: 'TryAdd', signature: 'TryAdd(TKey key, TValue value) → bool', complexity: 'O(1)' },
        { name: 'Remove', signature: 'Remove(TKey key) → bool', complexity: 'O(1)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey, out TValue) → bool', complexity: 'O(1)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(1)' },
        { name: 'ContainsValue', signature: 'ContainsValue(TValue value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'EnsureCapacity', signature: 'EnsureCapacity(int capacity) → int', complexity: 'O(n)' },
        { name: 'TrimExcess', signature: 'TrimExcess() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'dict', label: 'Dictionary<K,V>', accent: 'generic' },
            { id: 'sorted', label: 'SortedDictionary<K,V>', accent: 'generic' },
            { id: 'concurrent', label: 'ConcurrentDictionary', accent: 'concurrent' },
            { id: 'immutable', label: 'ImmutableDictionary', accent: 'immutable' },
            { id: 'hashtable', label: 'Hashtable', accent: 'legacy' },
        ],
        rows: [
            {
                aspect: 'Backing',
                cells: {
                    dict: 'Hash table.',
                    sorted: 'Red-black tree.',
                    concurrent: 'Striped hash table.',
                    immutable: 'HAMT (hash array mapped trie).',
                    hashtable: 'Hash table of object.',
                },
            },
            {
                aspect: 'Add / Lookup',
                cells: {
                    dict: 'O(1) average.',
                    sorted: 'O(log n).',
                    concurrent: 'O(1) average, lock-free reads.',
                    immutable: 'O(log n) — returns a new map.',
                    hashtable: 'O(1) average plus boxing.',
                },
            },
            {
                aspect: 'Order',
                cells: {
                    dict: 'Insertion order on iteration.',
                    sorted: 'Sorted by key.',
                    concurrent: 'Unordered.',
                    immutable: 'Unordered.',
                    hashtable: 'Unordered.',
                },
            },
            {
                aspect: 'Thread safety',
                cells: {
                    dict: 'None.',
                    sorted: 'None.',
                    concurrent: 'Safe — designed for it.',
                    immutable: 'Safe — values cannot change.',
                    hashtable: 'Reads safe, writes need a lock.',
                },
            },
            {
                aspect: 'Best for',
                cells: {
                    dict: 'The default key-value map.',
                    sorted: 'Ordered iteration by key.',
                    concurrent: 'Multi-writer scenarios.',
                    immutable: 'Snapshot-style state.',
                    hashtable: 'Compatibility only.',
                },
            },
        ],
    },

    related: [
        { slug: 'sorted-dictionary' },
        { slug: 'hash-set' },
        { slug: 'concurrent-dictionary' },
        { slug: 'immutable-dictionary' },
        { slug: 'hashtable' },
    ],
};