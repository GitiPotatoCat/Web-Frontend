import type { Structure } from '../types';

export const SORTED_LIST_DATA: Structure = {
    slug: 'sorted-list',
    name: 'SortedList<TKey, TValue>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.SortedList<TKey, TValue> — two parallel arrays sorted by key. O(log n) lookup, O(n) insert at random positions. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'warn', label: 'O(n) insert at middle' },
        { variant: 'neutral', label: 'Sorted by key' },
        { variant: 'ok', label: 'Indexable' },
    ],

    lead:
        'A sorted key-value map backed by two parallel arrays — one of keys, one of values, both kept in lock-step sorted order. Lookup is O(log n) via binary search; inserting in the middle is O(n) because it shifts. Tighter memory than SortedDictionary, slower writes; the right shape for read-heavy ordered maps.',

    metrics: [
        { label: 'Lookup', value: 'O(log n)', note: 'binary search the keys array' },
        { label: 'Add', value: 'O(n)', note: 'shifts to make room (O(log n) at the end)' },
        { label: 'Index by position', value: 'O(1)', note: 'GetKeyAtIndex / GetValueAtIndex' },
    ],

    whenToUse:
        'Reach for SortedList when reads dominate and the data set is small to medium — config maps, lookup tables, sorted views built once. The indexable form (GetKeyAtIndex / Values\\[i\\]) is unique among the sorted maps and useful when you need both ordering and positional access.',

    callout: {
        variant: 'warn',
        title: 'O(n) inserts hurt at scale',
        body:
            'Adding a key in the middle of a 100k-entry SortedList shifts roughly 50k slots. If your write rate is anything but rare, switch to SortedDictionary — same ordered semantics, O(log n) inserts, no array shifting.',
    },

    examples: [
        {
            caption: 'Indexable ordered map',
            language: 'csharp',
            source:
                `// Construct
SortedList<string, int> scores = new();
SortedList<string, int> sized = new(capacity: 256);

// Add — O(n) average, O(log n) at the end
scores.Add("alice",   95);
scores.Add("bob",     72);
scores.Add("charlie", 88);

// Indexer by KEY — O(log n)
int alice = scores["alice"];
scores["bob"] = 75;

// Index by POSITION — unique to SortedList among ordered maps
string firstKey = scores.GetKeyAtIndex(0);         // "alice"
int    firstVal = scores.GetValueAtIndex(0);

// TryGetValue — idiomatic safe lookup
if (scores.TryGetValue("charlie", out int v))
    Console.WriteLine(v);

// Walk in key order
foreach ((string name, int s) in scores)
    Console.WriteLine($"{name}: {s}");

// IndexOfKey — binary search returns the position or ~insertionPoint
int idx = scores.IndexOfKey("bob");                // 1
int missing = scores.IndexOfKey("zoe");            // ~3

// Remove
scores.Remove("bob");
scores.RemoveAt(0);`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of pairs.' },
        { name: 'Capacity', type: 'int', description: 'Underlying array length. Set up front to avoid the doubling chain.' },
        { name: 'Keys', type: 'IList<TKey>', description: 'Sorted keys — also indexable by position.' },
        { name: 'Values', type: 'IList<TValue>', description: 'Values in key-sorted order — also indexable by position.' },
        { name: 'Comparer', type: 'IComparer<TKey>', description: 'Key comparer in use.' },
        { name: 'this[TKey key]', type: 'TValue', description: 'Indexer — O(log n). Set overwrites; read throws KeyNotFoundException for missing keys.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(TKey key, TValue value) → void', complexity: 'O(n)' },
        { name: 'TryAdd', signature: 'TryAdd(TKey key, TValue value) → bool', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(TKey key) → bool', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey, out TValue) → bool', complexity: 'O(log n)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(log n)' },
        { name: 'ContainsValue', signature: 'ContainsValue(TValue value) → bool', complexity: 'O(n)' },
        { name: 'IndexOfKey', signature: 'IndexOfKey(TKey key) → int', complexity: 'O(log n)' },
        { name: 'IndexOfValue', signature: 'IndexOfValue(TValue value) → int', complexity: 'O(n)' },
        { name: 'GetKeyAtIndex', signature: 'GetKeyAtIndex(int index) → TKey', complexity: 'O(1)' },
        { name: 'GetValueAtIndex', signature: 'GetValueAtIndex(int index) → TValue', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'TrimExcess', signature: 'TrimExcess() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'sl', label: 'SortedList<K,V>', accent: 'generic' },
            { id: 'sd', label: 'SortedDictionary<K,V>', accent: 'generic' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { sl: 'Two parallel arrays.', sd: 'Red-black tree.', d: 'Hash table.' } },
            { aspect: 'Lookup', cells: { sl: 'O(log n).', sd: 'O(log n).', d: 'O(1) average.' } },
            { aspect: 'Add', cells: { sl: 'O(n).', sd: 'O(log n).', d: 'O(1) average.' } },
            { aspect: 'By position', cells: { sl: 'O(1) GetKey/ValueAt.', sd: 'Not supported.', d: 'Not supported.' } },
            { aspect: 'Memory', cells: { sl: 'Tightest of the three.', sd: 'Tree node overhead.', d: 'Bucket overhead.' } },
            { aspect: 'Best for', cells: { sl: 'Read-heavy ordered map.', sd: 'Write-heavy ordered map.', d: 'The default map.' } },
        ],
    },

    related: [
        { slug: 'sorted-dictionary' },
        { slug: 'dictionary' },
        { slug: 'list' },
        { slug: 'legacy-sorted-list' },
    ],
};