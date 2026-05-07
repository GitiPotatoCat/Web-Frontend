import type { Structure } from '../types';

export const CONCURRENT_DICTIONARY_DATA: Structure = {
    slug: 'concurrent-dictionary',
    name: 'ConcurrentDictionary<TKey, TValue>',
    namespace: 'concurrent',
    metaDescription:
        'System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue> — striped-lock thread-safe hash table. Lock-free reads, fine-grained-locked writes. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Concurrent' },
        { variant: 'neutral', label: 'Since .NET 4.0' },
        { variant: 'ok', label: 'Generic' },
        { variant: 'ok', label: 'Thread-safe' },
        { variant: 'ok', label: 'Lock-free reads' },
        { variant: 'warn', label: 'Atomic-update API' },
    ],

    lead:
        'A thread-safe hash table designed for many concurrent readers and writers. Reads are lock-free; writes take a striped lock — only one of N internal locks (typically one per CPU core), so unrelated writes proceed in parallel. Reach for it whenever a Dictionary<K,V> would need a lock around it; the striped design almost always beats the global lock you would otherwise write.',

    metrics: [
        { label: 'TryAdd / TryRemove', value: 'O(1)', note: 'one striped lock acquisition' },
        { label: 'TryGetValue', value: 'O(1)', note: 'lock-free read of the bucket' },
        { label: 'AddOrUpdate', value: 'O(1)', note: 'atomic compose, may retry on contention' },
    ],

    whenToUse:
        'Reach for ConcurrentDictionary whenever the same hash map is touched from multiple threads — caches, in-memory indexes, accumulators in parallel pipelines. Stick to Dictionary<K,V> when only one thread mutates and reads happen on the same thread; the concurrent version costs more per operation in the single-threaded case.',

    callout: {
        variant: 'note',
        title: 'Use the atomic helpers, not the indexer',
        body:
            'TryAdd, TryRemove, AddOrUpdate, GetOrAdd, and TryUpdate are atomic against other writers. Reading via the indexer and then writing back is NOT — another thread can race you between the two. Whenever you find yourself writing "if it exists, change it; otherwise add it", reach for AddOrUpdate.',
    },

    diagram: {
        caption: 'Striped locks',
        body:
            `  buckets   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ... ┌────┐
            │  0 │ │  1 │ │  2 │ │  3 │ │  4 │     │ N-1│
            └────┘ └────┘ └────┘ └────┘ └────┘     └────┘
                ▲      ▲      ▲      ▲
                │      │      │      │
            ┌────┴──┐ ┌─┴────┐ ┌─┴────┐
  locks    │ lock 0 │ │ lock 1│ │ lock 2│  ...     ← typically one per core
            └────────┘ └───────┘ └───────┘

  Each bucket maps to one of N locks. Writers contend ONLY when they
  hash to the same lock. Readers never take a lock at all.`,
    },

    examples: [
        {
            caption: 'Atomic update patterns',
            language: 'csharp',
            source:
                `using System.Collections.Concurrent;

ConcurrentDictionary<string, int> hits = new();
ConcurrentDictionary<string, int> sized = new(concurrencyLevel: 8, capacity: 1024);

// Try-form set / remove
bool added   = hits.TryAdd("home", 1);
bool removed = hits.TryRemove("home", out int oldValue);

// GetOrAdd — atomic "lazy initialise on first touch"
int counter = hits.GetOrAdd("hot-page", _ => 0);

// AddOrUpdate — atomic compose
hits.AddOrUpdate(
    key: "/about",
    addValue: 1,
    updateValueFactory: (_, existing) => existing + 1);

// TryUpdate — compare-and-swap, returns false if the existing value changed
bool swapped = hits.TryUpdate("/about", newValue: 100, comparisonValue: 1);

// Iterate — yields a SNAPSHOT of entries seen so far (not a live view)
foreach ((string key, int value) in hits)
    Console.WriteLine($"{key}: {value}");

// The DON'T pattern — racy
//   int n = hits["/about"];           ← read
//   hits["/about"] = n + 1;           ← write — another thread may have raced
// Use AddOrUpdate instead.

// Bulk-style snapshot to a Dictionary if you need a stable view
Dictionary<string, int> snapshot = hits.ToDictionary(kv => kv.Key, kv => kv.Value);`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Approximate item count. May briefly observe in-flight changes; takes all internal locks to compute.' },
        { name: 'IsEmpty', type: 'bool', description: 'Cheap emptiness check; avoids the all-locks cost of Count.' },
        { name: 'Keys', type: 'ICollection<TKey>', description: 'Snapshot of keys at the moment of the call. Not a live view.' },
        { name: 'Values', type: 'ICollection<TValue>', description: 'Snapshot of values at the moment of the call.' },
        { name: 'this[TKey key]', type: 'TValue', description: 'Indexer — set is atomic; combined read-and-write is NOT. Use AddOrUpdate / TryUpdate.' },
    ],

    methods: [
        { name: 'TryAdd', signature: 'TryAdd(TKey key, TValue value) → bool', complexity: 'O(1)' },
        { name: 'TryRemove', signature: 'TryRemove(TKey key, out TValue value) → bool', complexity: 'O(1)' },
        { name: 'TryGetValue', signature: 'TryGetValue(TKey, out TValue) → bool', complexity: 'O(1)' },
        { name: 'TryUpdate', signature: 'TryUpdate(TKey key, TValue newValue, TValue comparisonValue) → bool', complexity: 'O(1)' },
        { name: 'GetOrAdd', signature: 'GetOrAdd(TKey key, Func<TKey, TValue> factory) → TValue', complexity: 'O(1)' },
        { name: 'AddOrUpdate', signature: 'AddOrUpdate(TKey, Func<TKey,TValue> add, Func<TKey,TValue,TValue> update) → TValue', complexity: 'O(1)' },
        { name: 'ContainsKey', signature: 'ContainsKey(TKey key) → bool', complexity: 'O(1)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'ToArray', signature: 'ToArray() → KeyValuePair<TKey, TValue>[]', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'cd', label: 'ConcurrentDictionary', accent: 'concurrent' },
            { id: 'd', label: 'Dictionary<K,V> + lock', accent: 'generic' },
            { id: 'id', label: 'ImmutableDictionary', accent: 'immutable' },
            { id: 'ht', label: 'Hashtable.Synchronized', accent: 'legacy' },
        ],
        rows: [
            { aspect: 'Locking', cells: { cd: 'Striped — N internal locks.', d: 'Single lock you write.', id: 'None — values never change.', ht: 'Single global lock.' } },
            { aspect: 'Reads', cells: { cd: 'Lock-free.', d: 'Take the shared lock.', id: 'Lock-free.', ht: 'Wait for the global lock.' } },
            { aspect: 'Writes scale', cells: { cd: 'Linearly with cores.', d: 'Single-writer at a time.', id: 'Producer creates new instance.', ht: 'Single-writer at a time.' } },
            { aspect: 'Atomic compose', cells: { cd: 'AddOrUpdate, GetOrAdd, TryUpdate.', d: 'You hand-roll inside the lock.', id: 'SetItem returns new map.', ht: 'You hand-roll inside the lock.' } },
            { aspect: 'Best for', cells: { cd: 'Multi-writer hash maps.', d: 'Single-thread or rare contention.', id: 'Snapshot semantics.', ht: 'Legacy code only.' } },
        ],
    },

    related: [
        { slug: 'dictionary' },
        { slug: 'concurrent-queue' },
        { slug: 'concurrent-bag' },
        { slug: 'immutable-dictionary' },
        { slug: 'blocking-collection' },
    ],
};