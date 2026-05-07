import type { Structure } from '../types';

export const QUEUE_DATA: Structure = {
    slug: 'queue',
    name: 'Queue<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.Queue<T> — circular-array FIFO queue. O(1) Enqueue, Dequeue, Peek. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'FIFO' },
    ],

    lead:
        'A first-in-first-out queue backed by a circular array. Enqueue appends to the tail; Dequeue removes from the head; both are O(1) amortised. The default in-process queue in C#; reach for ConcurrentQueue<T> across threads or BlockingCollection<T> for producer-consumer patterns.',

    metrics: [
        { label: 'Enqueue', value: 'O(1) amortized', note: 'doubles when full' },
        { label: 'Dequeue', value: 'O(1)', note: 'advances the head pointer' },
        { label: 'Peek', value: 'O(1)', note: 'reads the head in place' },
    ],

    whenToUse:
        'Reach for Queue<T> whenever you process work in arrival order on a single thread — breadth-first traversal, level-order tree walks, simple buffered work pipelines. Cross threads and you want ConcurrentQueue or BlockingCollection; need backpressure and you want Channels.',

    callout: {
        variant: 'note',
        title: 'Circular array, not a linked list',
        body:
            'Queue<T> uses a circular buffer with head and tail indices that wrap. There is no per-element allocation; growth is the same doubling-and-copy strategy as List<T>. Pointer-chasing intuitions from textbook FIFO implementations don\u2019t apply here.',
    },

    examples: [
        {
            caption: 'FIFO basics',
            language: 'csharp',
            source:
                `// Construct
Queue<string> jobs = new();
Queue<int>    seeded = new(new[] { 1, 2, 3 });

// Enqueue — O(1) amortised
jobs.Enqueue("first");
jobs.Enqueue("second");
jobs.Enqueue("third");

// Peek — read head without removing
string next = jobs.Peek();                         // "first"

// Dequeue — read and remove
string head = jobs.Dequeue();                      // "first"

// Try-form: returns false on empty rather than throwing
if (jobs.TryDequeue(out string? job))
    Process(job);

if (jobs.TryPeek(out string? top))
    Console.WriteLine(top);

// Iterate head-to-tail
foreach (string j in jobs)
    Console.WriteLine(j);

// Drain pattern
while (jobs.Count > 0)
    Process(jobs.Dequeue());

void Process(string s) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items currently in the queue.' },
    ],

    methods: [
        { name: 'Enqueue', signature: 'Enqueue(T item) → void', complexity: 'O(1) amortized' },
        { name: 'Dequeue', signature: 'Dequeue() → T', complexity: 'O(1)' },
        { name: 'TryDequeue', signature: 'TryDequeue(out T result) → bool', complexity: 'O(1)' },
        { name: 'Peek', signature: 'Peek() → T', complexity: 'O(1)' },
        { name: 'TryPeek', signature: 'TryPeek(out T result) → bool', complexity: 'O(1)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'TrimExcess', signature: 'TrimExcess() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'queue', label: 'Queue<T>', accent: 'generic' },
            { id: 'cqueue', label: 'ConcurrentQueue<T>', accent: 'concurrent' },
            { id: 'iqueue', label: 'ImmutableQueue<T>', accent: 'immutable' },
            { id: 'block', label: 'BlockingCollection<T>', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Backing', cells: { queue: 'Circular array.', cqueue: 'Linked segment chain.', iqueue: 'Two immutable stacks.', block: 'Wraps any IProducerConsumerCollection.' } },
            { aspect: 'Enqueue', cells: { queue: 'O(1) amortised.', cqueue: 'O(1) lock-free.', iqueue: 'O(1) — returns new.', block: 'Blocks when bounded.' } },
            { aspect: 'Dequeue', cells: { queue: 'O(1).', cqueue: 'O(1) lock-free.', iqueue: 'O(1) amortised.', block: 'Blocks when empty.' } },
            { aspect: 'Thread-safe', cells: { queue: 'No.', cqueue: 'Yes.', iqueue: 'Yes — immutable.', block: 'Yes — by design.' } },
            { aspect: 'Best for', cells: { queue: 'Single-threaded FIFO.', cqueue: 'Multi-writer FIFO.', iqueue: 'Snapshot event sourcing.', block: 'Producer-consumer with backpressure.' } },
        ],
    },

    related: [
        { slug: 'stack' },
        { slug: 'priority-queue' },
        { slug: 'concurrent-queue' },
        { slug: 'immutable-queue' },
        { slug: 'blocking-collection' },
    ],
};