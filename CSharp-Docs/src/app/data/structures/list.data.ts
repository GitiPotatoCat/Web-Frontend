// =============================================================================
// List<T> — System.Collections.Generic
// =============================================================================
// The single most-reached-for collection in C#. Backed by a resizing array,
// O(1) amortised append, O(n) inserts elsewhere. Authored by hand from the
// original static-site `list.html` page; every fact here is double-checked
// against Microsoft Learn before being committed.
//
// Authoring notes:
//   • All strings use straight quotes; the renderer applies typographic
//     replacements (smart quotes, en-dashes) at display time only.
//   • Code source uses 4-space indentation; tabs are forbidden.
//   • Keep `lead`, `whenToUse`, and callout `body` to 1-3 sentences max.
//     The page reads better when each section is tight.
// =============================================================================

import type { Structure } from '../types';

export const LIST_DATA: Structure = {
    slug: 'list',
    name: 'List<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.List<T> — array-backed resizable list, O(1) amortised append, O(n) middle insert. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Indexed' },
    ],

    lead:
        'A growable array. Append is amortised O(1); random access by index is O(1); insert and remove anywhere except the end is O(n). The default ordered collection in C#, and the right answer for most read-heavy or append-heavy work.',

    metrics: [
        {
            label: 'Add',
            value: 'O(1) amortized',
            note: 'doubles the backing array on overflow',
        },
        {
            label: 'Index access',
            value: 'O(1)',
            note: 'direct offset into the backing array',
        },
        {
            label: 'Insert / Remove at i',
            value: 'O(n)',
            note: 'shifts every element after i',
        },
    ],

    whenToUse:
        'Reach for List<T> when you want an ordered, indexable collection and most of your work is appending or random-access reading. Avoid it when most operations are inserts or removes in the middle — LinkedList<T> is rarely faster, but a different structure (HashSet, Dictionary, Queue) often is.',

    callout: {
        variant: 'warn',
        title: 'Capacity vs Count',
        body:
            'Count is how many items you have; Capacity is how many fit before the next resize. If you know the size up front, set Capacity (or pass it to the constructor) — it avoids the doubling chain and the GC pressure that comes with it.',
    },

    examples: [
        {
            caption: 'Construct, populate, iterate',
            language: 'csharp',
            source:
                `// Construct — empty, with capacity, or from any IEnumerable
List<int> nums = new();
List<int> sized = new(capacity: 1024);
List<int> seeded = new() { 1, 2, 3 };

// Append — amortised O(1)
nums.Add(42);
nums.AddRange([1, 2, 3, 4]);          // collection expression, C# 12+

// Index access — O(1)
int first = nums[0];

// Insert / Remove at position — O(n)
nums.Insert(0, 99);                    // shifts everything right
nums.RemoveAt(2);

// Iterate — foreach uses the struct enumerator, zero allocations
foreach (int n in nums)
    Console.WriteLine(n);

// Search — Contains is O(n); use HashSet<T> if you need fast membership
bool has42 = nums.Contains(42);

// Sort in place — O(n log n)
nums.Sort();`,
        },
    ],

    properties: [
        {
            name: 'Count',
            type: 'int',
            description: 'Number of items currently in the list. Cheap; reads a backing field.',
        },
        {
            name: 'Capacity',
            type: 'int',
            description:
                'Backing array length. Setting it explicitly avoids the doubling chain when the final size is known.',
        },
        {
            name: 'this[int index]',
            type: 'T',
            description: 'Indexer — O(1) read and write. Throws ArgumentOutOfRangeException for invalid indices.',
        },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → void', complexity: 'O(1) amortized' },
        { name: 'AddRange', signature: 'AddRange(IEnumerable<T> items) → void', complexity: 'O(k)' },
        { name: 'Insert', signature: 'Insert(int index, T item) → void', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(T item) → bool', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(n)' },
        { name: 'IndexOf', signature: 'IndexOf(T item) → int', complexity: 'O(n)' },
        { name: 'Sort', signature: 'Sort() → void', complexity: 'O(n log n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'AsSpan', signature: 'AsSpan() → Span<T>', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'list', label: 'List<T>', accent: 'generic' },
            { id: 'linked', label: 'LinkedList<T>', accent: 'generic' },
            { id: 'array', label: 'T[]', accent: 'primitive' },
            { id: 'arraylist', label: 'ArrayList', accent: 'legacy' },
        ],
        rows: [
            {
                aspect: 'Backing',
                cells: {
                    list: 'Resizing array.',
                    linked: 'Doubly-linked nodes.',
                    array: 'Fixed-size array.',
                    arraylist: 'Resizing array of object.',
                },
            },
            {
                aspect: 'Append',
                cells: {
                    list: 'O(1) amortised.',
                    linked: 'O(1).',
                    array: 'Not supported — fixed size.',
                    arraylist: 'O(1) amortised, plus boxing.',
                },
            },
            {
                aspect: 'Index access',
                cells: {
                    list: 'O(1).',
                    linked: 'O(n) — must traverse.',
                    array: 'O(1) — fastest available.',
                    arraylist: 'O(1) plus unbox cost.',
                },
            },
            {
                aspect: 'Type safety',
                cells: {
                    list: 'Generic — full.',
                    linked: 'Generic — full.',
                    array: 'Generic — full.',
                    arraylist: 'None — object.',
                },
            },
            {
                aspect: 'Best for',
                cells: {
                    list: 'The default ordered collection.',
                    linked: 'Frequent inserts at known nodes.',
                    array: 'Hot loops, fixed sizes, AsSpan() interop.',
                    arraylist: 'Compatibility only — never in new code.',
                },
            },
        ],
    },

    related: [
        { slug: 'linked-list' },
        { slug: 'array' },
        { slug: 'array-list' },
        { slug: 'hash-set' },
        { slug: 'queue' },
    ],
};