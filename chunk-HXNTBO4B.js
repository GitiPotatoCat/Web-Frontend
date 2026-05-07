var t={slug:"list",name:"List<T>",namespace:"generic",metaDescription:"System.Collections.Generic.List<T> \u2014 array-backed resizable list, O(1) amortised append, O(n) middle insert. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Indexed"}],lead:"A growable array. Append is amortised O(1); random access by index is O(1); insert and remove anywhere except the end is O(n). The default ordered collection in C#, and the right answer for most read-heavy or append-heavy work.",metrics:[{label:"Add",value:"O(1) amortized",note:"doubles the backing array on overflow"},{label:"Index access",value:"O(1)",note:"direct offset into the backing array"},{label:"Insert / Remove at i",value:"O(n)",note:"shifts every element after i"}],whenToUse:"Reach for List<T> when you want an ordered, indexable collection and most of your work is appending or random-access reading. Avoid it when most operations are inserts or removes in the middle \u2014 LinkedList<T> is rarely faster, but a different structure (HashSet, Dictionary, Queue) often is.",callout:{variant:"warn",title:"Capacity vs Count",body:"Count is how many items you have; Capacity is how many fit before the next resize. If you know the size up front, set Capacity (or pass it to the constructor) \u2014 it avoids the doubling chain and the GC pressure that comes with it."},examples:[{caption:"Construct, populate, iterate",language:"csharp",source:`// Construct \u2014 empty, with capacity, or from any IEnumerable
List<int> nums = new();
List<int> sized = new(capacity: 1024);
List<int> seeded = new() { 1, 2, 3 };

// Append \u2014 amortised O(1)
nums.Add(42);
nums.AddRange([1, 2, 3, 4]);          // collection expression, C# 12+

// Index access \u2014 O(1)
int first = nums[0];

// Insert / Remove at position \u2014 O(n)
nums.Insert(0, 99);                    // shifts everything right
nums.RemoveAt(2);

// Iterate \u2014 foreach uses the struct enumerator, zero allocations
foreach (int n in nums)
    Console.WriteLine(n);

// Search \u2014 Contains is O(n); use HashSet<T> if you need fast membership
bool has42 = nums.Contains(42);

// Sort in place \u2014 O(n log n)
nums.Sort();`}],properties:[{name:"Count",type:"int",description:"Number of items currently in the list. Cheap; reads a backing field."},{name:"Capacity",type:"int",description:"Backing array length. Setting it explicitly avoids the doubling chain when the final size is known."},{name:"this[int index]",type:"T",description:"Indexer \u2014 O(1) read and write. Throws ArgumentOutOfRangeException for invalid indices."}],methods:[{name:"Add",signature:"Add(T item) \u2192 void",complexity:"O(1) amortized"},{name:"AddRange",signature:"AddRange(IEnumerable<T> items) \u2192 void",complexity:"O(k)"},{name:"Insert",signature:"Insert(int index, T item) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(T item) \u2192 bool",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(T item) \u2192 int",complexity:"O(n)"},{name:"Sort",signature:"Sort() \u2192 void",complexity:"O(n log n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"AsSpan",signature:"AsSpan() \u2192 Span<T>",complexity:"O(1)"}],comparison:{columns:[{id:"list",label:"List<T>",accent:"generic"},{id:"linked",label:"LinkedList<T>",accent:"generic"},{id:"array",label:"T[]",accent:"primitive"},{id:"arraylist",label:"ArrayList",accent:"legacy"}],rows:[{aspect:"Backing",cells:{list:"Resizing array.",linked:"Doubly-linked nodes.",array:"Fixed-size array.",arraylist:"Resizing array of object."}},{aspect:"Append",cells:{list:"O(1) amortised.",linked:"O(1).",array:"Not supported \u2014 fixed size.",arraylist:"O(1) amortised, plus boxing."}},{aspect:"Index access",cells:{list:"O(1).",linked:"O(n) \u2014 must traverse.",array:"O(1) \u2014 fastest available.",arraylist:"O(1) plus unbox cost."}},{aspect:"Type safety",cells:{list:"Generic \u2014 full.",linked:"Generic \u2014 full.",array:"Generic \u2014 full.",arraylist:"None \u2014 object."}},{aspect:"Best for",cells:{list:"The default ordered collection.",linked:"Frequent inserts at known nodes.",array:"Hot loops, fixed sizes, AsSpan() interop.",arraylist:"Compatibility only \u2014 never in new code."}}]},related:[{slug:"linked-list"},{slug:"array"},{slug:"array-list"},{slug:"hash-set"},{slug:"queue"}]};var a={slug:"dictionary",name:"Dictionary<K,V>",namespace:"generic",metaDescription:"System.Collections.Generic.Dictionary<TKey, TValue> \u2014 hash-backed associative array, O(1) average for Add, Lookup, Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Unordered"}],lead:"A hash table from keys to values. Add, lookup and remove are O(1) on average \u2014 the constants are small but the fixed cost per operation is higher than a List index access. The default associative collection in C#, and the right answer almost any time you need a key-to-value map.",metrics:[{label:"Add",value:"O(1)",note:"amortised \u2014 rehashes on load-factor overflow"},{label:"Lookup",value:"O(1)",note:"one hash, one bucket walk"},{label:"Remove",value:"O(1)",note:"unlinks from the bucket chain"}],whenToUse:"Reach for Dictionary<K,V> whenever you have keys and values, lookups dominate, and order does not matter. If you need ordered iteration, consider SortedDictionary; if you need thread-safety, ConcurrentDictionary; if you need an immutable snapshot, ImmutableDictionary.",callout:{variant:"note",title:"TryGetValue is the idiom",body:"Avoid the ContainsKey-then-index pattern \u2014 it hashes twice. TryGetValue performs the lookup once and returns whether the key existed in a single call. Same in CollectionsMarshal.GetValueRefOrNullRef when you need to mutate a value in place."},diagram:{caption:"How a key resolves",body:`  key \u2500\u2500hash\u2500\u2500\u25B6  bucket index \u2500\u2500\u25B6  bucket chain
                                          \u2502
                                          \u251C\u2500\u25B6 entry: key, value, next
                                          \u251C\u2500\u25B6 entry: key, value, next
                                          \u2514\u2500\u25B6 \u2205

  collisions land in the same bucket and chain forward.
  load factor too high \u2192 rehash to next prime size.`},examples:[{caption:"Construct, lookup, mutate",language:"csharp",source:`// Construct \u2014 empty, with capacity, with comparer, or seeded
Dictionary<string, int> ages = new();
Dictionary<string, int> sized = new(capacity: 1024);
Dictionary<string, int> caseInsensitive = new(StringComparer.OrdinalIgnoreCase);

// Add \u2014 throws if the key already exists
ages.Add("Ada", 36);

// Indexer \u2014 sets or overwrites; reads throw KeyNotFoundException on miss
ages["Ada"] = 37;

// TryGetValue \u2014 the idiomatic safe lookup
if (ages.TryGetValue("Ada", out int age))
    Console.WriteLine($"Ada is {age}");

// TryAdd \u2014 returns false if the key was already present (no throw)
if (ages.TryAdd("Linus", 54))
    Console.WriteLine("added");

// Iterate \u2014 KeyValuePair<K, V> by reference, no allocations
foreach ((string name, int years) in ages)
    Console.WriteLine($"{name}: {years}");

// Remove \u2014 returns whether anything was removed
ages.Remove("Ada");

// Bulk seed via collection expression (C# 12+)
Dictionary<string, int> seeded = new()
{
    ["x"] = 1,
    ["y"] = 2,
};`}],properties:[{name:"Count",type:"int",description:"Number of key-value pairs currently stored."},{name:"Keys",type:"KeyCollection",description:"Live view over the keys. Iterating it is allocation-free; not a snapshot \u2014 mutations to the dictionary are visible through it."},{name:"Values",type:"ValueCollection",description:"Live view over the values. Same allocation and snapshot semantics as Keys."},{name:"Comparer",type:"IEqualityComparer<TKey>",description:"The key comparer in use. Defaults to EqualityComparer<TKey>.Default; override at construction for case-insensitive or custom equality."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(1) average. Setting overwrites; reading throws KeyNotFoundException for missing keys."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 void",complexity:"O(1)"},{name:"TryAdd",signature:"TryAdd(TKey key, TValue value) \u2192 bool",complexity:"O(1)"},{name:"Remove",signature:"Remove(TKey key) \u2192 bool",complexity:"O(1)"},{name:"TryGetValue",signature:"TryGetValue(TKey, out TValue) \u2192 bool",complexity:"O(1)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(1)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"EnsureCapacity",signature:"EnsureCapacity(int capacity) \u2192 int",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"dict",label:"Dictionary<K,V>",accent:"generic"},{id:"sorted",label:"SortedDictionary<K,V>",accent:"generic"},{id:"concurrent",label:"ConcurrentDictionary",accent:"concurrent"},{id:"immutable",label:"ImmutableDictionary",accent:"immutable"},{id:"hashtable",label:"Hashtable",accent:"legacy"}],rows:[{aspect:"Backing",cells:{dict:"Hash table.",sorted:"Red-black tree.",concurrent:"Striped hash table.",immutable:"HAMT (hash array mapped trie).",hashtable:"Hash table of object."}},{aspect:"Add / Lookup",cells:{dict:"O(1) average.",sorted:"O(log n).",concurrent:"O(1) average, lock-free reads.",immutable:"O(log n) \u2014 returns a new map.",hashtable:"O(1) average plus boxing."}},{aspect:"Order",cells:{dict:"Insertion order on iteration.",sorted:"Sorted by key.",concurrent:"Unordered.",immutable:"Unordered.",hashtable:"Unordered."}},{aspect:"Thread safety",cells:{dict:"None.",sorted:"None.",concurrent:"Safe \u2014 designed for it.",immutable:"Safe \u2014 values cannot change.",hashtable:"Reads safe, writes need a lock."}},{aspect:"Best for",cells:{dict:"The default key-value map.",sorted:"Ordered iteration by key.",concurrent:"Multi-writer scenarios.",immutable:"Snapshot-style state.",hashtable:"Compatibility only."}}]},related:[{slug:"sorted-dictionary"},{slug:"hash-set"},{slug:"concurrent-dictionary"},{slug:"immutable-dictionary"},{slug:"hashtable"}]};var n={list:t,dictionary:a};function d(e){return n[e]}function r(){return Object.values(n)}function u(e){return r().filter(i=>i.namespace===e)}export{d as a,u as b};
