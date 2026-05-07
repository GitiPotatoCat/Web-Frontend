import type { Structure } from '../types';

export const PRIORITY_QUEUE_DATA: Structure = {
    slug: 'priority-queue',
    name: 'PriorityQueue<TElement, TPriority>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.PriorityQueue<TElement, TPriority> — array-backed binary heap. O(log n) Enqueue and Dequeue, O(1) Peek. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 6' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'warn', label: 'Not stable' },
        { variant: 'neutral', label: 'Min-heap' },
    ],

    lead:
        'A min-heap of (element, priority) pairs backed by a single resizing array. Enqueue inserts and bubbles up; Dequeue removes the lowest-priority item and sifts down — both O(log n). Peek is O(1). The default in-process priority queue, finally part of the BCL since .NET 6.',

    metrics: [
        { label: 'Enqueue', value: 'O(log n)', note: 'sift-up after array append' },
        { label: 'Dequeue', value: 'O(log n)', note: 'sift-down after head swap' },
        { label: 'Peek', value: 'O(1)', note: 'reads index 0' },
    ],

    whenToUse:
        'Reach for PriorityQueue when the next item to process is determined by a priority score — a scheduler, an event simulator, A* pathfinding, top-k streaming. If you need ordering by key without priority semantics, SortedDictionary or SortedSet is closer to what you want.',

    callout: {
        variant: 'warn',
        title: 'Not stable, no key update',
        body:
            'Two items with equal priority can come out in either order — there is no insertion-order tiebreaker. There is also no built-in "decrease key" operation; if you need to change a queued item\u2019s priority, the typical pattern is to enqueue a new (item, newPriority) pair and skip stale entries on dequeue.',
    },

    examples: [
        {
            caption: 'Min-heap by priority',
            language: 'csharp',
            source:
                `// Construct — defaults to a min-heap by Comparer<TPriority>.Default
PriorityQueue<string, int> jobs = new();

// Enqueue (item, priority) — lower priority comes out first
jobs.Enqueue("send-mail",  3);
jobs.Enqueue("backup",     1);
jobs.Enqueue("warm-cache", 2);

// Peek — head only, no removal
string head = jobs.Peek();                         // "backup"

// Dequeue — head with both forms
string next = jobs.Dequeue();                      // "backup"
if (jobs.TryDequeue(out string? job, out int prio))
    Console.WriteLine($"{job} @ {prio}");

// EnqueueDequeue — useful for top-k streaming
string evicted = jobs.EnqueueDequeue("incoming", 0);

// Custom max-heap via a reversed comparer
PriorityQueue<string, int> maxJobs =
    new(Comparer<int>.Create((a, b) => b.CompareTo(a)));

// Bulk enqueue from an enumerable of pairs
PriorityQueue<string, int> bulk = new();
bulk.EnqueueRange(new (string, int)[]
{
    ("a", 5), ("b", 2), ("c", 9),
});`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items currently in the queue.' },
        { name: 'Comparer', type: 'IComparer<TPriority>', description: 'Priority comparer in use; defaults to Comparer<TPriority>.Default.' },
        { name: 'UnorderedItems', type: 'UnorderedItemsCollection', description: 'Live view over (element, priority) pairs in heap order — useful for diagnostics, never for processing.' },
    ],

    methods: [
        { name: 'Enqueue', signature: 'Enqueue(TElement element, TPriority priority) → void', complexity: 'O(log n)' },
        { name: 'EnqueueRange', signature: 'EnqueueRange(IEnumerable<(TElement, TPriority)> items) → void', complexity: 'O(k log n)' as Structure['methods'][number]['complexity'] },
        { name: 'EnqueueDequeue', signature: 'EnqueueDequeue(TElement element, TPriority priority) → TElement', complexity: 'O(log n)' },
        { name: 'Dequeue', signature: 'Dequeue() → TElement', complexity: 'O(log n)' },
        { name: 'TryDequeue', signature: 'TryDequeue(out TElement element, out TPriority priority) → bool', complexity: 'O(log n)' },
        { name: 'Peek', signature: 'Peek() → TElement', complexity: 'O(1)' },
        { name: 'TryPeek', signature: 'TryPeek(out TElement element, out TPriority priority) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'pq', label: 'PriorityQueue<T,P>', accent: 'generic' },
            { id: 'queue', label: 'Queue<T>', accent: 'generic' },
            { id: 'sset', label: 'SortedSet<T>', accent: 'generic' },
            { id: 'sdict', label: 'SortedDictionary<K,V>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { pq: 'Binary heap on an array.', queue: 'Circular array.', sset: 'Red-black tree.', sdict: 'Red-black tree.' } },
            { aspect: 'Order semantics', cells: { pq: 'Min priority first.', queue: 'Insertion order.', sset: 'Sorted by element.', sdict: 'Sorted by key.' } },
            { aspect: 'Enqueue', cells: { pq: 'O(log n).', queue: 'O(1) amortised.', sset: 'O(log n) Add.', sdict: 'O(log n) Add.' } },
            { aspect: 'Stable', cells: { pq: 'No.', queue: 'Yes (FIFO).', sset: 'Yes (sorted).', sdict: 'Yes (sorted).' } },
            { aspect: 'Best for', cells: { pq: 'Schedulers, A*, top-k.', queue: 'In-order pipelines.', sset: 'Ordered sets.', sdict: 'Ordered key-value lookup.' } },
        ],
    },

    related: [
        { slug: 'queue' },
        { slug: 'sorted-set' },
        { slug: 'sorted-dictionary' },
        { slug: 'list' },
    ],
};