import type { Structure } from '../types';

export const CONCURRENT_BAG_DATA: Structure = {
    slug: 'concurrent-bag',
    name: 'ConcurrentBag<T>',
    namespace: 'concurrent',
    metaDescription:
        'System.Collections.Concurrent.ConcurrentBag<T> — thread-local stacks with work stealing. The fastest concurrent collection when order does not matter. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Concurrent' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Work-stealing' },
        { variant: 'warn', label: 'Unordered' },
    ],

    lead:
        'An unordered, thread-safe collection optimised for the case where the same thread tends to add and take. Each thread gets its own internal stack; Add and TryTake on the local stack are nearly free. When a thread finds its own stack empty it steals from another thread\u2019s — the same work-stealing pattern that makes the .NET thread pool fast.',

    metrics: [
        { label: 'Add (own thread)', value: 'O(1)', note: 'thread-local push, no contention' },
        { label: 'TryTake (own)', value: 'O(1)', note: 'thread-local pop, no contention' },
        { label: 'TryTake (steal)', value: 'O(1)', note: 'locks another thread\u2019s stack' },
    ],

    whenToUse:
        'Reach for ConcurrentBag when ordering does not matter and threads tend to consume what they produce — object pools, parallel-for accumulators, scratch buffers reused across iterations. When ordering matters or producers are different from consumers, ConcurrentQueue is faster.',

    callout: {
        variant: 'highlight',
        title: 'Same-thread is free',
        body:
            'When a thread\u2019s local stack contains items, Add and TryTake do not touch any other thread\u2019s state — no atomics, no locks, no cache-line bouncing. Bag is the fastest concurrent collection in the BCL precisely because most accesses stay local. Cross-thread stealing has a cost; the design assumes it is the exception.',
    },

    examples: [
        {
            caption: 'Same-thread fast path',
            language: 'csharp',
            source:
                `using System.Collections.Concurrent;

ConcurrentBag<byte[]> buffers = new();

// Object-pool pattern — each thread tends to reuse what it made
Parallel.For(0, 10_000, _ =>
{
    byte[] buf = buffers.TryTake(out byte[]? existing)
        ? existing
        : new byte[1024];

    DoWork(buf);

    buffers.Add(buf);                              // mostly returns to local stack
});

// Bulk accumulation in parallel
ConcurrentBag<int> primes = new();
Parallel.For(2, 1_000, n =>
{
    if (IsPrime(n)) primes.Add(n);
});

// Drain — order is unspecified
while (primes.TryTake(out int p))
    Console.WriteLine(p);

bool IsPrime(int n) { /* ... */ return true; }
void DoWork(byte[] b) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Approximate item count across all thread-local stacks.' },
        { name: 'IsEmpty', type: 'bool', description: 'True only when every thread-local stack is empty.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → void', complexity: 'O(1)' },
        { name: 'TryTake', signature: 'TryTake(out T result) → bool', complexity: 'O(1)' },
        { name: 'TryPeek', signature: 'TryPeek(out T result) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'CopyTo', signature: 'CopyTo(T[] array, int index) → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'cb', label: 'ConcurrentBag<T>', accent: 'concurrent' },
            { id: 'cq', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
            { id: 'cs', label: 'ConcurrentStack<T>', accent: 'concurrent' },
            { id: 'cd', label: 'ConcurrentDictionary', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Order', cells: { cb: 'Unordered.', cq: 'FIFO.', cs: 'LIFO.', cd: 'Unordered.' } },
            { aspect: 'Best access pattern', cells: { cb: 'Same thread adds and takes.', cq: 'Cross-thread enqueue/dequeue.', cs: 'Cross-thread push/pop.', cd: 'By-key access from any thread.' } },
            { aspect: 'Allocation', cells: { cb: 'Thread-local stacks reuse memory.', cq: 'Linked segments.', cs: 'One node per Push.', cd: 'Bucket arrays + entries.' } },
            { aspect: 'Best for', cells: { cb: 'Object pools, scratch buffers.', cq: 'Producer-consumer pipelines.', cs: 'Multi-writer LIFO.', cd: 'Multi-writer key-value maps.' } },
        ],
    },

    related: [
        { slug: 'concurrent-queue' },
        { slug: 'concurrent-stack' },
        { slug: 'concurrent-dictionary' },
        { slug: 'list' },
    ],
};