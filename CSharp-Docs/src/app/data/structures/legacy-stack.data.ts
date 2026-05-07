import type { Structure } from '../types';

export const LEGACY_STACK_DATA: Structure = {
    slug: 'legacy-stack',
    name: 'Stack (legacy)',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.Stack — pre-generics LIFO stack of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Non-generic' },
        { variant: 'warn', label: 'Boxes value types' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'LIFO' },
    ],

    lead:
        'A LIFO stack of object — the .NET 1.0 stack, kept around for compatibility with code that predates generics. Same Push / Pop / Peek as Stack<T>, plus the unavoidable boxing tax on every value type that goes in. Use Stack<T> in new code.',

    metrics: [
        { label: 'Push', value: 'O(1) amortized', note: 'doubles when full; boxes value types' },
        { label: 'Pop', value: 'O(1)', note: 'returns object; cast required' },
        { label: 'Peek', value: 'O(1)', note: 'reads the top in place' },
    ],

    whenToUse:
        'Reach for the legacy Stack only when maintaining code that already uses it. Stack<T> from System.Collections.Generic is faster, type-safe, and free of boxing for value types.',

    examples: [
        {
            caption: 'Push, pop, cast',
            language: 'csharp',
            source:
                `using System.Collections;

Stack stack = new();
Stack sized = new(initialCapacity: 64);

stack.Push(42);                                    // int → boxed
stack.Push("hello");
stack.Push(3.14);

object top = stack.Peek();                         // returns object
double pi = (double)stack.Pop();                   // cast + unbox
string s = (string)stack.Pop();
int n = (int)stack.Pop();

// Iterate top-to-bottom
foreach (object o in stack)
    Console.WriteLine(o);

// Modern equivalent — no boxing, no casts
Stack<int> modern = new();
modern.Push(42);
int v = modern.Pop();`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Items in the stack.' },
    ],

    methods: [
        { name: 'Push', signature: 'Push(object obj) → void', complexity: 'O(1) amortized' },
        { name: 'Pop', signature: 'Pop() → object', complexity: 'O(1)' },
        { name: 'Peek', signature: 'Peek() → object', complexity: 'O(1)' },
        { name: 'Contains', signature: 'Contains(object obj) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → object[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'ls', label: 'Stack (legacy)', accent: 'legacy' },
            { id: 's', label: 'Stack<T>', accent: 'generic' },
            { id: 'cs', label: 'ConcurrentStack<T>', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { ls: 'None — object.', s: 'Generic — full.', cs: 'Generic — full.' } },
            { aspect: 'Value types', cells: { ls: 'Boxed on Push.', s: 'Stored inline.', cs: 'Stored inline.' } },
            { aspect: 'Thread-safe', cells: { ls: 'No.', s: 'No.', cs: 'Yes — lock-free.' } },
            { aspect: 'Best for', cells: { ls: 'Legacy code only.', s: 'The default LIFO.', cs: 'Multi-writer LIFO.' } },
        ],
    },

    related: [
        { slug: 'stack' },
        { slug: 'concurrent-stack' },
        { slug: 'immutable-stack' },
        { slug: 'array-list' },
    ],
};