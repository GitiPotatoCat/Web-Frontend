import type { Structure } from '../types';

export const IMMUTABLE_LIST_DATA: Structure = {
    slug: 'immutable-list',
    name: 'ImmutableList<T>',
    namespace: 'primitive', // Matches your "Primitive" namespace pip from step 1
    metaDescription:
        'System.Collections.Immutable.ImmutableList<T> — persistent ordered list backed by an AVL tree. O(log n) access/mutation. Optimized for structural sharing.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Immutable' },
        { variant: 'neutral', label: '.NET 10 / C# 14' },
        { variant: 'ok', label: 'Immutable' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Structural Sharing' },
        { variant: 'warn', label: 'O(log n) Reads' },
    ],

    lead:
        'A persistent ordered list backed by a self-balancing AVL tree of segments. Every operation is O(log n) — including index access. Each modification produces a new list that shares unchanged segments with its predecessor, ensuring memory efficiency across snapshots.',

    metrics: [
        { label: 'Index access', value: 'O(log n)', note: 'tree traversal' },
        { label: 'Add / Insert', value: 'O(log n)', note: 'returns new list + rebalance' },
        { label: 'SetItem', value: 'O(log n)', note: 'path copy, shared subtrees' },
    ],

    whenToUse:
        'Use ImmutableList when you need frequent snapshots or "undo" history where O(n) array copies are too expensive. If your data is 95% reads and small enough to copy, use ImmutableArray instead.',

    callout: {
        variant: 'note',
        title: 'Performance Tip: Builders',
        body:
            'Batching matters. When making multiple writes, use `ToBuilder()`. It allows mutation in-place and converts back to an ImmutableList in O(1) time by freezing the final tree structure.',
    },

    diagram: {
        caption: 'Structural sharing on insertion',
        body:
            `  List A          List B = A.Insert(2, "X")
    ┌─┐                ┌─┐
    │R│                │R'│     R' is a new root
    └┬┘                └┬┘
   ┌─┴──┐             ┌─┴──┐
   ▼    ▼             ▼    ▼
  ┌─┐  ┌─┐           ┌─┐  ┌─┐   Only L' is new;
  │L│  │R│           │L'│ │R│   R is shared by ref.
  └─┘  └─┘           └─┘  └─┘`
    },

    examples: [
        {
            caption: 'Snapshots and Builders',
            language: 'csharp',
            source:
                `using System.Collections.Immutable;

// 1. Immutable modification
var list = ImmutableList.Create(1, 2, 3);
var next = list.Add(4); // list is still [1, 2, 3]

// 2. High-performance batching
var builder = list.ToBuilder();
for(int i = 0; i < 100; i++) builder.Add(i);
var finalized = builder.ToImmutable(); // O(1) handoff`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Total elements in the tree.' },
        { name: 'IsEmpty', type: 'bool', description: 'True if root is null.' },
        { name: 'this[int]', type: 'T', description: 'O(log n) access via tree traversal.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T value)', complexity: 'O(log n)' },
        { name: 'AddRange', signature: 'AddRange(IEnumerable<T>)', complexity: 'O(log n)' }, // Note: usually O(k log n) but typically typed as O(log n) in UI schemas
        { name: 'Insert', signature: 'Insert(int, T)', complexity: 'O(log n)' },
        { name: 'SetItem', signature: 'SetItem(int, T)', complexity: 'O(log n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int)', complexity: 'O(log n)' },
        { name: 'ToBuilder', signature: 'ToBuilder()', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'il', label: 'ImmutableList', accent: 'immutable' },
            { id: 'ia', label: 'ImmutableArray', accent: 'immutable' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Backing', cells: { il: 'AVL Tree', ia: 'Array', list: 'Array' } },
            { aspect: 'Read', cells: { il: 'O(log n)', ia: 'O(1)', list: 'O(1)' } },
            { aspect: 'Write', cells: { il: 'O(log n)', ia: 'O(n)', list: 'O(1)' } },
            { aspect: 'Sharing', cells: { il: 'Yes', ia: 'No', list: 'N/A' } },
        ],
    },

    related: [
        { slug: 'immutable-array' },
        { slug: 'list' },
        { slug: 'immutable-dictionary' },
    ],
};