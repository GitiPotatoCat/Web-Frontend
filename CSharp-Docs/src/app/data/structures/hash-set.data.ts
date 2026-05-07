import type { Structure } from '../types';

export const HASH_SET_DATA: Structure = {
    slug: 'hash-set',
    name: 'HashSet<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.HashSet<T> — hash-table-backed set, O(1) average for Add/Contains/Remove. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 3.5' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Unordered' },
        { variant: 'ok', label: 'Set algebra built in' },
    ],

    lead:
        'A set of unique values backed by a hash table. Add, Contains, and Remove are O(1) on average; iteration is unordered. The set algebra methods (UnionWith, IntersectWith, ExceptWith) work in-place and are O(n+m), which makes HashSet the right shape for membership tests and set arithmetic alike.',

    metrics: [
        { label: 'Add', value: 'O(1)', note: 'amortised; rehashes on overflow' },
        { label: 'Contains', value: 'O(1)', note: 'one hash, one bucket walk' },
        { label: 'Remove', value: 'O(1)', note: 'unlinks from the bucket chain' },
    ],

    whenToUse:
        'Reach for HashSet whenever you ask "have I seen this?" — dedupe pipelines, visited-node tracking in graph walks, set difference between two collections. Prefer SortedSet<T> when you need ordered iteration; prefer Dictionary<K,V> when each item carries a payload.',

    callout: {
        variant: 'note',
        title: 'Pass a comparer for value equality',
        body:
            'The default comparer (EqualityComparer<T>.Default) uses GetHashCode and Equals. For case-insensitive strings pass StringComparer.OrdinalIgnoreCase; for records, equality is by value automatically; for custom classes you usually want to provide an IEqualityComparer<T> rather than override Equals globally.',
    },

    examples: [
        {
            caption: 'Membership and set algebra',
            language: 'csharp',
            source:
                `// Construct
HashSet<string> seen = new();
HashSet<string> ci = new(StringComparer.OrdinalIgnoreCase);
HashSet<int>    seeded = new(new[] { 1, 2, 3 });

// Add — returns false if already present (no throw)
bool added = seen.Add("page-1");                   // true
seen.Add("page-1");                                 // false

// Contains — O(1)
bool has = seen.Contains("page-1");

// Remove — returns whether anything was removed
seen.Remove("page-1");

// Set algebra (mutates the receiver in place)
HashSet<int> a = new(new[] { 1, 2, 3, 4 });
HashSet<int> b = new(new[] { 3, 4, 5, 6 });
a.UnionWith(b);          // a now {1, 2, 3, 4, 5, 6}
a.IntersectWith(b);      // a now {3, 4, 5, 6}
a.ExceptWith(b);         // a now {}
a.SymmetricExceptWith(b);// xor: items only in one or the other

// Predicate-based check without allocating
bool subset = a.IsSubsetOf(b);
bool overlaps = a.Overlaps(b);

// Bulk dedupe via constructor
List<string> messy = new() { "a", "b", "a", "c", "b" };
HashSet<string> unique = new(messy);               // {a, b, c}`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items in the set. Tracked, not computed.' },
        { name: 'Comparer', type: 'IEqualityComparer<T>', description: 'Equality comparer in use.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → bool', complexity: 'O(1)' },
        { name: 'Remove', signature: 'Remove(T item) → bool', complexity: 'O(1)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'UnionWith', signature: 'UnionWith(IEnumerable<T> other) → void', complexity: 'O(k)' },
        { name: 'IntersectWith', signature: 'IntersectWith(IEnumerable<T> other) → void', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'ExceptWith', signature: 'ExceptWith(IEnumerable<T> other) → void', complexity: 'O(k)' },
        { name: 'SymmetricExceptWith', signature: 'SymmetricExceptWith(IEnumerable<T> other) → void', complexity: 'O(k)' },
        { name: 'IsSubsetOf', signature: 'IsSubsetOf(IEnumerable<T> other) → bool', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'IsSupersetOf', signature: 'IsSupersetOf(IEnumerable<T> other) → bool', complexity: 'O(k)' },
        { name: 'Overlaps', signature: 'Overlaps(IEnumerable<T> other) → bool', complexity: 'O(k)' },
        { name: 'EnsureCapacity', signature: 'EnsureCapacity(int capacity) → int', complexity: 'O(n)' },
        { name: 'TrimExcess', signature: 'TrimExcess() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'hs', label: 'HashSet<T>', accent: 'generic' },
            { id: 'ss', label: 'SortedSet<T>', accent: 'generic' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
            { id: 'ihs', label: 'ImmutableHashSet<T>', accent: 'immutable' },
        ],
        rows: [
            { aspect: 'Backing', cells: { hs: 'Hash table.', ss: 'Red-black tree.', d: 'Hash table.', ihs: 'HAMT, persistent.' } },
            { aspect: 'Add', cells: { hs: 'O(1) average.', ss: 'O(log n).', d: 'O(1) average.', ihs: 'O(log n), returns new.' } },
            { aspect: 'Contains', cells: { hs: 'O(1) average.', ss: 'O(log n).', d: 'O(1) average.', ihs: 'O(log n).' } },
            { aspect: 'Order', cells: { hs: 'Insertion order on iterate.', ss: 'Sorted.', d: 'Insertion order.', ihs: 'Unordered.' } },
            { aspect: 'Best for', cells: { hs: 'Membership, dedupe.', ss: 'Ordered unique values.', d: 'Key → value map.', ihs: 'Snapshot sets.' } },
        ],
    },

    related: [
        { slug: 'sorted-set' },
        { slug: 'dictionary' },
        { slug: 'immutable-hash-set' },
        { slug: 'list' },
    ],
};