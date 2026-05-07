import type { Structure } from '../types';

export const BIT_ARRAY_DATA: Structure = {
    slug: 'bit-array',
    name: 'BitArray',
    namespace: 'legacy',
    metaDescription:
        'System.Collections.BitArray — fixed-length array of bits packed into 32-bit words. Bitwise operations, sieves, flags. Reference for .NET 10 / C# 14.',

    badges: [
        { variant: 'namespace', label: 'System.Collections' },
        { variant: 'neutral', label: 'Since .NET 1.0' },
        { variant: 'ok', label: 'Memory-dense' },
        { variant: 'warn', label: 'Not thread-safe' },
        { variant: 'ok', label: 'Bitwise operators' },
        { variant: 'neutral', label: 'Fixed length' },
    ],

    lead:
        'A fixed-length array of bits packed into 32-bit words — eight bits per byte, no boxing, bitwise And / Or / Xor / Not built in. Lives under System.Collections for historical reasons but earns its keep as the most memory-dense way to store boolean state in the BCL. Useful in modern code where bit-packed flags or sieves matter.',

    metrics: [
        { label: 'Get / Set bit', value: 'O(1)', note: 'bit-mask into the word array' },
        { label: 'And / Or / Xor', value: 'O(n)', note: 'word-by-word over both arrays' },
        { label: 'Memory', value: 'O(n)', note: 'one bit per element [O(n / 32)]' },
    ],

    whenToUse:
        'Reach for BitArray when storing thousands of booleans (flags, presence vectors, sieves) and memory matters — a bool[] uses one byte per entry, BitArray uses one bit. Use bool[] when speed of individual access dominates and the count is small; use HashSet<int> when the indices are sparse.',

    callout: {
        variant: 'highlight',
        title: 'A million booleans for 128 KB',
        body:
            'A BitArray of length 1,000,000 uses about 128 KB; a bool[] of the same length uses 1 MB. The cost of the bit-mask on each access is small, the saving is real. Sieves of Eratosthenes, presence sets keyed by small integers, hot-path flag arrays — all natural fits.',
    },

    examples: [
        {
            caption: 'Flags, sieves, bitwise ops',
            language: 'csharp',
            source:
                `using System.Collections;

// Construct — length, plus an optional initial value
BitArray flags = new(length: 1024);                 // all false
BitArray seeded = new(length: 8, defaultValue: true);
BitArray fromBool = new(new[] { true, false, true });
BitArray fromBytes = new(new byte[] { 0b1010_1010 });

// Get / Set — O(1)
flags[3] = true;
bool b = flags[3];

// Bitwise — mutates in place, returns the receiver
BitArray a = new(new[] { true, false, true,  false });
BitArray b2 = new(new[] { true, true,  false, false });

a.And(b2);                                          // a = {1, 0, 0, 0}
a.Or(b2);                                           // a = {1, 1, 0, 0}
a.Xor(b2);                                          // a = {0, 0, 0, 0}
a.Not();                                            // a = {1, 1, 1, 1}

// Iterate — yields bool
foreach (bool bit in flags)
    if (bit) Console.WriteLine("set");

// Sieve of Eratosthenes — classic BitArray fit
static BitArray Sieve(int n)
{
    BitArray prime = new(n + 1, true);
    prime[0] = prime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (prime[i])
            for (int j = i * i; j <= n; j += i)
                prime[j] = false;
    return prime;
}`,
        },
    ],

    properties: [
        { name: 'Length', type: 'int', description: 'Number of bits. Setting it grows or truncates.' },
        { name: 'Count', type: 'int', description: 'Same as Length — kept for ICollection.' },
        { name: 'this[int index]', type: 'bool', description: 'Indexer — O(1) get and set.' },
    ],

    methods: [
        { name: 'Set', signature: 'Set(int index, bool value) → void', complexity: 'O(1)' },
        { name: 'Get', signature: 'Get(int index) → bool', complexity: 'O(1)' },
        { name: 'SetAll', signature: 'SetAll(bool value) → void', complexity: 'O(n / 32)' as Structure['methods'][number]['complexity'] },
        { name: 'And', signature: 'And(BitArray value) → BitArray', complexity: 'O(n)' },
        { name: 'Or', signature: 'Or(BitArray value) → BitArray', complexity: 'O(n)' },
        { name: 'Xor', signature: 'Xor(BitArray value) → BitArray', complexity: 'O(n)' },
        { name: 'Not', signature: 'Not() → BitArray', complexity: 'O(n)' },
        { name: 'HasAllSet', signature: 'HasAllSet() → bool', complexity: 'O(n)' },
        { name: 'HasAnySet', signature: 'HasAnySet() → bool', complexity: 'O(n)' },
        { name: 'CopyTo', signature: 'CopyTo(Array array, int index) → void', complexity: 'O(n)' },
        { name: 'Clone', signature: 'Clone() → object', complexity: 'O(n)' },
    ],

    comparison: {
        columns: [
            { id: 'ba', label: 'BitArray', accent: 'legacy' },
            { id: 'bool', label: 'bool[]', accent: 'primitive' },
            { id: 'hs', label: 'HashSet<int>', accent: 'generic' },
        ],
        rows: [
            { aspect: 'Memory', cells: { ba: '~1 bit / element.', bool: '1 byte / element.', hs: 'Bucket overhead per item.' } },
            { aspect: 'Get / Set', cells: { ba: 'O(1) with bit-mask.', bool: 'O(1) direct.', hs: 'O(1) hash.' } },
            { aspect: 'Bitwise ops', cells: { ba: 'And, Or, Xor, Not in place.', bool: 'Manual loops.', hs: 'IntersectWith / UnionWith / ExceptWith.' } },
            { aspect: 'Length', cells: { ba: 'Resizable via Length set.', bool: 'Fixed at allocation.', hs: 'Sparse — items, not slots.' } },
            { aspect: 'Best for', cells: { ba: 'Dense flags, sieves.', bool: 'Small dense flag arrays.', hs: 'Sparse integer presence sets.' } },
        ],
    },

    related: [
        { slug: 'array' },
        { slug: 'hash-set' },
        { slug: 'list' },
    ],
};