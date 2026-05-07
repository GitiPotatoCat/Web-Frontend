import type { Structure } from '../types';

export const ARRAY_LIST_DATA: Structure = {
    slug: 'array-list',
    name: 'ArrayList',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.ArrayList — pre-generics resizing list of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Non-generic' },
        { variant: 'warn', label: 'Boxes value types' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'warn', label: 'Avoid in new code' },
    ],

    lead:
        'A resizing list of object — the .NET 1.0 answer to dynamic arrays, before generics existed. Same shape as List<T> (O(1) amortised append, O(n) middle insert) plus an unavoidable cost: every value type that goes in gets boxed onto the heap, and every read needs an unsafe cast on the way out. Use List<T> in new code; this page exists for the moments you maintain old code.',

    metrics: [
        { label: 'Add', value: 'O(1) amortized', note: 'doubles on overflow; boxes value types' },
        { label: 'Index access', value: 'O(1)', note: 'returns object; cast required' },
        { label: 'Insert / Remove at i', value: 'O(n)', note: 'shifts everything after i' },
    ],

    whenToUse:
        'Reach for ArrayList only when interacting with code from before .NET 2.0 that has not been migrated to generics. In every other case List<T> is faster, safer, and easier to read. The Microsoft Learn page on ArrayList itself recommends List<T>.',

    callout: {
        variant: 'warn',
        title: 'Boxing is the real cost',
        body:
            'Every int, every struct, every value type stored in an ArrayList is allocated on the heap as a boxed copy. A million-entry ArrayList<int> equivalent is a million extra heap allocations and a million extra GC pressures. List<int> stores the values inline. The asymptotic story is identical; the actual cost is not.',
    },

    examples: [
        {
            caption: 'How it looked, why we don\'t anymore',
            language: 'csharp',
            source:
                `using System.Collections;

// Construct
ArrayList items = new();
ArrayList sized = new(capacity: 1024);
ArrayList seeded = new(new[] { 1, "two", 3.0 });   // mixed types — anything goes

// Add — boxes if the value is a value type
items.Add(42);              // int → boxed
items.Add("hello");         // already a reference type
items.Add(3.14);            // double → boxed
items.AddRange(new[] { 1, 2, 3 });

// Index access — returns object, cast required
int first = (int)items[0];                          // unbox + cast
string second = (string)items[1];

// Iterate — must cast inside the loop
foreach (object o in items)
{
    if (o is int n) Console.WriteLine(n);
}

// Insert / Remove — same O(n) shifting as List<T>
items.Insert(0, 99);
items.RemoveAt(2);
items.Remove(42);                                   // searches linearly

// The modern equivalent — strongly typed, no boxing
List<int> modern = new() { 1, 2, 3 };
modern.Add(42);                                      // stored as int, no allocation`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of items currently in the list.' },
        { name: 'Capacity', type: 'int', description: 'Backing array length. Set up front to avoid the doubling chain.' },
        { name: 'this[int index]', type: 'object', description: 'Indexer — O(1). Returns object; the caller must cast and may need to unbox.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(object value) → int', complexity: 'O(1) amortized' },
        { name: 'AddRange', signature: 'AddRange(ICollection c) → void', complexity: 'O(k)' },
        { name: 'Insert', signature: 'Insert(int index, object value) → void', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(object obj) → void', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'Contains', signature: 'Contains(object item) → bool', complexity: 'O(n)' },
        { name: 'IndexOf', signature: 'IndexOf(object value) → int', complexity: 'O(n)' },
        { name: 'Sort', signature: 'Sort() → void', complexity: 'O(n log n)' },
        { name: 'BinarySearch', signature: 'BinarySearch(object value) → int', complexity: 'O(log n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → object[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'al', label: 'ArrayList', accent: 'legacy' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
            { id: 'arr', label: 'T[]', accent: 'primitive' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { al: 'None — object.', list: 'Generic — full.', arr: 'Generic — full.' } },
            { aspect: 'Value types', cells: { al: 'Boxed on every Add.', list: 'Stored inline.', arr: 'Stored inline.' } },
            { aspect: 'Add', cells: { al: 'O(1) amortised + boxing.', list: 'O(1) amortised.', arr: 'Not supported.' } },
            { aspect: 'Index access', cells: { al: 'O(1) + cast / unbox.', list: 'O(1).', arr: 'O(1) — fastest available.' } },
            { aspect: 'Best for', cells: { al: 'Maintenance only.', list: 'The default ordered list.', arr: 'Hot loops, fixed sizes.' } },
        ],
    },

    related: [
        { slug: 'list' },
        { slug: 'array' },
        { slug: 'hashtable' },
    ],
};