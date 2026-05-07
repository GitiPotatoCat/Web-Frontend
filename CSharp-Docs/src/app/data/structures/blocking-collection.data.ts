import type { Structure } from '../types';

export const BLOCKING_COLLECTION_DATA: Structure = {
    slug: 'blocking-collection',
    name: 'BlockingCollection<T>',
    namespace: 'concurrent',
    metaDescription:
        'System.Collections.Concurrent.BlockingCollection<T> — producer-consumer wrapper around any IProducerConsumerCollection. Bounding, blocking, completion. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Concurrent' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Bounding' },
        { variant: 'ok', label: 'Blocking semantics' },
    ],

    lead:
        'A producer-consumer wrapper around any IProducerConsumerCollection — defaults to ConcurrentQueue. Add semaphore-based blocking on top: Add waits when bounded and full; Take waits when empty; CompleteAdding signals consumers that no more items are coming. The standard answer for synchronous producer-consumer patterns; modern code increasingly reaches for System.Threading.Channels instead, but BlockingCollection is still everywhere.',

    metrics: [
        { label: 'Add', value: 'O(1)', note: 'blocks on bounded full; throws after CompleteAdding' },
        { label: 'Take', value: 'O(1)', note: 'blocks while empty; throws when complete and drained' },
        { label: 'TryAdd / TryTake', value: 'O(1)', note: 'fail-fast variants with optional timeout' },
    ],

    whenToUse:
        'Reach for BlockingCollection in classic producer-consumer code that is synchronous (uses Take, GetConsumingEnumerable, threads — not Tasks). For async pipelines, System.Threading.Channels is the modern replacement: same shape, awaitable, no thread blocking. BlockingCollection still wins where threads are the unit and back-pressure is required.',

    callout: {
        variant: 'note',
        title: 'CompleteAdding is the shutdown signal',
        body:
            'After CompleteAdding, no further Add succeeds — but consumers can still drain remaining items. Once the underlying collection is empty, Take throws InvalidOperationException and IsCompleted becomes true. GetConsumingEnumerable handles all of this for you, which is why it\u2019s the recommended consumer pattern.',
    },

    examples: [
        {
            caption: 'Classic producer-consumer',
            language: 'csharp',
            source:
                `using System.Collections.Concurrent;

// Default is unbounded queue-backed
BlockingCollection<string> jobs = new();

// Bounded queue — Add blocks when full
BlockingCollection<string> bounded = new(boundedCapacity: 100);

// Stack-backed — LIFO ordering
BlockingCollection<string> lifo = new(new ConcurrentStack<string>());

// Producer side
Task producer = Task.Run(() =>
{
    for (int i = 0; i < 1_000; i++)
        jobs.Add($"job-{i}");                       // blocks if bounded and full
    jobs.CompleteAdding();
});

// Consumer side — GetConsumingEnumerable is the idiomatic loop
Task consumer = Task.Run(() =>
{
    foreach (string job in jobs.GetConsumingEnumerable())
        Process(job);                                // exits when CompleteAdding + drained
});

await Task.WhenAll(producer, consumer);

// Try-form with timeout — useful for graceful shutdown
if (jobs.TryTake(out string? next, TimeSpan.FromSeconds(1)))
    Process(next);

// AddToAny / TakeFromAny — coordinate across multiple collections
BlockingCollection<int>[] queues = { new(), new() };
int idx = BlockingCollection<int>.TakeFromAny(queues, out int item);

void Process(string s) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items currently buffered in the underlying collection.' },
        { name: 'BoundedCapacity', type: 'int', description: 'Maximum capacity, or -1 when unbounded.' },
        { name: 'IsAddingCompleted', type: 'bool', description: 'True once CompleteAdding has been called.' },
        { name: 'IsCompleted', type: 'bool', description: 'True once CompleteAdding has been called AND the collection is empty.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → void', complexity: 'O(1)' },
        { name: 'TryAdd', signature: 'TryAdd(T item, int millisecondsTimeout) → bool', complexity: 'O(1)' },
        { name: 'Take', signature: 'Take() → T', complexity: 'O(1)' },
        { name: 'TryTake', signature: 'TryTake(out T item, int millisecondsTimeout) → bool', complexity: 'O(1)' },
        { name: 'CompleteAdding', signature: 'CompleteAdding() → void', complexity: 'O(1)' },
        { name: 'GetConsumingEnumerable', signature: 'GetConsumingEnumerable() → IEnumerable<T>', complexity: 'O(1)' },
        { name: 'AddToAny', signature: 'BlockingCollection<T>.AddToAny(BlockingCollection<T>[] cols, T item) → int', complexity: 'O(k)' },
        { name: 'TakeFromAny', signature: 'BlockingCollection<T>.TakeFromAny(BlockingCollection<T>[] cols, out T item) → int', complexity: 'O(k)' },
    ],

    comparison: {
        columns: [
            { id: 'bc', label: 'BlockingCollection<T>', accent: 'concurrent' },
            { id: 'cq', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
            { id: 'ch', label: 'Channel<T>', accent: 'concurrent' },
            { id: 'q', label: 'Queue<T> + lock', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Style', cells: { bc: 'Synchronous, thread-blocking.', cq: 'Synchronous, non-blocking.', ch: 'Async, awaitable.', q: 'Synchronous, single-threaded.' } },
            { aspect: 'Empty Take', cells: { bc: 'Blocks until item or completion.', cq: 'TryDequeue returns false.', ch: 'await returns when ready.', q: 'Throws.' } },
            { aspect: 'Bounded', cells: { bc: 'Optional via ctor.', cq: 'No.', ch: 'Bounded or unbounded.', q: 'No.' } },
            { aspect: 'Completion', cells: { bc: 'CompleteAdding signal.', cq: 'No built-in.', ch: 'Writer.Complete signal.', q: 'No built-in.' } },
            { aspect: 'Best for', cells: { bc: 'Thread-based producer-consumer.', cq: 'High-throughput multi-writer FIFO.', ch: 'Modern async pipelines.', q: 'Single-thread FIFO.' } },
        ],
    },

    related: [
        { slug: 'concurrent-queue' },
        { slug: 'concurrent-stack' },
        { slug: 'concurrent-bag' },
        { slug: 'queue' },
    ],
};