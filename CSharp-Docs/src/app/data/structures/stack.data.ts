import type { Structure } from '../types';

export const STACK_DATA: Structure = {
    slug: 'stack',
    name: 'Stack<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.Generic.Stack<T> — array-backed LIFO stack. O(1) Push, Pop, Peek. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Generic' },
        { variant: 'neutral', label: 'Since .NET 2.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'LIFO' },
    ],

    lead:
        'A last-in-first-out stack backed by a resizing array. Push adds to the top, Pop removes from the top, Peek inspects without removing — all O(1) amortised. The default stack implementation in C#; reach for ConcurrentStack<T> only when you have multiple writers.',

    metrics: [
        { label: 'Push', value: 'O(1) amortized', note: 'doubles when full' },
        { label: 'Pop', value: 'O(1)', note: 'returns and removes the top' },
        { label: 'Peek', value: 'O(1)', note: 'reads the top in place' },
    ],

    whenToUse:
        'Reach for Stack<T> whenever the LIFO shape matches the problem — recursive descent without recursion, undo stacks within a single thread, depth-first traversal. For multi-writer LIFO use ConcurrentStack<T>; for snapshot semantics use ImmutableStack<T>.',

    callout: {
        variant: 'note',
        title: 'TryPop and TryPeek are the safe forms',
        body:
            'Pop() and Peek() throw InvalidOperationException on an empty stack. TryPop and TryPeek return false instead — the idiomatic shape in modern C# code, especially in tight loops where the empty case is reachable.',
    },

    examples: [
        {
            caption: 'LIFO basics',
            language: 'csharp',
            source:
                `// Construct
Stack<string> scopes = new();
Stack<int>    counts = new(new[] { 1, 2, 3 });    // top will be 3

// Push — O(1) amortised
scopes.Push("module");
scopes.Push("class");
scopes.Push("method");

// Peek — read the top without removing
string current = scopes.Peek();                    // "method"

// Pop — read and remove
string popped = scopes.Pop();                      // "method"

// Try-form: returns false on empty rather than throwing
if (scopes.TryPop(out string? next))
    Console.WriteLine(next);

// Iterate top-to-bottom
foreach (string s in scopes)
    Console.WriteLine(s);                          // class, module

// Drain pattern
while (scopes.Count > 0)
    Process(scopes.Pop());

void Process(string s) { /* ... */ }`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items in the stack. Cheap; tracked.' },
    ],

    methods: [
        { name: 'Push', signature: 'Push(T item) → void', complexity: 'O(1) amortized' },
        { name: 'Pop', signature: 'Pop() → T', complexity: 'O(1)' },
        { name: 'TryPop', signature: 'TryPop(out T result) → bool', complexity: 'O(1)' },
        { name: 'Peek', signature: 'Peek() → T', complexity: 'O(1)' },
        { name: 'TryPeek', signature: 'TryPeek(out T result) → bool', complexity: 'O(1)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → T[]', complexity: 'O(n)' },
        { name: 'TrimExcess', signature: 'TrimExcess() → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'stack', label: 'Stack<T>', accent: 'generic' },
            { id: 'cstack', label: 'ConcurrentStack<T>', accent: 'concurrent' },
            { id: 'istack', label: 'ImmutableStack<T>', accent: 'immutable' },
            { id: 'lstack', label: 'Stack (legacy)', accent: 'legacy' },
        ],
        rows: [
            { aspect: 'Backing', cells: { stack: 'Resizing array.', cstack: 'Linked list with CAS.', istack: 'Cons list.', lstack: 'Resizing array of object.' } },
            { aspect: 'Push / Pop', cells: { stack: 'O(1) amortised.', cstack: 'O(1) lock-free.', istack: 'O(1) — returns new.', lstack: 'O(1) plus boxing.' } },
            { aspect: 'Thread-safe', cells: { stack: 'No.', cstack: 'Yes.', istack: 'Yes — immutable.', lstack: 'No.' } },
            { aspect: 'Type safety', cells: { stack: 'Generic.', cstack: 'Generic.', istack: 'Generic.', lstack: 'object — boxes value types.' } },
            { aspect: 'Best for', cells: { stack: 'The default LIFO.', cstack: 'Multi-writer LIFO.', istack: 'Snapshot histories.', lstack: 'Compatibility only.' } },
        ],
    },

    related: [
        { slug: 'queue' },
        { slug: 'concurrent-stack' },
        { slug: 'immutable-stack' },
        { slug: 'legacy-stack' },
        { slug: 'list' },
    ],
};