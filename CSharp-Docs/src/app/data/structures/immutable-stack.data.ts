import type { Structure } from '../types';

export const IMMUTABLE_STACK_DATA: Structure = {
    slug: 'immutable-stack',
    name: 'ImmutableStack<T>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableStack<T> — persistent LIFO stack as a cons list. O(1) Push, Pop, Peek. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'O(1) everything' },
        { variant: 'neutral', label: 'LIFO' },
    ],

    lead:
        'A persistent LIFO stack backed by a singly-linked cons list. Push prepends; Pop returns the tail of the list — both O(1) and the structure shares all unchanged tail nodes between versions. The simplest, fastest persistent collection in the BCL; functional textbooks would call this "the canonical immutable stack."',

    metrics: [
        { label: 'Push', value: 'O(1)', note: 'allocates one node, prepends' },
        { label: 'Pop', value: 'O(1)', note: 'returns the tail; allocation-free' },
        { label: 'Peek', value: 'O(1)', note: 'reads the head value' },
    ],

    whenToUse:
        'Reach for ImmutableStack whenever a LIFO history must persist — undo stacks, recursive descent without recursion, parser context tracking, time-travel debugging. Use Stack when single-threaded; ConcurrentStack when many threads share the SAME stack.',

    callout: {
        variant: 'highlight',
        title: 'Pop is allocation-free',
        body:
            'Push allocates a single node. Pop, uniquely, allocates nothing — the new stack IS the existing tail of the list. Branching from a shared base (two different Pushes onto the same stack) costs one node each and shares the rest. The simplest persistent structure with the cleanest cost story.',
    },

    diagram: {
        caption: 'Cons-list sharing',
        body:
            `  base               base.Push("X")              base.Push("Y")
                                                    │
    head ──▶ "Y"     head ──▶ "X" ──┐              │
              │                     │              │
              ▼                     ▼              ▼
            ...                   tail (shared with base.Push("Y") and base)
              │
              ▼
            null

    Push: one new node prepended.
    Pop:  return the tail — no allocation.`,
    },

    examples: [
        {
            caption: 'Persistent LIFO',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

ImmutableStack<string> empty = ImmutableStack<string>.Empty;

// Push returns new stack
ImmutableStack<string> s1 = empty.Push("a");
ImmutableStack<string> s2 = s1.Push("b");
ImmutableStack<string> s3 = s2.Push("c");

// Peek — head only
string head = s3.Peek();                            // "c"

// Pop overload that returns the value AND the new stack
ImmutableStack<string> s4 = s3.Pop(out string popped);
// popped = "c", s4 has [b, a]

// Iteration walks head-to-tail
foreach (string s in s3)
    Console.WriteLine(s);                            // c, b, a

// Branching shares all tail nodes
ImmutableStack<string> branchX = s2.Push("X");
ImmutableStack<string> branchY = s2.Push("Y");
// s2, branchX, branchY all coexist; the [b, a] tail is shared

// Drain
ImmutableStack<string> remaining = s3;
while (!remaining.IsEmpty)
{
    remaining = remaining.Pop(out string item);
    Console.WriteLine(item);
}`,
        },
    ],

    properties: [
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check. Like ImmutableQueue, ImmutableStack does NOT expose Count — counting would require a full walk and is intentionally not part of the API.' },
    ],

    methods: [
        { name: 'Push', signature: 'Push(T value) → ImmutableStack<T>', complexity: 'O(1)' },
        { name: 'Pop', signature: 'Pop() → ImmutableStack<T>', complexity: 'O(1)' },
        { name: 'Pop', signature: 'Pop(out T value) → ImmutableStack<T>', complexity: 'O(1)' },
        { name: 'Peek', signature: 'Peek() → T', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → ImmutableStack<T>', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'is', label: 'ImmutableStack<T>', accent: 'immutable' },
            { id: 's', label: 'Stack<T>', accent: 'generic' },
            { id: 'cs', label: 'ConcurrentStack<T>', accent: 'concurrent' },
            { id: 'iq', label: 'ImmutableQueue<T>', accent: 'immutable' },
        ],
        rows: [
            { aspect: 'Backing', cells: { is: 'Cons list.', s: 'Resizing array.', cs: 'Linked list with CAS.', iq: 'Two immutable stacks.' } },
            { aspect: 'Push', cells: { is: 'O(1) — one node.', s: 'O(1) amortised.', cs: 'O(1) lock-free.', iq: 'O(1) Enqueue.' } },
            { aspect: 'Pop', cells: { is: 'O(1) — allocation-free.', s: 'O(1).', cs: 'O(1) lock-free.', iq: 'O(1) amortised.' } },
            { aspect: 'Snapshots', cells: { is: 'Every version valid.', s: 'No.', cs: 'No.', iq: 'Every version valid.' } },
            { aspect: 'Best for', cells: { is: 'Snapshot LIFO state.', s: 'Single-thread LIFO.', cs: 'Multi-writer LIFO.', iq: 'Snapshot FIFO state.' } },
        ],
    },

    related: [
        { slug: 'immutable-queue' },
        { slug: 'stack' },
        { slug: 'concurrent-stack' },
        { slug: 'immutable-list' },
    ],
};