import type { Structure } from '../types';

export const SORTED_DICTIONARY_DATA: Structure = {
    slug: 'sorted-dictionary',
    name: 'SortedDictionary<TKey, TValue>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.SortedDictionary<TKey, TValue> — red-black tree, O(log n) Add/Lookup/Remove, sorted iteration. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Sorted by key' },
        { variant: 'neutral', label: 'Red-black tree' },
    ],

    lead:
        'A key-value map that stays sorted by key. Backed by a red-black tree, so every operation is O(log n) but iteration is in key order. Choose it over Dictionary<K,V> when you need ordered enumeration; choose SortedList<K,V> when memory matters more than insert speed.',

    metrics: [
        { label: 'Add', value: 'O(log n)', note: 'tree rotation on insert' },
        { label: 'Lookup', value: 'O(log n)', note: 'descend the tree' },
        { label: 'Iteration', value: 'O(n)', note: 'in-order traversal, sorted' },
    ],

    whenToUse:
        'Reach for SortedDictionary when ordered iteration matters and writes happen frequently — log lines indexed by timestamp, leaderboards keyed by score, anything where you walk in order. Prefer SortedList<K,V> for read-heavy workloads with rare writes; prefer Dictionary<K,V> when order doesn\u2019t matter.',

    callout: {
        variant: 'note',
        title: 'SortedDictionary vs SortedList',
        body:
            'Both stay sorted by key. SortedDictionary uses a tree — O(log n) inserts that don\u2019t shift anything. SortedList uses two arrays — O(n) inserts that do, but tighter memory and faster index access. The rule of thumb: more writes → SortedDictionary, more reads → SortedList.',
    },

    examples: [
        {
            caption: 'Sorted iteration',
            language: 'csharp',
            source:
                `// Construct
SortedDictionary<string, int> ages = new();
SortedDictionary<string, int> ci = new(StringComparer.OrdinalIgnoreCase);

// Add — O(log n); throws on duplicate key
ages.Add("Ada",   36);
ages.Add("Linus", 54);
ages.Add("Grace", 85);

// Indexer set or overwrite
ages["Ada"] = 37;

// TryGetValue — idiomatic safe lookup
if (ages.TryGetValue("Ada", out int age))
    Console.WriteLine(age);

// Iteration is sorted by key
foreach ((string name, int years) in ages)
    Console.WriteLine($"{name}: {years}");
// Ada, Grace, Linus

// Range / first / last via LINQ on the sorted enumerator
string first = ages.First().Key;                   // "Ada"
string last  = ages.Last().Key;                    // "Linus"

// Remove
ages.Remove("Linus");`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of pairs in the map.' },
        { name: 'Keys', type: 'KeyCollection', description: 'Keys in sorted order — live view, not a snapshot.' },
        { name: 'Values', type: 'ValueCollection', description: 'Values in key-sorted order — live view.' },
        { name: 'Comparer', type: 'IComparer<TKey>', description: 'Key comparer in use; defaults to Comparer<TKey>.Default.' },
        { name: 'this[TKey key]', type: 'TValue', description: 'Indexer — O(log n). Set overwrites; read throws KeyNotFoundException for missing keys.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(TKey key, TValue value) → void', complexity: 'O(log n)' },
        { name: 'TryAdd', signature: 'TryAdd(TKey key, TValue value) → bool', complexity: 'O(log n)' },
        { name: 'Remove', signature: 'Remove(TKey key) → bool', complexity: 'O(log n)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey, out TValue) → bool', complexity: 'O(log n)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(log n)' },
        { name: 'ContainsValue', signature: 'ContainsValue(TValue value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'sd', label: 'SortedDictionary<K,V>', accent: 'generic' },
            { id: 'sl', label: 'SortedList<K,V>', accent: 'generic' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
            { id: 'id', label: 'ImmutableSortedDictionary', accent: 'immutable' },
        ],
        rows: [
            { aspect: 'Backing', cells: { sd: 'Red-black tree.', sl: 'Two parallel arrays.', d: 'Hash table.', id: 'AVL tree, persistent.' } },
            { aspect: 'Add', cells: { sd: 'O(log n).', sl: 'O(n) (shifts).', d: 'O(1) average.', id: 'O(log n), returns new.' } },
            { aspect: 'Lookup', cells: { sd: 'O(log n).', sl: 'O(log n).', d: 'O(1) average.', id: 'O(log n).' } },
            { aspect: 'Memory', cells: { sd: 'Higher — node overhead.', sl: 'Tightest of the three.', d: 'Bucket overhead.', id: 'Higher — node overhead.' } },
            { aspect: 'Order', cells: { sd: 'Sorted by key.', sl: 'Sorted by key.', d: 'Insertion order.', id: 'Sorted by key.' } },
            { aspect: 'Best for', cells: { sd: 'Write-heavy ordered map.', sl: 'Read-heavy ordered map.', d: 'The default map.', id: 'Snapshot ordered map.' } },
        ],
    },

    related: [
        { slug: 'dictionary' },
        { slug: 'sorted-list' },
        { slug: 'sorted-set' },
        { slug: 'immutable-sorted-dictionary' },
    ],
};