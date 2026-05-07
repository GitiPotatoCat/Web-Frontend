import type { Structure } from '../types';

export const LEGACY_QUEUE_DATA: Structure = {
    slug: 'legacy-queue',
    name: 'Queue (legacy)',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.Queue — pre-generics FIFO queue of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Non-generic' },
        { variant: 'warn', label: 'Boxes value types' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'FIFO' },
    ],

    lead:
        'A FIFO queue of object — the .NET 1.0 queue, sibling of the legacy Stack. Same Enqueue / Dequeue / Peek as Queue<T>, with the same boxing tax for value types. Modern code should pick Queue<T> from System.Collections.Generic.',

    metrics: [
        { label: 'Enqueue', value: 'O(1) amortized', note: 'doubles when full; boxes value types' },
        { label: 'Dequeue', value: 'O(1)', note: 'returns object; cast required' },
        { label: 'Peek', value: 'O(1)', note: 'reads head in place' },
    ],

    whenToUse:
        'Reach for the legacy Queue only when maintaining code that already uses it. Queue<T> is faster, type-safe, and avoids the heap allocation that boxing forces on every value-type Enqueue.',

    examples: [
        {
            caption: 'Enqueue, dequeue, cast',
            language: 'csharp',
            source:
                `using System.Collections;

Queue q = new();
Queue sized = new(capacity: 64);

q.Enqueue("first");
q.Enqueue(2);                                       // int → boxed
q.Enqueue(3.14);

object head = q.Peek();
string first = (string)q.Dequeue();
int    n     = (int)q.Dequeue();

// Iterate head-to-tail
foreach (object o in q)
    Console.WriteLine(o);

// Modern equivalent
Queue<int> modern = new();
modern.Enqueue(1);
int x = modern.Dequeue();`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items in the queue.' },
    ],

    methods: [
        { name: 'Enqueue', signature: 'Enqueue(object obj) → void', complexity: 'O(1) amortized' },
        { name: 'Dequeue', signature: 'Dequeue() → object', complexity: 'O(1)' },
        { name: 'Peek', signature: 'Peek() → object', complexity: 'O(1)' },
        { name: 'Contains', signature: 'Contains(object obj) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → object[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'lq', label: 'Queue (legacy)', accent: 'legacy' },
            { id: 'q', label: 'Queue<T>', accent: 'generic' },
            { id: 'cq', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { lq: 'None — object.', q: 'Generic — full.', cq: 'Generic — full.' } },
            { aspect: 'Value types', cells: { lq: 'Boxed on Enqueue.', q: 'Stored inline.', cq: 'Stored inline.' } },
            { aspect: 'Thread-safe', cells: { lq: 'No.', q: 'No.', cq: 'Yes — lock-free.' } },
            { aspect: 'Best for', cells: { lq: 'Legacy code only.', q: 'The default FIFO.', cq: 'Multi-writer FIFO.' } },
        ],
    },

    related: [
        { slug: 'queue' },
        { slug: 'concurrent-queue' },
        { slug: 'immutable-queue' },
        { slug: 'legacy-stack' },
    ],
};