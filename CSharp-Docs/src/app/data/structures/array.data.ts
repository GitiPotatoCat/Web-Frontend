// =============================================================================
// Array — System (the language-level array)
// =============================================================================
// Fixed-size, contiguous memory. Allocated on the heap (reference type),
// the elements live inline. The bedrock of every other indexed collection
// in the BCL — List<T> wraps one, Stack<T> wraps one, Queue<T> wraps one.
// Knowing how arrays behave is knowing how half the framework works.
// =============================================================================

import type { Structure } from '../types';

export const ARRAY_DATA: Structure = {
    slug: 'array',
    name: 'T[]',
    namespace: 'primitive',
    metaDescription:
        'C# array (T[]) — fixed-size contiguous heap-allocated buffer, O(1) index access. The primitive every indexed collection is built on. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System' },
        { variant: 'neutral', label: 'Since C# 1.0' },
        { variant: 'ok', label: 'Generic via T[]' },
        { variant: 'warn', label: 'Fixed length' },
        { variant: 'neutral', label: 'Heap-allocated' },
        { variant: 'ok', label: 'Covariant for ref types' },
    ],

    lead:
        'A fixed-size, contiguous block of T-typed slots, allocated on the managed heap. The simplest collection in the BCL and the building block for almost every other one. Index access is O(1); growing one means allocating a new array and copying — there is no resize.',

    metrics: [
        {
            label: 'Index access',
            value: 'O(1)',
            note: 'single offset into the contiguous buffer',
        },
        {
            label: 'Linear search',
            value: 'O(n)',
            note: 'Array.IndexOf walks until a match',
        },
        {
            label: 'Sort',
            value: 'O(n log n)',
            note: 'Array.Sort uses introspective sort',
        },
    ],

    whenToUse:
        'Reach for a raw array when the size is known up front, when you need the absolute fastest possible indexed access, or when you are interoperating with code (Span, P/Invoke, AsSpan) that expects contiguous memory. Otherwise prefer List<T> — it owns an array internally and saves you the resize ceremony.',

    callout: {
        variant: 'note',
        title: 'Covariance is real and surprising',
        body:
            'Reference-type arrays are covariant: a string[] is assignable to an object[]. That sounds convenient until you write a Cat into a Dog[] cast as Animal[] and get an ArrayTypeMismatchException at runtime. Generic collections (List<T>) deliberately broke this — and were right to.',
    },

    diagram: {
        caption: 'Memory layout',
        body:
            `  T[] arr = new T[5];

  ┌──────────┬──────────┬──────────┬──────────┬──────────┐
  │  arr[0]  │  arr[1]  │  arr[2]  │  arr[3]  │  arr[4]  │
  └──────────┴──────────┴──────────┴──────────┴──────────┘
       ▲
       │  one heap allocation, contiguous slots
       │  Length is part of the object header

  arr[2]  →  base + 2 * sizeof(T)   ← this is why index access is O(1)`,
    },

    examples: [
        {
            caption: 'Construct, fill, slice, search',
            language: 'csharp',
            source:
                `// Construct — fixed length set at allocation
int[] nums = new int[5];                           // all zero
int[] seeded = new[] { 1, 2, 3, 4, 5 };
int[] zeros = new int[1024];

// Multidimensional vs jagged
int[,] grid = new int[4, 4];                       // single allocation, 16 ints
int[][] jagged = new int[4][];                     // 4 allocations, each its own length
jagged[0] = new int[3];

// Index access — O(1)
int third = seeded[2];                             // 3
seeded[0] = 99;

// Length — read from object header
int n = seeded.Length;

// Iterate — foreach uses the array's struct enumerator
foreach (int x in seeded)
    Console.WriteLine(x);

// Search — IndexOf is O(n)
int i = Array.IndexOf(seeded, 3);                  // 2

// Sort in place — O(n log n) introspective sort
Array.Sort(seeded);

// Span over the array — zero-cost view, no copy
Span<int> view = seeded.AsSpan();
Span<int> middle = seeded.AsSpan(1, 3);            // start=1, length=3

// Resize is a copy — there is no in-place grow
Array.Resize(ref seeded, 10);                      // allocates a new array

// Clear — sets every element to default(T)
Array.Clear(seeded);`,
        },
    ],

    properties: [
        {
            name: 'Length',
            type: 'int',
            description:
                'Total number of elements. Read from the object header — a single dereference, the cheapest property in the BCL.',
        },
        {
            name: 'Rank',
            type: 'int',
            description:
                'Number of dimensions. 1 for T[], 2 for T[,], 3 for T[,,], and so on.',
        },
        {
            name: 'this[int index]',
            type: 'T',
            description:
                'Indexer — O(1). Bounds-checked; throws IndexOutOfRangeException for invalid indices (the JIT elides the check inside trusted loops).',
        },
    ],

    methods: [
        { name: 'AsSpan', signature: 'AsSpan() → Span<T>', complexity: 'O(1)' },
        { name: 'AsSpan', signature: 'AsSpan(int start, int length) → Span<T>', complexity: 'O(1)' },
        { name: 'CopyTo', signature: 'CopyTo(T[] destination, int index) → void', complexity: 'O(n)' },
        { name: 'Clone', signature: 'Clone() → object', complexity: 'O(n)' },
        { name: 'Array.Sort', signature: 'Array.Sort<T>(T[] array) → void', complexity: 'O(n log n)' },
        { name: 'Array.IndexOf', signature: 'Array.IndexOf<T>(T[] array, T value) → int', complexity: 'O(n)' },
        { name: 'Array.BinarySearch', signature: 'Array.BinarySearch<T>(T[] array, T value) → int', complexity: 'O(log n)' },
        { name: 'Array.Resize', signature: 'Array.Resize<T>(ref T[] array, int newSize) → void', complexity: 'O(n)' },
        { name: 'Array.Clear', signature: 'Array.Clear(Array array) → void', complexity: 'O(n)' },
        { name: 'Array.Reverse', signature: 'Array.Reverse<T>(T[] array) → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'array', label: 'T[]', accent: 'primitive' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
            { id: 'span', label: 'Span<T>', accent: 'primitive' },
            { id: 'mem', label: 'Memory<T>', accent: 'primitive' },
        ],
        rows: [
            {
                aspect: 'Backing',
                cells: {
                    array: 'Itself — a heap allocation.',
                    list: 'A T[] it owns and resizes.',
                    span: 'A reference into existing memory.',
                    mem: 'A heap-storable handle to existing memory.',
                },
            },
            {
                aspect: 'Lifetime',
                cells: {
                    array: 'GC-managed; lives until unreachable.',
                    list: 'Owns its array; same as the list.',
                    span: 'Stack-only — cannot escape the method.',
                    mem: 'Heap-storable — can live in fields, async state.',
                },
            },
            {
                aspect: 'Length',
                cells: {
                    array: 'Fixed at allocation.',
                    list: 'Grows on demand.',
                    span: 'Bound by the slice you took.',
                    mem: 'Bound by the slice you took.',
                },
            },
            {
                aspect: 'Resize',
                cells: {
                    array: 'Allocate + copy via Array.Resize.',
                    list: 'Built in — Add doubles the buffer.',
                    span: 'Not supported.',
                    mem: 'Not supported.',
                },
            },
            {
                aspect: 'Best for',
                cells: {
                    array: 'Hot loops, fixed sizes, interop.',
                    list: 'The default ordered collection.',
                    span: 'Stack-allocated slicing in synchronous code.',
                    mem: 'Buffers crossed across async / heap boundaries.',
                },
            },
        ],
    },

    related: [
        { slug: 'list' },
        { slug: 'span' },
        { slug: 'memory' },
        { slug: 'array-list' },
        { slug: 'bit-array' },
    ],
};