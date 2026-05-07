// =============================================================================
// Span<T> — System (a stack-only view over contiguous memory)
// =============================================================================
// A ref struct that points at a contiguous run of T values somewhere — on
// the heap, on the stack, or in unmanaged memory. Zero allocations, O(1)
// slicing, ironclad lifetime safety enforced by the compiler. The most
// important new C# primitive of the last decade.
// =============================================================================

import type { Structure } from '../types';

export const SPAN_DATA: Structure = {
    slug: 'span',
    name: 'Span<T>',
    namespace: 'primitive',
    metaDescription:
        'System.Span<T> — stack-only view over contiguous memory. Zero allocations, O(1) slicing, compile-time-enforced lifetime safety. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System' },
        { variant: 'neutral', label: 'Since .NET Core 2.1' },
        { variant: 'ok', label: 'Allocation-free' },
        { variant: 'ok', label: 'O(1) slicing' },
        { variant: 'warn', label: 'Stack-only (ref struct)' },
        { variant: 'neutral', label: 'Generic' },
    ],

    lead:
        'A stack-allocated handle to a contiguous range of memory. It might point at a managed array, at stack-allocated bytes, at an unmanaged buffer — Span erases the difference. Slicing is free, bounds are checked, and the compiler refuses to let it escape its method, so it is impossible to dangle.',

    metrics: [
        {
            label: 'Index access',
            value: 'O(1)',
            note: 'one offset into the underlying memory',
        },
        {
            label: 'Slice',
            value: 'O(1)',
            note: 'returns a new Span — no copy',
        },
        {
            label: 'Allocation cost',
            value: 'O(1)',
            note: 'lives on the stack — zero GC',
        },
    ],

    whenToUse:
        'Reach for Span<T> when you need to operate on a section of a buffer — string parsing, binary protocol decoding, in-place numeric work — without paying for substring or array copies. Avoid it whenever your code is async, captures into a closure, or stores it in a field: Span cannot live across an await, and the compiler will tell you so.',

    callout: {
        variant: 'highlight',
        title: 'The "ref struct" rule is the safety',
        body:
            'Span<T> is a ref struct, which means it can never be boxed, captured by a lambda, stored in a field, or live across an await. Those restrictions are exactly what makes Span safe — there is no way to keep one around longer than the memory it points at. If you need any of those things, use Memory<T> instead.',
    },

    examples: [
        {
            caption: 'Slice without allocating',
            language: 'csharp',
            source:
                `// From an array — zero copy
int[] nums = { 1, 2, 3, 4, 5, 6, 7 };
Span<int> all = nums;                              // implicit conversion
Span<int> middle = nums.AsSpan(2, 3);              // [3, 4, 5] — no allocation

// From the stack with stackalloc — also zero allocation
Span<byte> buffer = stackalloc byte[256];
buffer[0] = 0xFF;

// From a string — readonly, zero copy
ReadOnlySpan<char> word = "hello world".AsSpan(0, 5);   // "hello"

// Slice the slice — still no allocation
Span<int> tail = middle[1..];                      // C# range syntax
ReadOnlySpan<char> first = word[..3];              // "hel"

// Iterate — same foreach, same struct enumerator, no boxing
foreach (int n in middle)
    Console.WriteLine(n);

// Mutate in place — writes are visible in the underlying array
middle[0] = 99;
Console.WriteLine(nums[2]);                         // 99

// Pass to a method that takes Span<T> — no allocation crosses the boundary
int sum = SumOf(nums.AsSpan(1, 5));

static int SumOf(ReadOnlySpan<int> s)
{
    int total = 0;
    foreach (int x in s) total += x;
    return total;
}

// You CANNOT do this — the compiler will refuse:
//
//   async Task<int> Bad() => SumOf(stackalloc int[4]);
//   ^^^^^                    ^^^^^^^^^^^^^^^^^^^^^
//   async + ref struct = compile-time error.`,
        },
    ],

    properties: [
        {
            name: 'Length',
            type: 'int',
            description: 'Number of elements visible through this span.',
        },
        {
            name: 'IsEmpty',
            type: 'bool',
            description: 'True when Length is 0.',
        },
        {
            name: 'this[int index]',
            type: 'ref T',
            description:
                'Indexer that returns a ref — assignments mutate the underlying memory directly. Bounds-checked.',
        },
        {
            name: 'this[Range range]',
            type: 'Span<T>',
            description:
                'Range indexer — span[1..^1] returns a sub-span. O(1), no allocation.',
        },
    ],

    methods: [
        { name: 'Slice', signature: 'Slice(int start) → Span<T>', complexity: 'O(1)' },
        { name: 'Slice', signature: 'Slice(int start, int length) → Span<T>', complexity: 'O(1)' },
        { name: 'CopyTo', signature: 'CopyTo(Span<T> destination) → void', complexity: 'O(n)' },
        { name: 'TryCopyTo', signature: 'TryCopyTo(Span<T> destination) → bool', complexity: 'O(n)' },
        { name: 'Fill', signature: 'Fill(T value) → void', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'Reverse', signature: 'Reverse() → void', complexity: 'O(n)' },
        { name: 'IndexOf', signature: 'IndexOf(T value) → int', complexity: 'O(n)' },
        { name: 'BinarySearch', signature: 'BinarySearch(T value) → int', complexity: 'O(log n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'GetEnumerator', signature: 'GetEnumerator() → Enumerator', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'span', label: 'Span<T>', accent: 'primitive' },
            { id: 'rspan', label: 'ReadOnlySpan<T>', accent: 'primitive' },
            { id: 'mem', label: 'Memory<T>', accent: 'primitive' },
            { id: 'array', label: 'T[]', accent: 'primitive' },
        ],
        rows: [
            {
                aspect: 'Lives on',
                cells: {
                    span: 'Stack only.',
                    rspan: 'Stack only.',
                    mem: 'Anywhere — heap-storable.',
                    array: 'Heap (the array), reference variable on stack.',
                },
            },
            {
                aspect: 'Async-safe',
                cells: {
                    span: 'No — cannot cross await.',
                    rspan: 'No — cannot cross await.',
                    mem: 'Yes.',
                    array: 'Yes.',
                },
            },
            {
                aspect: 'Mutability',
                cells: {
                    span: 'Read-write.',
                    rspan: 'Read-only — write attempts are compile errors.',
                    mem: 'Both — Memory<T> and ReadOnlyMemory<T>.',
                    array: 'Read-write.',
                },
            },
            {
                aspect: 'Allocation',
                cells: {
                    span: 'Zero — pure stack value.',
                    rspan: 'Zero — pure stack value.',
                    mem: 'One small struct on the heap when needed.',
                    array: 'Heap allocation per array.',
                },
            },
            {
                aspect: 'Best for',
                cells: {
                    span: 'Hot synchronous loops, parsing, in-place edits.',
                    rspan: 'Reading slices of strings or buffers.',
                    mem: 'Async pipelines that pass buffers around.',
                    array: 'When you actually need to own the storage.',
                },
            },
        ],
    },

    related: [
        { slug: 'memory' },
        { slug: 'array' },
        { slug: 'list' },
    ],
};