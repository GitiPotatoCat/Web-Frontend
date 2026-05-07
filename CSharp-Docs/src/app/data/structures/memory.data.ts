// =============================================================================
// Memory<T> — System (the heap-storable cousin of Span)
// =============================================================================
// What Span<T> is for synchronous code, Memory<T> is for code that crosses
// async boundaries, lives in fields, or needs to be held longer than a
// single method. It points at the same kinds of buffers Span does, but it
// is itself a normal struct — no ref-struct restrictions. The price is
// indirection: you call .Span on it to get the actual contiguous view.
// =============================================================================

import type { Structure } from '../types';

export const MEMORY_DATA: Structure = {
    slug: 'memory',
    name: 'Memory<T>',
    namespace: 'primitive',
    metaDescription:
        'System.Memory<T> — heap-storable handle to contiguous memory, async-safe alternative to Span<T>. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System' },
        { variant: 'neutral', label: 'Since .NET Core 2.1' },
        { variant: 'ok', label: 'Async-safe' },
        { variant: 'ok', label: 'Heap-storable' },
        { variant: 'neutral', label: 'Generic' },
        { variant: 'warn', label: 'Indirection vs Span' },
    ],

    lead:
        'A struct that holds the same kind of reference Span<T> does, without the ref-struct restrictions. You can put it in a field, pass it across an await, capture it in a lambda. When you need to operate on the data, you ask for its Span. This is the type async pipelines use to move buffers around without copying.',

    metrics: [
        {
            label: '.Span access',
            value: 'O(1)',
            note: 'returns a Span over the same memory',
        },
        {
            label: 'Slice',
            value: 'O(1)',
            note: 'returns a new Memory — no copy',
        },
        {
            label: 'Allocation cost',
            value: 'O(1)',
            note: 'small struct; pinning may add a handle',
        },
    ],

    whenToUse:
        'Reach for Memory<T> when buffers need to cross async boundaries — reading from a Stream into a buffer, passing a window of data through a pipeline of async transformers, holding a region in a field of a long-lived object. Use Span<T> instead inside any synchronous hot loop where the buffer never needs to outlive the method.',

    callout: {
        variant: 'note',
        title: '.Span is the bridge',
        body:
            'Memory<T>.Span gives you a Span over the same memory. The Span is stack-only as always, so you call .Span at the moment you actually want to operate on the data and use the resulting Span synchronously. The Memory itself is what travels across awaits — it is the heap-storable handle, the Span is the working view.',
    },

    diagram: {
        caption: 'Memory and Span',
        body:
            `  Memory<byte> mem = buffer;                ← can live in a field, cross await

      ┌────────────────────────┐
      │  Memory<byte>          │   small heap-storable struct
      │  ↓ holds reference to ↓│
      └────────────────────────┘
                  │
                  ▼
      ┌─────────────────────────────────────────┐
      │   the actual contiguous T-typed memory  │
      └─────────────────────────────────────────┘
                  ▲
                  │ .Span gives you a stack-only view
                  │
      Span<byte> view = mem.Span;           ← use synchronously, then drop`,
    },

    examples: [
        {
            caption: 'Async-friendly buffer use',
            language: 'csharp',
            source:
                `// From an array — zero copy
byte[] buffer = new byte[1024];
Memory<byte> mem = buffer;
ReadOnlyMemory<char> hello = "hello".AsMemory();

// Slice — still zero copy
Memory<byte> head = mem[..512];
Memory<byte> tail = mem.Slice(512, 256);

// Cross an await with Memory — Span couldn't do this
async Task<int> ReadFirstChunkAsync(Stream s, Memory<byte> destination)
{
    int read = await s.ReadAsync(destination);
    return read;
}

// At the moment you operate on the bytes, ask for the Span
async Task ProcessAsync(Memory<byte> region)
{
    int read = await ReadFirstChunkAsync(stream, region);

    // Synchronous block — Span is fine here
    Span<byte> view = region.Span[..read];
    for (int i = 0; i < view.Length; i++)
        view[i] ^= 0xFF;
}

// Pinning when handing memory to native code
using (MemoryHandle handle = mem.Pin())
{
    unsafe
    {
        byte* p = (byte*)handle.Pointer;
        // call into native code — memory will not move
    }
}`,
        },
    ],

    properties: [
        {
            name: 'Length',
            type: 'int',
            description: 'Number of elements this Memory points at.',
        },
        {
            name: 'IsEmpty',
            type: 'bool',
            description: 'True when Length is 0.',
        },
        {
            name: 'Span',
            type: 'Span<T>',
            description:
                'A Span over the same memory. Use it for the synchronous part of your work; do not store it in a field.',
        },
    ],

    methods: [
        { name: 'Slice', signature: 'Slice(int start) → Memory<T>', complexity: 'O(1)' },
        { name: 'Slice', signature: 'Slice(int start, int length) → Memory<T>', complexity: 'O(1)' },
        { name: 'CopyTo', signature: 'CopyTo(Memory<T> destination) → void', complexity: 'O(n)' },
        { name: 'TryCopyTo', signature: 'TryCopyTo(Memory<T> destination) → bool', complexity: 'O(n)' },
        { name: 'Pin', signature: 'Pin() → MemoryHandle', complexity: 'O(1)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'mem', label: 'Memory<T>', accent: 'primitive' },
            { id: 'rmem', label: 'ReadOnlyMemory<T>', accent: 'primitive' },
            { id: 'span', label: 'Span<T>', accent: 'primitive' },
            { id: 'array', label: 'T[]', accent: 'primitive' },
        ],
        rows: [
            {
                aspect: 'Lives on',
                cells: {
                    mem: 'Anywhere — fields, async state, captures.',
                    rmem: 'Anywhere — same as Memory<T>.',
                    span: 'Stack only.',
                    array: 'Heap (the array itself).',
                },
            },
            {
                aspect: 'Async-safe',
                cells: {
                    mem: 'Yes.',
                    rmem: 'Yes.',
                    span: 'No.',
                    array: 'Yes.',
                },
            },
            {
                aspect: 'Mutability',
                cells: {
                    mem: 'Read-write.',
                    rmem: 'Read-only.',
                    span: 'Mirror — Span<T> read-write, ReadOnlySpan<T> read-only.',
                    array: 'Read-write.',
                },
            },
            {
                aspect: 'Direct access',
                cells: {
                    mem: 'Through the .Span property.',
                    rmem: 'Through the .Span property.',
                    span: 'Direct — Span IS the access.',
                    array: 'Direct — array IS the access.',
                },
            },
            {
                aspect: 'Best for',
                cells: {
                    mem: 'Async pipelines, fields holding buffers.',
                    rmem: 'Async pipelines that read but never write.',
                    span: 'Hot synchronous loops; parsing.',
                    array: 'When you own the storage.',
                },
            },
        ],
    },

    related: [
        { slug: 'span' },
        { slug: 'array' },
        { slug: 'list' },
    ],
};