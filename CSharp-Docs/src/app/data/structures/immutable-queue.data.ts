import type { Structure } from '../types';

export const IMMUTABLE_QUEUE_DATA: Structure = {
    slug: 'immutable-queue',
    name: 'ImmutableQueue<T>',
    namespace: 'immutable',
    metaDescription:
        'System.Collections.Immutable.ImmutableQueue<T> — persistent FIFO queue using two immutable stacks. O(1) Enqueue, O(1) amortised Dequeue. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: 'Since .NET Framework 4.5' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'O(1) Enqueue' },
        { variant: 'neutral', label: 'FIFO' },
    ],

    lead:
        'A persistent FIFO queue built from two immutable stacks — one for incoming items, one for outgoing. Enqueue pushes onto the in-stack; Dequeue pops from the out-stack, reversing the in-stack into it on demand. Result: O(1) Enqueue, O(1) amortised Dequeue, full immutability, every version stays valid.',

    metrics: [
        { label: 'Enqueue', value: 'O(1)', note: 'pushes onto the in-stack; returns new queue' },
        { label: 'Dequeue', value: 'O(1) amortized', note: 'rebalances when out-stack empties' },
        { label: 'Peek', value: 'O(1) amortized', note: 'reads the head of out-stack; rebalances if needed' },
    ],

    whenToUse:
        'Reach for ImmutableQueue when FIFO ordering matters AND every snapshot must remain valid — event-sourced state machines, audit trails replayed in order, message logs that flow across module boundaries. Use Queue when single-threaded; ConcurrentQueue when many threads share the SAME queue.',

    callout: {
        variant: 'note',
        title: 'Two-stack rebalance is the trick',
        body:
            'Imagine pushing onto stack-in and popping from stack-out. When stack-out is empty, transfer everything from stack-in to stack-out by popping from one and pushing to the other — that single transfer is O(n) but happens once for each item enqueued. Average it out: each item touches the rebalance once, so amortised cost stays O(1).',
    },

    examples: [
        {
            caption: 'Persistent FIFO',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

ImmutableQueue<string> empty = ImmutableQueue<string>.Empty;

// Enqueue returns a new queue
ImmutableQueue<string> q1 = empty.Enqueue("first");
ImmutableQueue<string> q2 = q1.Enqueue("second");
ImmutableQueue<string> q3 = q2.Enqueue("third");

// Peek — head only, no removal
string head = q3.Peek();                            // "first"

// Dequeue — head plus the new tail-queue
ImmutableQueue<string> q4 = q3.Dequeue(out string popped);
// popped = "first", q4 contains second and third

// Iteration walks in FIFO order
foreach (string s in q3)
    Console.WriteLine(s);                            // first, second, third

// Branching from a shared base
ImmutableQueue<string> a = q3.Enqueue("a-only");
ImmutableQueue<string> b = q3.Enqueue("b-only");
// q3, a, and b all coexist; "first/second/third" is shared between them

// Drain pattern
ImmutableQueue<string> remaining = q3;
while (!remaining.IsEmpty)
{
    remaining = remaining.Dequeue(out string item);
    Console.WriteLine(item);
}`,
        },
    ],

    properties: [
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check. Note: ImmutableQueue does NOT expose Count — counting requires a full walk and is intentionally not part of the API.' },
    ],

    methods: [
        { name: 'Enqueue', signature: 'Enqueue(T value) → ImmutableQueue<T>', complexity: 'O(1)' },
        { name: 'Dequeue', signature: 'Dequeue() → ImmutableQueue<T>', complexity: 'O(1) amortized' },
        { name: 'Dequeue', signature: 'Dequeue(out T value) → ImmutableQueue<T>', complexity: 'O(1) amortized' },
        { name: 'Peek', signature: 'Peek() → T', complexity: 'O(1) amortized' },
        { name: 'Clear', signature: 'Clear() → ImmutableQueue<T>', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'iq', label: 'ImmutableQueue<T>', accent: 'immutable' },
            { id: 'q', label: 'Queue<T>', accent: 'generic' },
            { id: 'cq', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
            { id: 'is', label: 'ImmutableStack<T>', accent: 'immutable' },
        ],
        rows: [
            { aspect: 'Backing', cells: { iq: 'Two immutable stacks.', q: 'Circular array.', cq: 'Linked segment chain.', is: 'Cons list.' } },
            { aspect: 'Order', cells: { iq: 'FIFO.', q: 'FIFO.', cq: 'FIFO.', is: 'LIFO.' } },
            { aspect: 'Mutation', cells: { iq: 'Returns new queue.', q: 'In place.', cq: 'In place.', is: 'Returns new stack.' } },
            { aspect: 'Snapshots', cells: { iq: 'Every version valid.', q: 'No.', cq: 'No.', is: 'Every version valid.' } },
            { aspect: 'Best for', cells: { iq: 'Snapshot FIFO state.', q: 'Single-thread FIFO.', cq: 'Multi-writer FIFO.', is: 'Snapshot LIFO state.' } },
        ],
    },

    related: [
        { slug: 'immutable-stack' },
        { slug: 'queue' },
        { slug: 'concurrent-queue' },
        { slug: 'immutable-list' },
    ],
};