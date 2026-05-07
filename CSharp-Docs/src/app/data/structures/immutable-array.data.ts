import type { Structure } from '../types';

export const IMMUTABLE_ARRAY_DATA: Structure = {
    slug: 'immutable-array',
    name: 'ImmutableArray<T>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableArray<T> — readonly struct wrapping a frozen T[]. O(1) read, O(n) every modification. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Struct — zero indirection' },
        { variant: 'warn', label: 'O(n) modifications' },
    ],

    lead:
        'A readonly struct that wraps a frozen T[]. Reads are exactly as fast as a raw array — there is no indirection, no boxing, no allocation per access. The cost is on the write side: every "mutation" copies the entire backing array. The right immutable shape for read-heavy snapshots that are seldom rewritten.',

    metrics: [
        { label: 'Index access', value: 'O(1)', note: 'direct offset, identical to T[]' },
        { label: 'Add / SetItem', value: 'O(n)', note: 'allocates a new array and copies' },
        { label: 'Slicing', value: 'O(1)', note: 'AsSpan, AsMemory — zero copy [O(1) View]' },
    ],

    whenToUse:
        'Reach for ImmutableArray when the data is read often, modified rarely, and you want the closest possible cost to a regular array. Configuration loaded once at startup; operator results in a parallel pipeline; frozen views handed to many consumers. Use ImmutableList when modification frequency is meaningful — its tree structure makes Add and SetItem O(log n) instead of O(n).',

    callout: {
        variant: 'highlight',
        title: 'Pay nothing for reads',
        body:
            'ImmutableArray is a struct holding a single T[] reference. Indexer reads compile down to the same instructions as raw array access — no virtual calls, no enumerator allocation, no extra dereferences. If reads dominate and writes are rare, this is the immutable type whose read cost is invisible.',
    },

    examples: [
        {
            caption: 'Construct, read, rewrite',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

// Construct — collection expression syntax (C# 12+)
ImmutableArray<int> nums = [1, 2, 3, 4, 5];
ImmutableArray<int> empty = [];
ImmutableArray<int> fromArray = ImmutableArray.Create(1, 2, 3);

// Read — same as a raw array
int third = nums[2];                                // 3
int len = nums.Length;

foreach (int n in nums)
    Console.WriteLine(n);

// "Mutations" return a new instance — original is unchanged
ImmutableArray<int> with99 = nums.Add(99);          // O(n) copy
ImmutableArray<int> swapped = nums.SetItem(0, 100); // O(n) copy
ImmutableArray<int> shorter = nums.RemoveAt(2);     // O(n) copy

// AsSpan / AsMemory — zero-cost views, often the right answer
Span<int> view = nums.AsSpan();                     // ReadOnly Span actually

// Builder pattern — many writes, ONE freeze
ImmutableArray<int>.Builder builder = ImmutableArray.CreateBuilder<int>();
for (int i = 0; i < 1_000; i++) builder.Add(i);
ImmutableArray<int> result = builder.ToImmutable();  // O(1) handoff`,
        },
    ],

    properties: [
        { name: 'Length', type: 'int', description: 'Number of elements. Read from the wrapped array.' },
        { name: 'IsEmpty', type: 'bool', description: 'True when Length is 0.' },
        { name: 'IsDefault', type: 'bool', description: 'True when this is `default(ImmutableArray<T>)` — backing array is null. Calling members in this state throws; check before use when value originates from default-initialisation.' },
        { name: 'this[int index]', type: 'T', description: 'Indexer — O(1) read. Returns by value; cannot be assigned.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → ImmutableArray<T>', complexity: 'O(n)' },
        { name: 'AddRange', signature: 'AddRange(IEnumerable<T> items) → ImmutableArray<T>', complexity: 'O(n + k)' as Structure['methods'][number]['complexity'] },
        { name: 'Insert', signature: 'Insert(int index, T item) → ImmutableArray<T>', complexity: 'O(n)' },
        { name: 'SetItem', signature: 'SetItem(int index, T value) → ImmutableArray<T>', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → ImmutableArray<T>', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(T item) → ImmutableArray<T>', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → ImmutableArray<T>', complexity: 'O(1)' },
        { name: 'AsSpan', signature: 'AsSpan() → ReadOnlySpan<T>', complexity: 'O(1)' },
        { name: 'AsMemory', signature: 'AsMemory() → ReadOnlyMemory<T>', complexity: 'O(1)' },
        { name: 'IndexOf', signature: 'IndexOf(T item) → int', complexity: 'O(n)' },
        { name: 'BinarySearch', signature: 'BinarySearch(T value) → int', complexity: 'O(log n)' },
        { name: 'ToBuilder', signature: 'ToBuilder() → ImmutableArray<T>.Builder', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'ia', label: 'ImmutableArray<T>', accent: 'immutable' },
            { id: 'il', label: 'ImmutableList<T>', accent: 'immutable' },
            { id: 'arr', label: 'T[]', accent: 'primitive' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { ia: 'A frozen T[].', il: 'AVL tree of segments.', arr: 'A T[].', list: 'A T[] it owns.' } },
            { aspect: 'Read', cells: { ia: 'O(1) — same as array.', il: 'O(log n).', arr: 'O(1).', list: 'O(1).' } },
            { aspect: 'Write', cells: { ia: 'O(n) — full copy.', il: 'O(log n) — path copy.', arr: 'O(1) in place.', list: 'O(1) amortised at end.' } },
            { aspect: 'Allocation per write', cells: { ia: 'New array.', il: 'Path of nodes.', arr: 'None.', list: 'None until resize.' } },
            { aspect: 'Best for', cells: { ia: 'Read-heavy snapshots.', il: 'Modification-friendly snapshots.', arr: 'Owned mutable storage.', list: 'The default ordered list.' } },
        ],
    },

    related: [
        { slug: 'immutable-list' },
        { slug: 'array' },
        { slug: 'list' },
        { slug: 'span' },
        { slug: 'memory' },
    ],
};