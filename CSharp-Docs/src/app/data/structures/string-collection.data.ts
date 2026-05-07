import type { Structure } from '../types';

export const STRING_COLLECTION_DATA: Structure = {
    slug: 'string-collection',
    name: 'StringCollection',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.Specialized.StringCollection — strongly-typed list of strings. Pre-generics convenience type; use List<string> in new code. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections.Specialized' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'warn', label: 'Pre-generics specialization' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'neutral', label: 'Indexed' },
        { variant: 'warn', label: 'Avoid in new code' },
    ],

    lead:
        'A list of string. Predates generics — when ArrayList was the only option, the BCL shipped a handful of typed-specialised collections (StringCollection, NameValueCollection) so callers could avoid casting. Today List<string> does the same thing better. Settings.Default.Properties exposes a StringCollection in the Windows Forms designer; that is roughly the only reason the type still appears in modern code.',

    metrics: [
        { label: 'Add', value: 'O(1) amortized', note: 'doubles the backing array' },
        { label: 'Index access', value: 'O(1)', note: 'returns string, no cast' },
        { label: 'Insert / Remove at i', value: 'O(n)', note: 'shifts everything after i' },
    ],

    whenToUse:
        'Reach for StringCollection only when the API you call returns one — Properties.Settings, certain configuration surfaces. For your own data, List<string> is the like-for-like replacement with the same big-O and a better surface.',

    examples: [
        {
            caption: 'Typed list, no casts',
            language: 'csharp',
            source:
                `using System.Collections.Specialized;

StringCollection words = new();
words.Add("alpha");
words.Add("beta");
words.AddRange(new[] { "gamma", "delta" });

string first = words[0]!;                           // returns string, no cast

bool has = words.Contains("alpha");
int  i   = words.IndexOf("beta");

words.Insert(1, "between");
words.RemoveAt(0);
words.Remove("delta");

foreach (string? w in words)
    Console.WriteLine(w);

// Modern equivalent
List<string> modern = new() { "alpha", "beta" };
modern.Add("gamma");`,
        },
    ],

    properties: [
        { name: 'Count', type: 'int', description: 'Number of strings.' },
        { name: 'this[int index]', type: 'string?', description: 'Indexer — O(1).' },
    ],

    methods: [
        { name: 'Add', signature: 'Add(string value) → int', complexity: 'O(1) amortized' },
        { name: 'AddRange', signature: 'AddRange(string[] value) → void', complexity: 'O(k)' },
        { name: 'Insert', signature: 'Insert(int index, string value) → void', complexity: 'O(n)' },
        { name: 'Remove', signature: 'Remove(string value) → void', complexity: 'O(n)' },
        { name: 'RemoveAt', signature: 'RemoveAt(int index) → void', complexity: 'O(n)' },
        { name: 'Contains', signature: 'Contains(string value) → bool', complexity: 'O(n)' },
        { name: 'IndexOf', signature: 'IndexOf(string value) → int', complexity: 'O(n)' },
        { name: 'Clear', signature: 'Clear() → void', complexity: 'O(n)' },
        { name: 'CopyTo', signature: 'CopyTo(string[] array, int index) → void', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'sc', label: 'StringCollection', accent: 'legacy' },
            { id: 'ls', label: 'List<string>', accent: 'generic' },
            { id: 'arr', label: 'string[]', accent: 'primitive' },
        ],
        rows: [
            { aspect: 'Type safety', cells: { sc: 'Specialised to string.', ls: 'Generic — full.', arr: 'Generic — full.' } },
            { aspect: 'Add', cells: { sc: 'O(1) amortised.', ls: 'O(1) amortised.', arr: 'Not supported.' } },
            { aspect: 'Index access', cells: { sc: 'O(1).', ls: 'O(1).', arr: 'O(1).' } },
            { aspect: 'Resize', cells: { sc: 'Grows on demand.', ls: 'Grows on demand.', arr: 'Fixed at allocation.' } },
            { aspect: 'Best for', cells: { sc: 'Settings.Default surfaces.', ls: 'The default string list.', arr: 'Hot loops, fixed sizes.' } },
        ],
    },

    related: [
        { slug: 'list' },
        { slug: 'array-list' },
        { slug: 'array' },
    ],
};