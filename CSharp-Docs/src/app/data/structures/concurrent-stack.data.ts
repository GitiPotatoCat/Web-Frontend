import type { Structure } from '../types';

export const CONCURRENT_STACK_DATA: Structure = {
    slug: 'concurrent-stack',
    name: 'ConcurrentStack<T>',
    namespace: 'concurrent',
    metaDescription:
        'System.Collections.Concurrent.ConcurrentStack<T> — lock-free LIFO stack using a singly-linked list with compare-and-swap. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Concurrent' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Lock-free' },
        { variant: 'neutral', label: 'LIFO' },
    ],

    lead:
        'A lock-free LIFO stack built as a singly-linked list with compare-and-swap on the head pointer. Push and TryPop allocate a node and swap; no locks, no global synchronisation. The thread-safe alternative to Stack<T> — useful for parallel work-stealing patterns and rare worker pools.',

    metrics: [
        { label: 'Push', value: 'O(1)', note: 'allocate node + CAS on head' },
        { label: 'TryPop', value: 'O(1)', note: 'CAS on head; returns false if empty' },
        { label: 'PushRange', value: 'O(k)', note: 'links a chain of k items, single CAS' },
    ],

    whenToUse:
        'Reach for ConcurrentStack when LIFO matters AND multiple threads push or pop. The most-recent-first ordering is what makes work-stealing worker pools efficient. For multi-producer FIFO use ConcurrentQueue; for unordered work pools where any item is fine, ConcurrentBag scales better.',

    callout: {
        variant: 'warn',
        title: 'Per-push allocation',
        body:
            'Every Push allocates a linked-list node — there is no array reuse. In tight hot loops this becomes GC pressure. PushRange amortises by linking k nodes with a single CAS at the head; reach for it whenever you have a batch ready.',
    },

    examples: [
        {
            caption: 'Lock-free LIFO',
            language: 'csharp',
            source:
                `using System.Collections.Concurrent;

ConcurrentStack<int> work = new();
ConcurrentStack<int> seeded = new(new[] { 1, 2, 3 });

// Push — many threads can call this concurrently
Parallel.For(0, 1_000, work.Push);

// TryPop — returns false when empty
while (work.TryPop(out int item))
    Process(item);

// TryPeek — diagnostic; the value may be popped before you read it again
if (work.TryPeek(out int top))
    Console.WriteLine(top);

// Batch push — single CAS for k items, less GC pressure
int[] batch = { 10, 11, 12, 13 };
work.PushRange(batch);

// Batch pop — pulls multiple items in one call
int[] buffer = new int[16];
int popped = work.TryPopRange(buffer);
for (int i = 0; i < popped; i++)
    Process(buffer[i]);

void Process(int n) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Item count. Walks the linked list — prefer IsEmpty.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check.' },
    ],

    methods: [
        { name: 'Push', signature: 'Push(T item) → void', complexity: 'O(1)' },
        { name: 'PushRange', signature: 'PushRange(T[] items) → void', complexity: 'O(k)' },
        { name: 'TryPop', signature: 'TryPop(out T result) → bool', complexity: 'O(1)' },
        { name: 'TryPopRange', signature: 'TryPopRange(T[] items) → int', complexity: 'O(k)' },
        { name: 'TryPeek', signature: 'TryPeek(out T result) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'cs', label: 'ConcurrentStack<T>', accent: 'concurrent' },
            { id: 's', label: 'Stack<T> + lock', accent: 'generic' },
            { id: 'is', label: 'ImmutableStack<T>', accent: 'immutable' },
            { id: 'cb', label: 'ConcurrentBag<T>', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Backing', cells: { cs: 'Linked list with CAS.', s: 'Resizing array.', is: 'Cons list.', cb: 'Thread-local stacks + steal list.' } },
            { aspect: 'Synchronisation', cells: { cs: 'Lock-free CAS.', s: 'Single lock you write.', is: 'None — immutable.', cb: 'Lock-free for owner; stealing locks.' } },
            { aspect: 'Allocation', cells: { cs: 'One node per Push.', s: 'Amortised zero on Push.', is: 'One node per Push.', cb: 'Mostly array-backed thread-locals.' } },
            { aspect: 'Order', cells: { cs: 'LIFO across all threads.', s: 'LIFO.', is: 'LIFO across snapshots.', cb: 'Unordered — best for work pools.' } },
            { aspect: 'Best for', cells: { cs: 'Multi-writer LIFO, work-steal.', s: 'Single-thread LIFO.', is: 'Snapshot LIFO histories.', cb: 'Unordered worker pools.' } },
        ],
    },

    related: [
        { slug: 'stack' },
        { slug: 'concurrent-queue' },
        { slug: 'concurrent-bag' },
        { slug: 'immutable-stack' },
    ],
};