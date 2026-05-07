import type { Structure } from '../types';

export const OBSERVABLE_COLLECTION_DATA: Structure = {
    slug: 'observable-collection',
    name: 'ObservableCollection<T>',
    namespace: 'generic',
    metaDescription:
        'System.Collections.ObjectModel.ObservableCollection<T> — list that raises CollectionChanged on every mutation. The MVVM workhorse. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.ObjectModel' },
        { variant: 'neutral', label: 'Since .NET 3.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'ok', label: 'INotifyCollectionChanged' },
        { variant: 'ok', label: 'INotifyPropertyChanged' },
    ],

    lead:
        'A List-like collection that raises CollectionChanged after every mutation and PropertyChanged for Count and indexer changes. The default backing collection for data-bound lists in WPF, MAUI, WinUI, and Avalonia. Same big-O as List<T>, plus the cost of the event dispatch.',

    metrics: [
        { label: 'Add', value: 'O(1) amortized', note: 'plus event dispatch' },
        { label: 'Index access', value: 'O(1)', note: 'same as List<T>' },
        { label: 'Insert / Remove at i', value: 'O(n)', note: 'shifts plus event dispatch' },
    ],

    whenToUse:
        'Reach for ObservableCollection<T> in any data-bound UI scenario where the view should auto-refresh on collection changes — MVVM lists, search results, kanban columns. Outside of UI binding the event overhead is pure cost; use List<T> instead.',

    callout: {
        variant: 'warn',
        title: 'CollectionChanged fires on the originating thread',
        body:
            'If a background thread mutates the collection, the event fires on that thread — and a UI binding will throw because UI elements can only be touched from the UI thread. Either marshal the mutation back via Dispatcher / SynchronizationContext, or use a thread-safe wrapper that re-raises events on the right thread.',
    },

    examples: [
        {
            caption: 'Bindable list',
            language: 'csharp',
            source:
                `using System.Collections.ObjectModel;
using System.Collections.Specialized;

// Construct — empty or seeded from any IEnumerable
ObservableCollection<string> tasks = new();
ObservableCollection<int> seeded = new(new[] { 1, 2, 3 });

// Subscribe to changes — typical MVVM pattern
tasks.CollectionChanged += OnChanged;

// Add — O(1) amortised; raises CollectionChanged with action = Add
tasks.Add("write tests");
tasks.Add("review PR");

// Insert / Remove / Move all raise CollectionChanged
tasks.Insert(0, "set up CI");
tasks.RemoveAt(1);
tasks.Move(0, tasks.Count - 1);                    // unique to ObservableCollection

// Indexer set raises CollectionChanged with action = Replace
tasks[0] = "configure CI";

void OnChanged(object? sender, NotifyCollectionChangedEventArgs e)
{
    switch (e.Action)
    {
        case NotifyCollectionChangedAction.Add:
            Console.WriteLine($"+ {e.NewItems?[0]}");
            break;
        case NotifyCollectionChangedAction.Remove:
            Console.WriteLine($"- {e.OldItems?[0]}");
            break;
        case NotifyCollectionChangedAction.Replace:
            Console.WriteLine($"~ {e.OldItems?[0]} → {e.NewItems?[0]}");
            break;
        case NotifyCollectionChangedAction.Move:
            Console.WriteLine($"↕ {e.OldStartingIndex} → {e.NewStartingIndex}");
            break;
        case NotifyCollectionChangedAction.Reset:
            Console.WriteLine("cleared");
            break;
    }
}`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of items. Raises PropertyChanged on change.' },
        { name: 'this[int index]', type: 'T', description: 'Indexer — raises CollectionChanged on set.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(T item) → void', complexity: 'O(1) amortized' },
        { name: 'Insert', signature: 'Insert(int index, T item) → void', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(T item) → bool', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'Move', signature: 'Move(int oldIndex, int newIndex) → void', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'Contains', signature: 'Contains(T item) → bool', complexity: 'O(n)' },
        { name: 'IndexOf', signature: 'IndexOf(T item) → int', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'oc', label: 'ObservableCollection<T>', accent: 'generic' },
            { id: 'list', label: 'List<T>', accent: 'generic' },
            { id: 'roc', label: 'ReadOnlyObservableCollection<T>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Notifications', cells: { oc: 'CollectionChanged + PropertyChanged.', list: 'None.', roc: 'Re-raises wrapped collection events.' } },
            { aspect: 'Mutation API', cells: { oc: 'Add / Insert / Remove / Move / Clear.', list: 'Same minus Move.', roc: 'None — read-only.' } },
            { aspect: 'Thread-safety', cells: { oc: 'No — UI thread only.', list: 'No.', roc: 'Same as wrapped collection.' } },
            { aspect: 'Best for', cells: { oc: 'MVVM / data-bound UI lists.', list: 'Headless lists.', roc: 'Exposing a bindable list as read-only.' } },
        ],
    },

    related: [
        { slug: 'list' },
        { slug: 'linked-list' },
        { slug: 'immutable-list' },
    ],
};