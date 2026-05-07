import type { Structure } from '../types';

export const SORTED_SET_DATA: Structure = {
    slug: 'sorted-set',
    name: 'SortedSet<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.SortedSet<T> — red-black tree of unique sorted values. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Sorted' },
        { variant: 'ok', label: 'Range views' },
    ],

    lead:
        'A set of unique values kept in sorted order, backed by a red-black tree. Add, Contains, and Remove are O(log n); iteration walks in-order. Min, Max, and GetViewBetween give you cheap access to the extremes and ranges, which is what HashSet can\u2019t do.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'tree rotation on insert' },
        { label: 'Contains', value: 'O(log n)', note: 'descend the tree' },
        { label: 'Min / Max', value: 'O(log n)', note: 'leftmost / rightmost descent' },
    ],

    whenToUse:
        'Reach for SortedSet when ordered iteration matters or you need range queries — sorted log keys, leaderboards walked top-to-bottom, half-open intervals via GetViewBetween. Use HashSet when order doesn\u2019t matter; the constant-factor cost of the tree is real.',

    callout: {
        variant: 'highlight',
        title: 'GetViewBetween is a live window',
        body:
            'GetViewBetween returns a SortedSet that mirrors the slice of the original set between two bounds. Inserts into the original within the range show up in the view; inserts into the view outside the range throw. Cheap, expressive, and unique to SortedSet.',
    },

    examples: [
        {
            caption: 'Sorted, ranged, set algebra',
            language: 'csharp',
            source:
                `// Construct
SortedSet<int>    nums = new(new[] { 7, 2, 9, 4, 1 });
SortedSet<string> names = new(StringComparer.OrdinalIgnoreCase);

// Add — returns false on duplicates
nums.Add(5);
nums.Add(2);                                        // false, already present

// Iteration is sorted
foreach (int n in nums) Console.WriteLine(n);       // 1, 2, 4, 5, 7, 9

// Min and Max — O(log n)
int min = nums.Min;
int max = nums.Max;

// Range view — live window between two bounds
SortedSet<int> mid = nums.GetViewBetween(3, 8);     // {4, 5, 7}
foreach (int n in mid) Console.WriteLine(n);

// Set algebra (in place)
SortedSet<int> a = new(new[] { 1, 2, 3, 4 });
SortedSet<int> b = new(new[] { 3, 4, 5, 6 });
a.UnionWith(b);
a.IntersectWith(b);
a.ExceptWith(b);

// Reverse iteration
foreach (int n in nums.Reverse())
    Console.WriteLine(n);                          // 9, 7, 5, 4, 2, 1`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items in the set.' },
        { name: 'Min', type: 'T', description: 'Smallest element. O(log n).' },
        { name: 'Max', type: 'T', description: 'Largest element. O(log n).' },
        { name: 'Comparer', type: 'IComparer<T>', description: 'Order comparer in use.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → bool', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(T item) → bool', complexity: 'O(log n)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(log n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'GetViewBetween', signature: 'GetViewBetween(T lower, T upper) → SortedSet<T>', complexity: 'O(log n)' },
        { name: 'Reverse', signature: 'Reverse() → IEnumerable<T>', complexity: 'O(1)' },
        { name: 'UnionWith', signature: 'UnionWith(IEnumerable<T> other) → void', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'IntersectWith', signature: 'IntersectWith(IEnumerable<T> other) → void', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'ExceptWith', signature: 'ExceptWith(IEnumerable<T> other) → void', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'IsSubsetOf', signature: 'IsSubsetOf(IEnumerable<T> other) → bool', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
    ],

    comparison: {
        columns: [
            { id: 'ss', label: 'SortedSet<T>', accent: 'generic' },
            { id: 'hs', label: 'HashSet<T>', accent: 'generic' },
            { id: 'iss', label: 'ImmutableSortedSet<T>', accent: 'immutable' },
            { id: 'sd', label: 'SortedDictionary<K,V>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { ss: 'Red-black tree.', hs: 'Hash table.', iss: 'AVL tree, persistent.', sd: 'Red-black tree.' } },
            { aspect: 'Add', cells: { ss: 'O(log n).', hs: 'O(1) average.', iss: 'O(log n), returns new.', sd: 'O(log n).' } },
            { aspect: 'Order', cells: { ss: 'Sorted.', hs: 'Unordered.', iss: 'Sorted.', sd: 'Sorted by key.' } },
            { aspect: 'Min/Max', cells: { ss: 'O(log n).', hs: 'Not supported.', iss: 'O(log n).', sd: 'First/Last via LINQ.' } },
            { aspect: 'Range views', cells: { ss: 'GetViewBetween — live.', hs: 'Not supported.', iss: 'Snapshot only.', sd: 'Not supported.' } },
            { aspect: 'Best for', cells: { ss: 'Ordered unique values.', hs: 'Membership tests.', iss: 'Snapshot ordered sets.', sd: 'Ordered key-value map.' } },
        ],
    },

    related: [
        { slug: 'hash-set' },
        { slug: 'sorted-dictionary' },
        { slug: 'immutable-sorted-set' },
        { slug: 'priority-queue' },
    ],
};