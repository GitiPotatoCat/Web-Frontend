import type { Structure } from '../types';

export const LEGACY_SORTED_LIST_DATA: Structure = {
    slug: 'legacy-sorted-list',
    name: 'SortedList (legacy)',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.SortedList — pre-generics sorted map of object → object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Non-generic' },
        { variant: 'warn', label: 'Boxes value types' },
        { variant: 'warn', label: 'O(n) insert at middle' },
        { variant: 'neutral', label: 'Sorted by key' },
    ],

    lead:
        'A sorted key-value map — the .NET 1.0 ancestor of SortedList<TKey, TValue>. Two parallel arrays kept sorted by key; same shape as the generic version, with the boxing tax that any non-generic legacy collection brings. Modern code should pick SortedList<K,V> from System.Collections.Generic.',

    metrics: [
        { label: 'Lookup', value: 'O(log n)', note: 'binary search the keys array' },
        { label: 'Add', value: 'O(n)', note: 'shifts to make room' },
        { label: 'Index by position', value: 'O(1)', note: 'GetByIndex / GetKey' },
    ],

    whenToUse:
        'Reach for the legacy SortedList only when maintaining old code. SortedList<K,V> is the like-for-like replacement; SortedDictionary<K,V> trades higher memory for O(log n) inserts when writes are frequent.',

    examples: [
        {
            caption: 'Sorted object map',
            language: 'csharp',
            source:
                `using System.Collections;

SortedList sl = new();
sl.Add("alice", 95);
sl.Add("bob",   72);
sl.Add(1, "one");                                   // any object key works

// Lookup by key
int alice = (int)sl["alice"]!;

// Lookup by position — unique to SortedList
object firstKey = sl.GetKey(0);
object firstVal = sl.GetByIndex(0);

// Iterate — DictionaryEntry, like Hashtable
foreach (DictionaryEntry e in sl)
    Console.WriteLine($"{e.Key} → {e.Value}");

// Modern equivalent
SortedList<string, int> modern = new();
modern.Add("alice", 95);
int v = modern["alice"];`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of pairs.' },
        { name: 'Capacity', type: 'int', description: 'Backing array length.' },
        { name: 'Keys', type: 'IList', description: 'Sorted keys — also indexable by position.' },
        { name: 'Values', type: 'IList', description: 'Values in key-sorted order — also indexable by position.' },
        { name: 'this[object key]', type: 'object?', description: 'Indexer — O(log n). Set adds or overwrites; read returns null when missing.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(object key, object value) → void', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(object key) → void', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'ContainsKey', signature: 'ContainsKey(object key) → bool', complexity: 'O(log n)' },
        { name: 'ContainsValue', signature: 'ContainsValue(object value) → bool', complexity: 'O(n)' },
        { name: 'GetKey', signature: 'GetKey(int index) → object', complexity: 'O(1)' },
        { name: 'GetByIndex', signature: 'GetByIndex(int index) → object', complexity: 'O(1)' },
        { name: 'IndexOfKey', signature: 'IndexOfKey(object key) → int', complexity: 'O(log n)' },
        { name: 'IndexOfValue', signature: 'IndexOfValue(object value) → int', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'lsl', label: 'SortedList (legacy)', accent: 'legacy' },
            { id: 'sl', label: 'SortedList<K,V>', accent: 'generic' },
            { id: 'sd', label: 'SortedDictionary<K,V>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { lsl: 'None — object.', sl: 'Generic — full.', sd: 'Generic — full.' } },
            { aspect: 'Value types', cells: { lsl: 'Boxed on Add.', sl: 'Stored inline.', sd: 'Stored inline.' } },
            { aspect: 'Lookup', cells: { lsl: 'O(log n) + cast.', sl: 'O(log n).', sd: 'O(log n).' } },
            { aspect: 'Add', cells: { lsl: 'O(n).', sl: 'O(n).', sd: 'O(log n).' } },
            { aspect: 'Best for', cells: { lsl: 'Legacy code only.', sl: 'Read-heavy ordered map.', sd: 'Write-heavy ordered map.' } },
        ],
    },

    related: [
        { slug: 'sorted-list' },
        { slug: 'sorted-dictionary' },
        { slug: 'hashtable' },
    ],
};