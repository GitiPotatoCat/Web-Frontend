import type { Structure } from '../types';

export const LINKED_LIST_DATA: Structure = {
    slug: 'linked-list',
    name: 'LinkedList<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.LinkedList<T> — doubly-linked list with O(1) insert and remove at known nodes. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'warn', label: 'Per-node allocation' },
        { variant: 'neutral', label: 'Doubly-linked' },
    ],

    lead:
        'A doubly-linked list of LinkedListNode<T>. Each node holds a value plus pointers to its neighbours. Inserts and removes at a known node are O(1); finding a node by value is O(n). Almost always slower than List<T> in practice — the per-node allocation and pointer-chasing dominate, even when the asymptotic story favours it.',

    metrics: [
        { label: 'AddFirst / AddLast', value: 'O(1)', note: 'updates two pointers' },
        { label: 'AddBefore / AddAfter', value: 'O(1)', note: 'when you have the node' },
        { label: 'Find', value: 'O(n)', note: 'walks from the head' },
    ],

    whenToUse:
        'Reach for LinkedList<T> only when you genuinely insert and remove at known node positions and your profiler tells you List<T> is the bottleneck. The textbook "linked lists are good for inserts" answer is rarely the right one — modern CPUs love contiguous memory, and List<T> usually wins on real workloads.',

    callout: {
        variant: 'warn',
        title: 'Cache locality matters more than asymptotics',
        body:
            'Every node in a LinkedList<T> is a separate heap allocation. Walking the list means following pointers to scattered addresses, which CPUs are bad at. List<T> stores its items in one contiguous buffer that prefetchers can predict. Unless your insert/remove rate is extreme, List<T> wins.',
    },

    examples: [
        {
            caption: 'Construct, walk, splice',
            language: 'csharp',
            source:
                `// Construct
LinkedList<int> chain = new();
LinkedList<int> seeded = new(new[] { 1, 2, 3 });

// Add at ends — O(1), returns the new node
LinkedListNode<int> tail = chain.AddLast(99);
LinkedListNode<int> head = chain.AddFirst(0);

// Insert relative to a known node — O(1)
chain.AddAfter(head, 1);
chain.AddBefore(tail, 98);

// Find — O(n)
LinkedListNode<int>? node = chain.Find(1);

// Remove by node — O(1)
if (node is not null)
    chain.Remove(node);

// Walk forward / backward
for (var n = chain.First; n != null; n = n.Next)
    Console.WriteLine(n.Value);

for (var n = chain.Last; n != null; n = n.Previous)
    Console.WriteLine(n.Value);

// foreach — same struct enumerator pattern
foreach (int v in chain)
    Console.WriteLine(v);`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items currently in the list. Tracked, not computed.' },
        { name: 'First', type: 'LinkedListNode<T>?', description: 'Head node, or null when empty.' },
        { name: 'Last', type: 'LinkedListNode<T>?', description: 'Tail node, or null when empty.' },
    ],

    methods: [
        { name: 'AddFirst', signature: 'AddFirst(T value) → LinkedListNode<T>', complexity: 'O(1)' },
        { name: 'AddLast', signature: 'AddLast(T value) → LinkedListNode<T>', complexity: 'O(1)' },
        { name: 'AddBefore', signature: 'AddBefore(LinkedListNode<T> node, T value) → LinkedListNode<T>', complexity: 'O(1)' },
        { name: 'AddAfter', signature: 'AddAfter(LinkedListNode<T> node, T value) → LinkedListNode<T>', complexity: 'O(1)' },
        { name: 'Remove', signature: 'Remove(LinkedListNode<T> node) → void', complexity: 'O(1)' },
        { name: 'Remove', signature: 'Remove(T value) → bool', complexity: 'O(n)' },
        { name: 'RemoveFirst', signature: 'RemoveFirst() → void', complexity: 'O(1)' },
        { name: 'RemoveLast', signature: 'RemoveLast() → void', complexity: 'O(1)' },
        { name: 'Find', signature: 'Find(T value) → LinkedListNode<T>?', complexity: 'O(n)' },
        { name: 'FindLast', signature: 'FindLast(T value) → LinkedListNode<T>?', complexity: 'O(n)' },
        { name: 'Contains', signature: 'Contains(T value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'linked', label: 'LinkedList<T>', accent: 'generic' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
            { id: 'queue', label: 'Queue<T>', accent: 'generic' },
            { id: 'stack', label: 'Stack<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { linked: 'Doubly-linked nodes.', list: 'Resizing array.', queue: 'Circular array.', stack: 'Resizing array.' } },
            { aspect: 'Insert at ends', cells: { linked: 'O(1).', list: 'O(1) amortised at end.', queue: 'O(1) Enqueue.', stack: 'O(1) Push.' } },
            { aspect: 'Insert at middle', cells: { linked: 'O(1) at known node.', list: 'O(n).', queue: 'Not supported.', stack: 'Not supported.' } },
            { aspect: 'Memory layout', cells: { linked: 'Scattered nodes.', list: 'Contiguous.', queue: 'Contiguous.', stack: 'Contiguous.' } },
            { aspect: 'Best for', cells: { linked: 'Profiled middle inserts.', list: 'The default ordered collection.', queue: 'FIFO work queues.', stack: 'LIFO work queues.' } },
        ],
    },

    related: [
        { slug: 'list' },
        { slug: 'queue' },
        { slug: 'stack' },
        { slug: 'array' },
    ],
};