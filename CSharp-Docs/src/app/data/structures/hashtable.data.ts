import type { Structure } from '../types';

export const HASHTABLE_DATA: Structure = {
    slug: 'hashtable',
    name: 'Hashtable',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.Hashtable — pre-generics hash table of object → object. Reads thread-safe, writes need a lock. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Non-generic' },
        { variant: 'warn', label: 'Boxes value types' },
        { variant: 'ok', label: 'Reads are thread-safe' },
        { variant: 'warn', label: 'Writes need a lock' },
    ],

    lead:
        'A hash table from object keys to object values — the .NET 1.0 dictionary, before generics. O(1) average across the board, plus a quiet legacy quirk: reads from a single Hashtable are thread-safe, writes are not. Dictionary<K,V> drops the thread-safe-read promise (because it was rarely useful) and gains type safety, less boxing, and better performance. Use Dictionary<K,V> in new code.',

    metrics: [
        { label: 'Add', value: 'O(1)', note: 'amortised; rehashes on overflow' },
        { label: 'Lookup', value: 'O(1)', note: 'one hash, one bucket walk; cast required' },
        { label: 'Remove', value: 'O(1)', note: 'unlinks from the bucket chain' },
    ],

    whenToUse:
        'Reach for Hashtable only when you maintain code that already uses it. The thread-safe-read promise sounds appealing but is rarely sufficient on its own — most multi-writer scenarios still need a lock or ConcurrentDictionary. New code should pick Dictionary<K,V> or ConcurrentDictionary<K,V> with intent.',

    callout: {
        variant: 'warn',
        title: 'Thread-safe reads, not full thread safety',
        body:
            'A single Hashtable is safe for many readers and one writer — but a "writer" includes any thread that mutates the structure, including via expansion-triggering Add. If multiple threads can write you still need a lock or, more usefully, ConcurrentDictionary, which was designed for the multi-writer case from the start.',
    },

    examples: [
        {
            caption: 'Object-keyed map',
            language: 'csharp',
            source:
                `using System.Collections;

// Construct
Hashtable map = new();
Hashtable sized = new(capacity: 1024);
Hashtable ci = new(StringComparer.OrdinalIgnoreCase);

// Add — keys and values are both object
map.Add("Ada",   36);                               // 36 boxed
map.Add(42, "answer");                              // 42 boxed as key
map["Linus"] = 54;                                   // indexer also adds

// Lookup — returns object; null indicates "not present"
object? value = map["Ada"];
if (value is int age)
    Console.WriteLine(age);

// ContainsKey, ContainsValue
bool has = map.ContainsKey("Ada");
bool any = map.ContainsValue(36);                   // also boxed for comparison

// Iterate — yields DictionaryEntry, not KeyValuePair
foreach (DictionaryEntry e in map)
    Console.WriteLine($"{e.Key} → {e.Value}");

// Synchronized wrapper for safe writes
Hashtable safe = Hashtable.Synchronized(map);

// Modern equivalent — type-safe, no boxing
Dictionary<string, int> modern = new()
{
    ["Ada"]   = 36,
    ["Linus"] = 54,
};`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of entries.' },
        { name: 'Keys', type: 'ICollection', description: 'Live view over keys.' },
        { name: 'Values', type: 'ICollection', description: 'Live view over values.' },
        { name: 'IsSynchronized', type: 'bool', description: 'Whether this instance is the wrapper returned by Synchronized.' },
        { name: 'this[object key]', type: 'object?', description: 'Indexer — set adds or overwrites; read returns null when missing.' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(object key, object value) → void', complexity: 'O(1)' },
        { name: 'Remove', signature: 'Remove(object key) → void', complexity: 'O(1)' },
        { name: 'ContainsKey', signature: 'ContainsKey(object key) → bool', complexity: 'O(1)' },
        { name: 'ContainsValue', signature: 'ContainsValue(object value) → bool', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'Synchronized', signature: 'Hashtable.Synchronized(Hashtable t) → Hashtable', complexity: 'O(1)' },
    ],

    comparison: {
        columns: [
            { id: 'ht', label: 'Hashtable', accent: 'legacy' },
            { id: 'd', label: 'Dictionary<K,V>', accent: 'generic' },
            { id: 'cd', label: 'ConcurrentDictionary', accent: 'concurrent' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { ht: 'None — object → object.', d: 'Generic — full.', cd: 'Generic — full.' } },
            { aspect: 'Value types', cells: { ht: 'Boxed on every Add.', d: 'Stored inline.', cd: 'Stored inline.' } },
            { aspect: 'Reads', cells: { ht: 'Safe for many readers.', d: 'Single thread only.', cd: 'Lock-free, fully safe.' } },
            { aspect: 'Writes', cells: { ht: 'Need a lock or Synchronized.', d: 'Single thread only.', cd: 'Striped locks, fully safe.' } },
            { aspect: 'Best for', cells: { ht: 'Legacy code only.', d: 'The default map.', cd: 'Multi-writer maps.' } },
        ],
    },

    related: [
        { slug: 'dictionary' },
        { slug: 'concurrent-dictionary' },
        { slug: 'array-list' },
    ],
};