import type { Structure } from '../types';

export const CONCURRENT_QUEUE_DATA: Structure = {
    slug: 'concurrent-queue',
    name: 'ConcurrentQueue<T>',
    namespace: 'concurrent',
    metaDescription:
        'System.Collections.Concurrent.ConcurrentQueue<T> — lock-free FIFO queue using a linked list of segments. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Concurrent' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Lock-free' },
        { variant: 'neutral', label: 'FIFO' },
    ],

    lead:
        'A lock-free FIFO queue built on a linked list of fixed-size segments. Enqueue and TryDequeue both use compare-and-swap rather than locks, so contention costs little even at high thread counts. The thread-safe drop-in for Queue<T>; the right answer when you have multiple producers, multiple consumers, or both.',

    metrics: [
        { label: 'Enqueue', value: 'O(1)', note: 'CAS at the tail; allocates a new segment on segment overflow' },
        { label: 'TryDequeue', value: 'O(1)', note: 'CAS at the head; returns false if empty' },
        { label: 'TryPeek', value: 'O(1)', note: 'snapshot read of the head' },
    ],

    whenToUse:
        'Reach for ConcurrentQueue whenever multiple threads append work and one or more threads drain it — log shipping, work pools, parallel pipelines. If consumers should BLOCK while empty, wrap a ConcurrentQueue inside a BlockingCollection<T>; ConcurrentQueue itself never blocks.',

    callout: {
        variant: 'note',
        title: 'Iteration is a moment-in-time snapshot',
        body:
            'foreach over a ConcurrentQueue takes a snapshot — items added after iteration began are not seen, items drained during iteration may or may not be seen. Useful for diagnostics; not the right way to drain a queue. Drain via repeated TryDequeue calls instead.',
    },

    examples: [
        {
            caption: 'Multiple producers, one consumer',
            language: 'csharp',
            source:
                `using System.Collections.Concurrent;

ConcurrentQueue<string> jobs = new();

// Enqueue — many threads can call this concurrently
Parallel.For(0, 1_000, i => jobs.Enqueue($"job-{i}"));

// Drain — TryDequeue returns false when empty
while (jobs.TryDequeue(out string? job))
    Process(job);

// TryPeek — non-blocking; safe under concurrent writes
if (jobs.TryPeek(out string? next))
    Console.WriteLine($"next will be {next}");

// Snapshot iteration — diagnostic only
int approxCount = 0;
foreach (string j in jobs) approxCount++;

// Pattern: producer / consumer with a CancellationToken
async Task ConsumeAsync(ConcurrentQueue<string> q, CancellationToken ct)
{
    while (!ct.IsCancellationRequested)
    {
        if (q.TryDequeue(out string? job))
        {
            Process(job);
        }
        else
        {
            // No work — yield the thread before retrying
            await Task.Delay(10, ct);
        }
    }
}

void Process(string s) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Item count. Walks the segment chain — avoid in hot loops; prefer IsEmpty.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
    ],

    methods: [
        { name: 'Enqueue', signature: 'Enqueue(T item) → void', complexity: 'O(1)' },
        { name: 'TryDequeue', signature: 'TryDequeue(out T result) → bool', complexity: 'O(1)' },
        { name: 'TryPeek', signature: 'TryPeek(out T result) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'CopyTo', signature: 'CopyTo(T[] array, int index) → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'cq', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
            { id: 'q', label: 'Queue<T> + lock', accent: 'generic' },
            { id: 'iq', label: 'ImmutableQueue<T>', accent: 'immutable' },
            { id: 'block', label: 'BlockingCollection<T>', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Backing', cells: { cq: 'Linked segment chain.', q: 'Circular array.', iq: 'Two immutable stacks.', block: 'Wraps any IProducerConsumerCollection.' } },
            { aspect: 'Synchronisation', cells: { cq: 'Lock-free CAS.', q: 'Single lock you write.', iq: 'None — immutable.', block: 'Built-in semaphore signalling.' } },
            { aspect: 'Empty behaviour', cells: { cq: 'TryDequeue returns false.', q: 'Throws.', iq: 'Returns same queue.', block: 'Take blocks; TryTake fails fast.' } },
            { aspect: 'Best for', cells: { cq: 'Multi-writer FIFO.', q: 'Single-thread FIFO.', iq: 'Snapshot event sourcing.', block: 'Producer-consumer with backpressure.' } },
        ],
    },

    related: [
        { slug: 'queue' },
        { slug: 'concurrent-stack' },
        { slug: 'concurrent-bag' },
        { slug: 'blocking-collection' },
        { slug: 'immutable-queue' },
    ],
};