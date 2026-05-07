var a=[{id:"primitive",label:"Array \xB7 Span",fullName:"System",description:"Raw memory primitives \u2014 fixed arrays, stack-allocated slices, async-safe heap regions. The foundation everything else is built on.",iconPath:"assets/icons/ns-primitive.svg",cssVar:"--ns-primitive"},{id:"generic",label:"Generic",fullName:"System.Collections.Generic",description:"The everyday collections \u2014 List, Dictionary, HashSet, Stack, Queue, and friends. What you reach for nine times out of ten.",iconPath:"assets/icons/ns-generic.svg",cssVar:"--ns-generic"},{id:"legacy",label:"Legacy",fullName:"System.Collections",description:"Pre-generics collections kept for compatibility. ArrayList, Hashtable, BitArray. Documented for completeness; almost never the right choice today.",iconPath:"assets/icons/ns-legacy.svg",cssVar:"--ns-legacy"},{id:"concurrent",label:"Concurrent",fullName:"System.Collections.Concurrent",description:"Lock-free, thread-safe collections for multi-producer / multi-consumer code. ConcurrentDictionary, ConcurrentQueue, BlockingCollection.",iconPath:"assets/icons/ns-concurrent.svg",cssVar:"--ns-concurrent"},{id:"immutable",label:"Immutable",fullName:"System.Collections.Immutable",description:"Persistent collections with structural sharing \u2014 every modification returns a new instance, the old one stays valid. The functional toolbox.",iconPath:"assets/icons/ns-immutable.svg",cssVar:"--ns-immutable"}];function U(e){let t=a.find(K=>K.id===e);if(!t)throw new Error(`Unknown namespace id: ${e}`);return t}var n={slug:"array",name:"T[]",namespace:"primitive",metaDescription:"C# array (T[]) \u2014 fixed-size contiguous heap-allocated buffer, O(1) index access. The primitive every indexed collection is built on. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System"},{variant:"neutral",label:"Since C# 1.0"},{variant:"ok",label:"Generic via T[]"},{variant:"warn",label:"Fixed length"},{variant:"neutral",label:"Heap-allocated"},{variant:"ok",label:"Covariant for ref types"}],lead:"A fixed-size, contiguous block of T-typed slots, allocated on the managed heap. The simplest collection in the BCL and the building block for almost every other one. Index access is O(1); growing one means allocating a new array and copying \u2014 there is no resize.",metrics:[{label:"Index access",value:"O(1)",note:"single offset into the contiguous buffer"},{label:"Linear search",value:"O(n)",note:"Array.IndexOf walks until a match"},{label:"Sort",value:"O(n log n)",note:"Array.Sort uses introspective sort"}],whenToUse:"Reach for a raw array when the size is known up front, when you need the absolute fastest possible indexed access, or when you are interoperating with code (Span, P/Invoke, AsSpan) that expects contiguous memory. Otherwise prefer List<T> \u2014 it owns an array internally and saves you the resize ceremony.",callout:{variant:"note",title:"Covariance is real and surprising",body:"Reference-type arrays are covariant: a string[] is assignable to an object[]. That sounds convenient until you write a Cat into a Dog[] cast as Animal[] and get an ArrayTypeMismatchException at runtime. Generic collections (List<T>) deliberately broke this \u2014 and were right to."},diagram:{caption:"Memory layout",body:`  T[] arr = new T[5];

  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
  \u2502  arr[0]  \u2502  arr[1]  \u2502  arr[2]  \u2502  arr[3]  \u2502  arr[4]  \u2502
  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
       \u25B2
       \u2502  one heap allocation, contiguous slots
       \u2502  Length is part of the object header

  arr[2]  \u2192  base + 2 * sizeof(T)   \u2190 this is why index access is O(1)`},examples:[{caption:"Construct, fill, slice, search",language:"csharp",source:`// Construct \u2014 fixed length set at allocation
int[] nums = new int[5];                           // all zero
int[] seeded = new[] { 1, 2, 3, 4, 5 };
int[] zeros = new int[1024];

// Multidimensional vs jagged
int[,] grid = new int[4, 4];                       // single allocation, 16 ints
int[][] jagged = new int[4][];                     // 4 allocations, each its own length
jagged[0] = new int[3];

// Index access \u2014 O(1)
int third = seeded[2];                             // 3
seeded[0] = 99;

// Length \u2014 read from object header
int n = seeded.Length;

// Iterate \u2014 foreach uses the array's struct enumerator
foreach (int x in seeded)
    Console.WriteLine(x);

// Search \u2014 IndexOf is O(n)
int i = Array.IndexOf(seeded, 3);                  // 2

// Sort in place \u2014 O(n log n) introspective sort
Array.Sort(seeded);

// Span over the array \u2014 zero-cost view, no copy
Span<int> view = seeded.AsSpan();
Span<int> middle = seeded.AsSpan(1, 3);            // start=1, length=3

// Resize is a copy \u2014 there is no in-place grow
Array.Resize(ref seeded, 10);                      // allocates a new array

// Clear \u2014 sets every element to default(T)
Array.Clear(seeded);`}],properties:[{name:"Length",type:"int",description:"Total number of elements. Read from the object header \u2014 a single dereference, the cheapest property in the BCL."},{name:"Rank",type:"int",description:"Number of dimensions. 1 for T[], 2 for T[,], 3 for T[,,], and so on."},{name:"this[int index]",type:"T",description:"Indexer \u2014 O(1). Bounds-checked; throws IndexOutOfRangeException for invalid indices (the JIT elides the check inside trusted loops)."}],methods:[{name:"AsSpan",signature:"AsSpan() \u2192 Span<T>",complexity:"O(1)"},{name:"AsSpan",signature:"AsSpan(int start, int length) \u2192 Span<T>",complexity:"O(1)"},{name:"CopyTo",signature:"CopyTo(T[] destination, int index) \u2192 void",complexity:"O(n)"},{name:"Clone",signature:"Clone() \u2192 object",complexity:"O(n)"},{name:"Array.Sort",signature:"Array.Sort<T>(T[] array) \u2192 void",complexity:"O(n log n)"},{name:"Array.IndexOf",signature:"Array.IndexOf<T>(T[] array, T value) \u2192 int",complexity:"O(n)"},{name:"Array.BinarySearch",signature:"Array.BinarySearch<T>(T[] array, T value) \u2192 int",complexity:"O(log n)"},{name:"Array.Resize",signature:"Array.Resize<T>(ref T[] array, int newSize) \u2192 void",complexity:"O(n)"},{name:"Array.Clear",signature:"Array.Clear(Array array) \u2192 void",complexity:"O(n)"},{name:"Array.Reverse",signature:"Array.Reverse<T>(T[] array) \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"array",label:"T[]",accent:"primitive"},{id:"list",label:"List<T>",accent:"generic"},{id:"span",label:"Span<T>",accent:"primitive"},{id:"mem",label:"Memory<T>",accent:"primitive"}],rows:[{aspect:"Backing",cells:{array:"Itself \u2014 a heap allocation.",list:"A T[] it owns and resizes.",span:"A reference into existing memory.",mem:"A heap-storable handle to existing memory."}},{aspect:"Lifetime",cells:{array:"GC-managed; lives until unreachable.",list:"Owns its array; same as the list.",span:"Stack-only \u2014 cannot escape the method.",mem:"Heap-storable \u2014 can live in fields, async state."}},{aspect:"Length",cells:{array:"Fixed at allocation.",list:"Grows on demand.",span:"Bound by the slice you took.",mem:"Bound by the slice you took."}},{aspect:"Resize",cells:{array:"Allocate + copy via Array.Resize.",list:"Built in \u2014 Add doubles the buffer.",span:"Not supported.",mem:"Not supported."}},{aspect:"Best for",cells:{array:"Hot loops, fixed sizes, interop.",list:"The default ordered collection.",span:"Stack-allocated slicing in synchronous code.",mem:"Buffers crossed across async / heap boundaries."}}]},related:[{slug:"list"},{slug:"span"},{slug:"memory"},{slug:"array-list"},{slug:"bit-array"}]};var r={slug:"span",name:"Span<T>",namespace:"primitive",metaDescription:"System.Span<T> \u2014 stack-only view over contiguous memory. Zero allocations, O(1) slicing, compile-time-enforced lifetime safety. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System"},{variant:"neutral",label:"Since .NET Core 2.1"},{variant:"ok",label:"Allocation-free"},{variant:"ok",label:"O(1) slicing"},{variant:"warn",label:"Stack-only (ref struct)"},{variant:"neutral",label:"Generic"}],lead:"A stack-allocated handle to a contiguous range of memory. It might point at a managed array, at stack-allocated bytes, at an unmanaged buffer \u2014 Span erases the difference. Slicing is free, bounds are checked, and the compiler refuses to let it escape its method, so it is impossible to dangle.",metrics:[{label:"Index access",value:"O(1)",note:"one offset into the underlying memory"},{label:"Slice",value:"O(1)",note:"returns a new Span \u2014 no copy"},{label:"Allocation cost",value:"O(1)",note:"lives on the stack \u2014 zero GC"}],whenToUse:"Reach for Span<T> when you need to operate on a section of a buffer \u2014 string parsing, binary protocol decoding, in-place numeric work \u2014 without paying for substring or array copies. Avoid it whenever your code is async, captures into a closure, or stores it in a field: Span cannot live across an await, and the compiler will tell you so.",callout:{variant:"highlight",title:'The "ref struct" rule is the safety',body:"Span<T> is a ref struct, which means it can never be boxed, captured by a lambda, stored in a field, or live across an await. Those restrictions are exactly what makes Span safe \u2014 there is no way to keep one around longer than the memory it points at. If you need any of those things, use Memory<T> instead."},examples:[{caption:"Slice without allocating",language:"csharp",source:`// From an array \u2014 zero copy
int[] nums = { 1, 2, 3, 4, 5, 6, 7 };
Span<int> all = nums;                              // implicit conversion
Span<int> middle = nums.AsSpan(2, 3);              // [3, 4, 5] \u2014 no allocation

// From the stack with stackalloc \u2014 also zero allocation
Span<byte> buffer = stackalloc byte[256];
buffer[0] = 0xFF;

// From a string \u2014 readonly, zero copy
ReadOnlySpan<char> word = "hello world".AsSpan(0, 5);   // "hello"

// Slice the slice \u2014 still no allocation
Span<int> tail = middle[1..];                      // C# range syntax
ReadOnlySpan<char> first = word[..3];              // "hel"

// Iterate \u2014 same foreach, same struct enumerator, no boxing
foreach (int n in middle)
    Console.WriteLine(n);

// Mutate in place \u2014 writes are visible in the underlying array
middle[0] = 99;
Console.WriteLine(nums[2]);                         // 99

// Pass to a method that takes Span<T> \u2014 no allocation crosses the boundary
int sum = SumOf(nums.AsSpan(1, 5));

static int SumOf(ReadOnlySpan<int> s)
{
    int total = 0;
    foreach (int x in s) total += x;
    return total;
}

// You CANNOT do this \u2014 the compiler will refuse:
//
//   async Task<int> Bad() => SumOf(stackalloc int[4]);
//   ^^^^^                    ^^^^^^^^^^^^^^^^^^^^^
//   async + ref struct = compile-time error.`}],properties:[{name:"Length",type:"int",description:"Number of elements visible through this span."},{name:"IsEmpty",type:"bool",description:"True when Length is 0."},{name:"this[int index]",type:"ref T",description:"Indexer that returns a ref \u2014 assignments mutate the underlying memory directly. Bounds-checked."},{name:"this[Range range]",type:"Span<T>",description:"Range indexer \u2014 span[1..^1] returns a sub-span. O(1), no allocation."}],methods:[{name:"Slice",signature:"Slice(int start) \u2192 Span<T>",complexity:"O(1)"},{name:"Slice",signature:"Slice(int start, int length) \u2192 Span<T>",complexity:"O(1)"},{name:"CopyTo",signature:"CopyTo(Span<T> destination) \u2192 void",complexity:"O(n)"},{name:"TryCopyTo",signature:"TryCopyTo(Span<T> destination) \u2192 bool",complexity:"O(n)"},{name:"Fill",signature:"Fill(T value) \u2192 void",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"Reverse",signature:"Reverse() \u2192 void",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(T value) \u2192 int",complexity:"O(n)"},{name:"BinarySearch",signature:"BinarySearch(T value) \u2192 int",complexity:"O(log n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"GetEnumerator",signature:"GetEnumerator() \u2192 Enumerator",complexity:"O(1)"}],comparison:{columns:[{id:"span",label:"Span<T>",accent:"primitive"},{id:"rspan",label:"ReadOnlySpan<T>",accent:"primitive"},{id:"mem",label:"Memory<T>",accent:"primitive"},{id:"array",label:"T[]",accent:"primitive"}],rows:[{aspect:"Lives on",cells:{span:"Stack only.",rspan:"Stack only.",mem:"Anywhere \u2014 heap-storable.",array:"Heap (the array), reference variable on stack."}},{aspect:"Async-safe",cells:{span:"No \u2014 cannot cross await.",rspan:"No \u2014 cannot cross await.",mem:"Yes.",array:"Yes."}},{aspect:"Mutability",cells:{span:"Read-write.",rspan:"Read-only \u2014 write attempts are compile errors.",mem:"Both \u2014 Memory<T> and ReadOnlyMemory<T>.",array:"Read-write."}},{aspect:"Allocation",cells:{span:"Zero \u2014 pure stack value.",rspan:"Zero \u2014 pure stack value.",mem:"One small struct on the heap when needed.",array:"Heap allocation per array."}},{aspect:"Best for",cells:{span:"Hot synchronous loops, parsing, in-place edits.",rspan:"Reading slices of strings or buffers.",mem:"Async pipelines that pass buffers around.",array:"When you actually need to own the storage."}}]},related:[{slug:"memory"},{slug:"array"},{slug:"list"}]};var o={slug:"memory",name:"Memory<T>",namespace:"primitive",metaDescription:"System.Memory<T> \u2014 heap-storable handle to contiguous memory, async-safe alternative to Span<T>. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System"},{variant:"neutral",label:"Since .NET Core 2.1"},{variant:"ok",label:"Async-safe"},{variant:"ok",label:"Heap-storable"},{variant:"neutral",label:"Generic"},{variant:"warn",label:"Indirection vs Span"}],lead:"A struct that holds the same kind of reference Span<T> does, without the ref-struct restrictions. You can put it in a field, pass it across an await, capture it in a lambda. When you need to operate on the data, you ask for its Span. This is the type async pipelines use to move buffers around without copying.",metrics:[{label:".Span access",value:"O(1)",note:"returns a Span over the same memory"},{label:"Slice",value:"O(1)",note:"returns a new Memory \u2014 no copy"},{label:"Allocation cost",value:"O(1)",note:"small struct; pinning may add a handle"}],whenToUse:"Reach for Memory<T> when buffers need to cross async boundaries \u2014 reading from a Stream into a buffer, passing a window of data through a pipeline of async transformers, holding a region in a field of a long-lived object. Use Span<T> instead inside any synchronous hot loop where the buffer never needs to outlive the method.",callout:{variant:"note",title:".Span is the bridge",body:"Memory<T>.Span gives you a Span over the same memory. The Span is stack-only as always, so you call .Span at the moment you actually want to operate on the data and use the resulting Span synchronously. The Memory itself is what travels across awaits \u2014 it is the heap-storable handle, the Span is the working view."},diagram:{caption:"Memory and Span",body:`  Memory<byte> mem = buffer;                \u2190 can live in a field, cross await

      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502  Memory<byte>          \u2502   small heap-storable struct
      \u2502  \u2193 holds reference to \u2193\u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                  \u2502
                  \u25BC
      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502   the actual contiguous T-typed memory  \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                  \u25B2
                  \u2502 .Span gives you a stack-only view
                  \u2502
      Span<byte> view = mem.Span;           \u2190 use synchronously, then drop`},examples:[{caption:"Async-friendly buffer use",language:"csharp",source:`// From an array \u2014 zero copy
byte[] buffer = new byte[1024];
Memory<byte> mem = buffer;
ReadOnlyMemory<char> hello = "hello".AsMemory();

// Slice \u2014 still zero copy
Memory<byte> head = mem[..512];
Memory<byte> tail = mem.Slice(512, 256);

// Cross an await with Memory \u2014 Span couldn't do this
async Task<int> ReadFirstChunkAsync(Stream s, Memory<byte> destination)
{
    int read = await s.ReadAsync(destination);
    return read;
}

// At the moment you operate on the bytes, ask for the Span
async Task ProcessAsync(Memory<byte> region)
{
    int read = await ReadFirstChunkAsync(stream, region);

    // Synchronous block \u2014 Span is fine here
    Span<byte> view = region.Span[..read];
    for (int i = 0; i < view.Length; i++)
        view[i] ^= 0xFF;
}

// Pinning when handing memory to native code
using (MemoryHandle handle = mem.Pin())
{
    unsafe
    {
        byte* p = (byte*)handle.Pointer;
        // call into native code \u2014 memory will not move
    }
}`}],properties:[{name:"Length",type:"int",description:"Number of elements this Memory points at."},{name:"IsEmpty",type:"bool",description:"True when Length is 0."},{name:"Span",type:"Span<T>",description:"A Span over the same memory. Use it for the synchronous part of your work; do not store it in a field."}],methods:[{name:"Slice",signature:"Slice(int start) \u2192 Memory<T>",complexity:"O(1)"},{name:"Slice",signature:"Slice(int start, int length) \u2192 Memory<T>",complexity:"O(1)"},{name:"CopyTo",signature:"CopyTo(Memory<T> destination) \u2192 void",complexity:"O(n)"},{name:"TryCopyTo",signature:"TryCopyTo(Memory<T> destination) \u2192 bool",complexity:"O(n)"},{name:"Pin",signature:"Pin() \u2192 MemoryHandle",complexity:"O(1)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"}],comparison:{columns:[{id:"mem",label:"Memory<T>",accent:"primitive"},{id:"rmem",label:"ReadOnlyMemory<T>",accent:"primitive"},{id:"span",label:"Span<T>",accent:"primitive"},{id:"array",label:"T[]",accent:"primitive"}],rows:[{aspect:"Lives on",cells:{mem:"Anywhere \u2014 fields, async state, captures.",rmem:"Anywhere \u2014 same as Memory<T>.",span:"Stack only.",array:"Heap (the array itself)."}},{aspect:"Async-safe",cells:{mem:"Yes.",rmem:"Yes.",span:"No.",array:"Yes."}},{aspect:"Mutability",cells:{mem:"Read-write.",rmem:"Read-only.",span:"Mirror \u2014 Span<T> read-write, ReadOnlySpan<T> read-only.",array:"Read-write."}},{aspect:"Direct access",cells:{mem:"Through the .Span property.",rmem:"Through the .Span property.",span:"Direct \u2014 Span IS the access.",array:"Direct \u2014 array IS the access."}},{aspect:"Best for",cells:{mem:"Async pipelines, fields holding buffers.",rmem:"Async pipelines that read but never write.",span:"Hot synchronous loops; parsing.",array:"When you own the storage."}}]},related:[{slug:"span"},{slug:"array"},{slug:"list"}]};var i={slug:"list",name:"List<T>",namespace:"generic",metaDescription:"System.Collections.Generic.List<T> \u2014 array-backed resizable list, O(1) amortised append, O(n) middle insert. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Indexed"}],lead:"A growable array. Append is amortised O(1); random access by index is O(1); insert and remove anywhere except the end is O(n). The default ordered collection in C#, and the right answer for most read-heavy or append-heavy work.",metrics:[{label:"Add",value:"O(1) amortized",note:"doubles the backing array on overflow"},{label:"Index access",value:"O(1)",note:"direct offset into the backing array"},{label:"Insert / Remove at i",value:"O(n)",note:"shifts every element after i"}],whenToUse:"Reach for List<T> when you want an ordered, indexable collection and most of your work is appending or random-access reading. Avoid it when most operations are inserts or removes in the middle \u2014 LinkedList<T> is rarely faster, but a different structure (HashSet, Dictionary, Queue) often is.",callout:{variant:"warn",title:"Capacity vs Count",body:"Count is how many items you have; Capacity is how many fit before the next resize. If you know the size up front, set Capacity (or pass it to the constructor) \u2014 it avoids the doubling chain and the GC pressure that comes with it."},examples:[{caption:"Construct, populate, iterate",language:"csharp",source:`// Construct \u2014 empty, with capacity, or from any IEnumerable
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
nums.Sort();`}],properties:[{name:"Count",type:"int",description:"Number of items currently in the list. Cheap; reads a backing field."},{name:"Capacity",type:"int",description:"Backing array length. Setting it explicitly avoids the doubling chain when the final size is known."},{name:"this[int index]",type:"T",description:"Indexer \u2014 O(1) read and write. Throws ArgumentOutOfRangeException for invalid indices."}],methods:[{name:"Add",signature:"Add(T item) \u2192 void",complexity:"O(1) amortized"},{name:"AddRange",signature:"AddRange(IEnumerable<T> items) \u2192 void",complexity:"O(k)"},{name:"Insert",signature:"Insert(int index, T item) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(T item) \u2192 bool",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(T item) \u2192 int",complexity:"O(n)"},{name:"Sort",signature:"Sort() \u2192 void",complexity:"O(n log n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"AsSpan",signature:"AsSpan() \u2192 Span<T>",complexity:"O(1)"}],comparison:{columns:[{id:"list",label:"List<T>",accent:"generic"},{id:"linked",label:"LinkedList<T>",accent:"generic"},{id:"array",label:"T[]",accent:"primitive"},{id:"arraylist",label:"ArrayList",accent:"legacy"}],rows:[{aspect:"Backing",cells:{list:"Resizing array.",linked:"Doubly-linked nodes.",array:"Fixed-size array.",arraylist:"Resizing array of object."}},{aspect:"Append",cells:{list:"O(1) amortised.",linked:"O(1).",array:"Not supported \u2014 fixed size.",arraylist:"O(1) amortised, plus boxing."}},{aspect:"Index access",cells:{list:"O(1).",linked:"O(n) \u2014 must traverse.",array:"O(1) \u2014 fastest available.",arraylist:"O(1) plus unbox cost."}},{aspect:"Type safety",cells:{list:"Generic \u2014 full.",linked:"Generic \u2014 full.",array:"Generic \u2014 full.",arraylist:"None \u2014 object."}},{aspect:"Best for",cells:{list:"The default ordered collection.",linked:"Frequent inserts at known nodes.",array:"Hot loops, fixed sizes, AsSpan() interop.",arraylist:"Compatibility only \u2014 never in new code."}}]},related:[{slug:"linked-list"},{slug:"array"},{slug:"array-list"},{slug:"hash-set"},{slug:"queue"}]};var s={slug:"linked-list",name:"LinkedList<T>",namespace:"generic",metaDescription:"System.Collections.Generic.LinkedList<T> \u2014 doubly-linked list with O(1) insert and remove at known nodes. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"warn",label:"Per-node allocation"},{variant:"neutral",label:"Doubly-linked"}],lead:"A doubly-linked list of LinkedListNode<T>. Each node holds a value plus pointers to its neighbours. Inserts and removes at a known node are O(1); finding a node by value is O(n). Almost always slower than List<T> in practice \u2014 the per-node allocation and pointer-chasing dominate, even when the asymptotic story favours it.",metrics:[{label:"AddFirst / AddLast",value:"O(1)",note:"updates two pointers"},{label:"AddBefore / AddAfter",value:"O(1)",note:"when you have the node"},{label:"Find",value:"O(n)",note:"walks from the head"}],whenToUse:'Reach for LinkedList<T> only when you genuinely insert and remove at known node positions and your profiler tells you List<T> is the bottleneck. The textbook "linked lists are good for inserts" answer is rarely the right one \u2014 modern CPUs love contiguous memory, and List<T> usually wins on real workloads.',callout:{variant:"warn",title:"Cache locality matters more than asymptotics",body:"Every node in a LinkedList<T> is a separate heap allocation. Walking the list means following pointers to scattered addresses, which CPUs are bad at. List<T> stores its items in one contiguous buffer that prefetchers can predict. Unless your insert/remove rate is extreme, List<T> wins."},examples:[{caption:"Construct, walk, splice",language:"csharp",source:`// Construct
LinkedList<int> chain = new();
LinkedList<int> seeded = new(new[] { 1, 2, 3 });

// Add at ends \u2014 O(1), returns the new node
LinkedListNode<int> tail = chain.AddLast(99);
LinkedListNode<int> head = chain.AddFirst(0);

// Insert relative to a known node \u2014 O(1)
chain.AddAfter(head, 1);
chain.AddBefore(tail, 98);

// Find \u2014 O(n)
LinkedListNode<int>? node = chain.Find(1);

// Remove by node \u2014 O(1)
if (node is not null)
    chain.Remove(node);

// Walk forward / backward
for (var n = chain.First; n != null; n = n.Next)
    Console.WriteLine(n.Value);

for (var n = chain.Last; n != null; n = n.Previous)
    Console.WriteLine(n.Value);

// foreach \u2014 same struct enumerator pattern
foreach (int v in chain)
    Console.WriteLine(v);`}],properties:[{name:"Count",type:"int",description:"Items currently in the list. Tracked, not computed."},{name:"First",type:"LinkedListNode<T>?",description:"Head node, or null when empty."},{name:"Last",type:"LinkedListNode<T>?",description:"Tail node, or null when empty."}],methods:[{name:"AddFirst",signature:"AddFirst(T value) \u2192 LinkedListNode<T>",complexity:"O(1)"},{name:"AddLast",signature:"AddLast(T value) \u2192 LinkedListNode<T>",complexity:"O(1)"},{name:"AddBefore",signature:"AddBefore(LinkedListNode<T> node, T value) \u2192 LinkedListNode<T>",complexity:"O(1)"},{name:"AddAfter",signature:"AddAfter(LinkedListNode<T> node, T value) \u2192 LinkedListNode<T>",complexity:"O(1)"},{name:"Remove",signature:"Remove(LinkedListNode<T> node) \u2192 void",complexity:"O(1)"},{name:"Remove",signature:"Remove(T value) \u2192 bool",complexity:"O(n)"},{name:"RemoveFirst",signature:"RemoveFirst() \u2192 void",complexity:"O(1)"},{name:"RemoveLast",signature:"RemoveLast() \u2192 void",complexity:"O(1)"},{name:"Find",signature:"Find(T value) \u2192 LinkedListNode<T>?",complexity:"O(n)"},{name:"FindLast",signature:"FindLast(T value) \u2192 LinkedListNode<T>?",complexity:"O(n)"},{name:"Contains",signature:"Contains(T value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"linked",label:"LinkedList<T>",accent:"generic"},{id:"list",label:"List<T>",accent:"generic"},{id:"queue",label:"Queue<T>",accent:"generic"},{id:"stack",label:"Stack<T>",accent:"generic"}],rows:[{aspect:"Backing",cells:{linked:"Doubly-linked nodes.",list:"Resizing array.",queue:"Circular array.",stack:"Resizing array."}},{aspect:"Insert at ends",cells:{linked:"O(1).",list:"O(1) amortised at end.",queue:"O(1) Enqueue.",stack:"O(1) Push."}},{aspect:"Insert at middle",cells:{linked:"O(1) at known node.",list:"O(n).",queue:"Not supported.",stack:"Not supported."}},{aspect:"Memory layout",cells:{linked:"Scattered nodes.",list:"Contiguous.",queue:"Contiguous.",stack:"Contiguous."}},{aspect:"Best for",cells:{linked:"Profiled middle inserts.",list:"The default ordered collection.",queue:"FIFO work queues.",stack:"LIFO work queues."}}]},related:[{slug:"list"},{slug:"queue"},{slug:"stack"},{slug:"array"}]};var l={slug:"stack",name:"Stack<T>",namespace:"generic",metaDescription:"System.Collections.Generic.Stack<T> \u2014 array-backed LIFO stack. O(1) Push, Pop, Peek. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"LIFO"}],lead:"A last-in-first-out stack backed by a resizing array. Push adds to the top, Pop removes from the top, Peek inspects without removing \u2014 all O(1) amortised. The default stack implementation in C#; reach for ConcurrentStack<T> only when you have multiple writers.",metrics:[{label:"Push",value:"O(1) amortized",note:"doubles when full"},{label:"Pop",value:"O(1)",note:"returns and removes the top"},{label:"Peek",value:"O(1)",note:"reads the top in place"}],whenToUse:"Reach for Stack<T> whenever the LIFO shape matches the problem \u2014 recursive descent without recursion, undo stacks within a single thread, depth-first traversal. For multi-writer LIFO use ConcurrentStack<T>; for snapshot semantics use ImmutableStack<T>.",callout:{variant:"note",title:"TryPop and TryPeek are the safe forms",body:"Pop() and Peek() throw InvalidOperationException on an empty stack. TryPop and TryPeek return false instead \u2014 the idiomatic shape in modern C# code, especially in tight loops where the empty case is reachable."},examples:[{caption:"LIFO basics",language:"csharp",source:`// Construct
Stack<string> scopes = new();
Stack<int>    counts = new(new[] { 1, 2, 3 });    // top will be 3

// Push \u2014 O(1) amortised
scopes.Push("module");
scopes.Push("class");
scopes.Push("method");

// Peek \u2014 read the top without removing
string current = scopes.Peek();                    // "method"

// Pop \u2014 read and remove
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

void Process(string s) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Items in the stack. Cheap; tracked."}],methods:[{name:"Push",signature:"Push(T item) \u2192 void",complexity:"O(1) amortized"},{name:"Pop",signature:"Pop() \u2192 T",complexity:"O(1)"},{name:"TryPop",signature:"TryPop(out T result) \u2192 bool",complexity:"O(1)"},{name:"Peek",signature:"Peek() \u2192 T",complexity:"O(1)"},{name:"TryPeek",signature:"TryPeek(out T result) \u2192 bool",complexity:"O(1)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"stack",label:"Stack<T>",accent:"generic"},{id:"cstack",label:"ConcurrentStack<T>",accent:"concurrent"},{id:"istack",label:"ImmutableStack<T>",accent:"immutable"},{id:"lstack",label:"Stack (legacy)",accent:"legacy"}],rows:[{aspect:"Backing",cells:{stack:"Resizing array.",cstack:"Linked list with CAS.",istack:"Cons list.",lstack:"Resizing array of object."}},{aspect:"Push / Pop",cells:{stack:"O(1) amortised.",cstack:"O(1) lock-free.",istack:"O(1) \u2014 returns new.",lstack:"O(1) plus boxing."}},{aspect:"Thread-safe",cells:{stack:"No.",cstack:"Yes.",istack:"Yes \u2014 immutable.",lstack:"No."}},{aspect:"Type safety",cells:{stack:"Generic.",cstack:"Generic.",istack:"Generic.",lstack:"object \u2014 boxes value types."}},{aspect:"Best for",cells:{stack:"The default LIFO.",cstack:"Multi-writer LIFO.",istack:"Snapshot histories.",lstack:"Compatibility only."}}]},related:[{slug:"queue"},{slug:"concurrent-stack"},{slug:"immutable-stack"},{slug:"legacy-stack"},{slug:"list"}]};var c={slug:"queue",name:"Queue<T>",namespace:"generic",metaDescription:"System.Collections.Generic.Queue<T> \u2014 circular-array FIFO queue. O(1) Enqueue, Dequeue, Peek. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"FIFO"}],lead:"A first-in-first-out queue backed by a circular array. Enqueue appends to the tail; Dequeue removes from the head; both are O(1) amortised. The default in-process queue in C#; reach for ConcurrentQueue<T> across threads or BlockingCollection<T> for producer-consumer patterns.",metrics:[{label:"Enqueue",value:"O(1) amortized",note:"doubles when full"},{label:"Dequeue",value:"O(1)",note:"advances the head pointer"},{label:"Peek",value:"O(1)",note:"reads the head in place"}],whenToUse:"Reach for Queue<T> whenever you process work in arrival order on a single thread \u2014 breadth-first traversal, level-order tree walks, simple buffered work pipelines. Cross threads and you want ConcurrentQueue or BlockingCollection; need backpressure and you want Channels.",callout:{variant:"note",title:"Circular array, not a linked list",body:"Queue<T> uses a circular buffer with head and tail indices that wrap. There is no per-element allocation; growth is the same doubling-and-copy strategy as List<T>. Pointer-chasing intuitions from textbook FIFO implementations don\u2019t apply here."},examples:[{caption:"FIFO basics",language:"csharp",source:`// Construct
Queue<string> jobs = new();
Queue<int>    seeded = new(new[] { 1, 2, 3 });

// Enqueue \u2014 O(1) amortised
jobs.Enqueue("first");
jobs.Enqueue("second");
jobs.Enqueue("third");

// Peek \u2014 read head without removing
string next = jobs.Peek();                         // "first"

// Dequeue \u2014 read and remove
string head = jobs.Dequeue();                      // "first"

// Try-form: returns false on empty rather than throwing
if (jobs.TryDequeue(out string? job))
    Process(job);

if (jobs.TryPeek(out string? top))
    Console.WriteLine(top);

// Iterate head-to-tail
foreach (string j in jobs)
    Console.WriteLine(j);

// Drain pattern
while (jobs.Count > 0)
    Process(jobs.Dequeue());

void Process(string s) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Items currently in the queue."}],methods:[{name:"Enqueue",signature:"Enqueue(T item) \u2192 void",complexity:"O(1) amortized"},{name:"Dequeue",signature:"Dequeue() \u2192 T",complexity:"O(1)"},{name:"TryDequeue",signature:"TryDequeue(out T result) \u2192 bool",complexity:"O(1)"},{name:"Peek",signature:"Peek() \u2192 T",complexity:"O(1)"},{name:"TryPeek",signature:"TryPeek(out T result) \u2192 bool",complexity:"O(1)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"queue",label:"Queue<T>",accent:"generic"},{id:"cqueue",label:"ConcurrentQueue<T>",accent:"concurrent"},{id:"iqueue",label:"ImmutableQueue<T>",accent:"immutable"},{id:"block",label:"BlockingCollection<T>",accent:"concurrent"}],rows:[{aspect:"Backing",cells:{queue:"Circular array.",cqueue:"Linked segment chain.",iqueue:"Two immutable stacks.",block:"Wraps any IProducerConsumerCollection."}},{aspect:"Enqueue",cells:{queue:"O(1) amortised.",cqueue:"O(1) lock-free.",iqueue:"O(1) \u2014 returns new.",block:"Blocks when bounded."}},{aspect:"Dequeue",cells:{queue:"O(1).",cqueue:"O(1) lock-free.",iqueue:"O(1) amortised.",block:"Blocks when empty."}},{aspect:"Thread-safe",cells:{queue:"No.",cqueue:"Yes.",iqueue:"Yes \u2014 immutable.",block:"Yes \u2014 by design."}},{aspect:"Best for",cells:{queue:"Single-threaded FIFO.",cqueue:"Multi-writer FIFO.",iqueue:"Snapshot event sourcing.",block:"Producer-consumer with backpressure."}}]},related:[{slug:"stack"},{slug:"priority-queue"},{slug:"concurrent-queue"},{slug:"immutable-queue"},{slug:"blocking-collection"}]};var u={slug:"priority-queue",name:"PriorityQueue<TElement, TPriority>",namespace:"generic",metaDescription:"System.Collections.Generic.PriorityQueue<TElement, TPriority> \u2014 array-backed binary heap. O(log n) Enqueue and Dequeue, O(1) Peek. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 6"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"warn",label:"Not stable"},{variant:"neutral",label:"Min-heap"}],lead:"A min-heap of (element, priority) pairs backed by a single resizing array. Enqueue inserts and bubbles up; Dequeue removes the lowest-priority item and sifts down \u2014 both O(log n). Peek is O(1). The default in-process priority queue, finally part of the BCL since .NET 6.",metrics:[{label:"Enqueue",value:"O(log n)",note:"sift-up after array append"},{label:"Dequeue",value:"O(log n)",note:"sift-down after head swap"},{label:"Peek",value:"O(1)",note:"reads index 0"}],whenToUse:"Reach for PriorityQueue when the next item to process is determined by a priority score \u2014 a scheduler, an event simulator, A* pathfinding, top-k streaming. If you need ordering by key without priority semantics, SortedDictionary or SortedSet is closer to what you want.",callout:{variant:"warn",title:"Not stable, no key update",body:'Two items with equal priority can come out in either order \u2014 there is no insertion-order tiebreaker. There is also no built-in "decrease key" operation; if you need to change a queued item\u2019s priority, the typical pattern is to enqueue a new (item, newPriority) pair and skip stale entries on dequeue.'},examples:[{caption:"Min-heap by priority",language:"csharp",source:`// Construct \u2014 defaults to a min-heap by Comparer<TPriority>.Default
PriorityQueue<string, int> jobs = new();

// Enqueue (item, priority) \u2014 lower priority comes out first
jobs.Enqueue("send-mail",  3);
jobs.Enqueue("backup",     1);
jobs.Enqueue("warm-cache", 2);

// Peek \u2014 head only, no removal
string head = jobs.Peek();                         // "backup"

// Dequeue \u2014 head with both forms
string next = jobs.Dequeue();                      // "backup"
if (jobs.TryDequeue(out string? job, out int prio))
    Console.WriteLine($"{job} @ {prio}");

// EnqueueDequeue \u2014 useful for top-k streaming
string evicted = jobs.EnqueueDequeue("incoming", 0);

// Custom max-heap via a reversed comparer
PriorityQueue<string, int> maxJobs =
    new(Comparer<int>.Create((a, b) => b.CompareTo(a)));

// Bulk enqueue from an enumerable of pairs
PriorityQueue<string, int> bulk = new();
bulk.EnqueueRange(new (string, int)[]
{
    ("a", 5), ("b", 2), ("c", 9),
});`}],properties:[{name:"Count",type:"int",description:"Items currently in the queue."},{name:"Comparer",type:"IComparer<TPriority>",description:"Priority comparer in use; defaults to Comparer<TPriority>.Default."},{name:"UnorderedItems",type:"UnorderedItemsCollection",description:"Live view over (element, priority) pairs in heap order \u2014 useful for diagnostics, never for processing."}],methods:[{name:"Enqueue",signature:"Enqueue(TElement element, TPriority priority) \u2192 void",complexity:"O(log n)"},{name:"EnqueueRange",signature:"EnqueueRange(IEnumerable<(TElement, TPriority)> items) \u2192 void",complexity:"O(k log n)"},{name:"EnqueueDequeue",signature:"EnqueueDequeue(TElement element, TPriority priority) \u2192 TElement",complexity:"O(log n)"},{name:"Dequeue",signature:"Dequeue() \u2192 TElement",complexity:"O(log n)"},{name:"TryDequeue",signature:"TryDequeue(out TElement element, out TPriority priority) \u2192 bool",complexity:"O(log n)"},{name:"Peek",signature:"Peek() \u2192 TElement",complexity:"O(1)"},{name:"TryPeek",signature:"TryPeek(out TElement element, out TPriority priority) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"pq",label:"PriorityQueue<T,P>",accent:"generic"},{id:"queue",label:"Queue<T>",accent:"generic"},{id:"sset",label:"SortedSet<T>",accent:"generic"},{id:"sdict",label:"SortedDictionary<K,V>",accent:"generic"}],rows:[{aspect:"Backing",cells:{pq:"Binary heap on an array.",queue:"Circular array.",sset:"Red-black tree.",sdict:"Red-black tree."}},{aspect:"Order semantics",cells:{pq:"Min priority first.",queue:"Insertion order.",sset:"Sorted by element.",sdict:"Sorted by key."}},{aspect:"Enqueue",cells:{pq:"O(log n).",queue:"O(1) amortised.",sset:"O(log n) Add.",sdict:"O(log n) Add."}},{aspect:"Stable",cells:{pq:"No.",queue:"Yes (FIFO).",sset:"Yes (sorted).",sdict:"Yes (sorted)."}},{aspect:"Best for",cells:{pq:"Schedulers, A*, top-k.",queue:"In-order pipelines.",sset:"Ordered sets.",sdict:"Ordered key-value lookup."}}]},related:[{slug:"queue"},{slug:"sorted-set"},{slug:"sorted-dictionary"},{slug:"list"}]};var d={slug:"dictionary",name:"Dictionary<K,V>",namespace:"generic",metaDescription:"System.Collections.Generic.Dictionary<TKey, TValue> \u2014 hash-backed associative array, O(1) average for Add, Lookup, Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Unordered"}],lead:"A hash table from keys to values. Add, lookup and remove are O(1) on average \u2014 the constants are small but the fixed cost per operation is higher than a List index access. The default associative collection in C#, and the right answer almost any time you need a key-to-value map.",metrics:[{label:"Add",value:"O(1)",note:"amortised \u2014 rehashes on load-factor overflow"},{label:"Lookup",value:"O(1)",note:"one hash, one bucket walk"},{label:"Remove",value:"O(1)",note:"unlinks from the bucket chain"}],whenToUse:"Reach for Dictionary<K,V> whenever you have keys and values, lookups dominate, and order does not matter. If you need ordered iteration, consider SortedDictionary; if you need thread-safety, ConcurrentDictionary; if you need an immutable snapshot, ImmutableDictionary.",callout:{variant:"note",title:"TryGetValue is the idiom",body:"Avoid the ContainsKey-then-index pattern \u2014 it hashes twice. TryGetValue performs the lookup once and returns whether the key existed in a single call. Same in CollectionsMarshal.GetValueRefOrNullRef when you need to mutate a value in place."},diagram:{caption:"How a key resolves",body:`  key \u2500\u2500hash\u2500\u2500\u25B6  bucket index \u2500\u2500\u25B6  bucket chain
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
};`}],properties:[{name:"Count",type:"int",description:"Number of key-value pairs currently stored."},{name:"Keys",type:"KeyCollection",description:"Live view over the keys. Iterating it is allocation-free; not a snapshot \u2014 mutations to the dictionary are visible through it."},{name:"Values",type:"ValueCollection",description:"Live view over the values. Same allocation and snapshot semantics as Keys."},{name:"Comparer",type:"IEqualityComparer<TKey>",description:"The key comparer in use. Defaults to EqualityComparer<TKey>.Default; override at construction for case-insensitive or custom equality."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(1) average. Setting overwrites; reading throws KeyNotFoundException for missing keys."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 void",complexity:"O(1)"},{name:"TryAdd",signature:"TryAdd(TKey key, TValue value) \u2192 bool",complexity:"O(1)"},{name:"Remove",signature:"Remove(TKey key) \u2192 bool",complexity:"O(1)"},{name:"TryGetValue",signature:"TryGetValue(TKey, out TValue) \u2192 bool",complexity:"O(1)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(1)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"EnsureCapacity",signature:"EnsureCapacity(int capacity) \u2192 int",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"dict",label:"Dictionary<K,V>",accent:"generic"},{id:"sorted",label:"SortedDictionary<K,V>",accent:"generic"},{id:"concurrent",label:"ConcurrentDictionary",accent:"concurrent"},{id:"immutable",label:"ImmutableDictionary",accent:"immutable"},{id:"hashtable",label:"Hashtable",accent:"legacy"}],rows:[{aspect:"Backing",cells:{dict:"Hash table.",sorted:"Red-black tree.",concurrent:"Striped hash table.",immutable:"HAMT (hash array mapped trie).",hashtable:"Hash table of object."}},{aspect:"Add / Lookup",cells:{dict:"O(1) average.",sorted:"O(log n).",concurrent:"O(1) average, lock-free reads.",immutable:"O(log n) \u2014 returns a new map.",hashtable:"O(1) average plus boxing."}},{aspect:"Order",cells:{dict:"Insertion order on iteration.",sorted:"Sorted by key.",concurrent:"Unordered.",immutable:"Unordered.",hashtable:"Unordered."}},{aspect:"Thread safety",cells:{dict:"None.",sorted:"None.",concurrent:"Safe \u2014 designed for it.",immutable:"Safe \u2014 values cannot change.",hashtable:"Reads safe, writes need a lock."}},{aspect:"Best for",cells:{dict:"The default key-value map.",sorted:"Ordered iteration by key.",concurrent:"Multi-writer scenarios.",immutable:"Snapshot-style state.",hashtable:"Compatibility only."}}]},related:[{slug:"sorted-dictionary"},{slug:"hash-set"},{slug:"concurrent-dictionary"},{slug:"immutable-dictionary"},{slug:"hashtable"}]};var m={slug:"sorted-dictionary",name:"SortedDictionary<TKey, TValue>",namespace:"generic",metaDescription:"System.Collections.Generic.SortedDictionary<TKey, TValue> \u2014 red-black tree, O(log n) Add/Lookup/Remove, sorted iteration. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Sorted by key"},{variant:"neutral",label:"Red-black tree"}],lead:"A key-value map that stays sorted by key. Backed by a red-black tree, so every operation is O(log n) but iteration is in key order. Choose it over Dictionary<K,V> when you need ordered enumeration; choose SortedList<K,V> when memory matters more than insert speed.",metrics:[{label:"Add",value:"O(log n)",note:"tree rotation on insert"},{label:"Lookup",value:"O(log n)",note:"descend the tree"},{label:"Iteration",value:"O(n)",note:"in-order traversal, sorted"}],whenToUse:"Reach for SortedDictionary when ordered iteration matters and writes happen frequently \u2014 log lines indexed by timestamp, leaderboards keyed by score, anything where you walk in order. Prefer SortedList<K,V> for read-heavy workloads with rare writes; prefer Dictionary<K,V> when order doesn\u2019t matter.",callout:{variant:"note",title:"SortedDictionary vs SortedList",body:"Both stay sorted by key. SortedDictionary uses a tree \u2014 O(log n) inserts that don\u2019t shift anything. SortedList uses two arrays \u2014 O(n) inserts that do, but tighter memory and faster index access. The rule of thumb: more writes \u2192 SortedDictionary, more reads \u2192 SortedList."},examples:[{caption:"Sorted iteration",language:"csharp",source:`// Construct
SortedDictionary<string, int> ages = new();
SortedDictionary<string, int> ci = new(StringComparer.OrdinalIgnoreCase);

// Add \u2014 O(log n); throws on duplicate key
ages.Add("Ada",   36);
ages.Add("Linus", 54);
ages.Add("Grace", 85);

// Indexer set or overwrite
ages["Ada"] = 37;

// TryGetValue \u2014 idiomatic safe lookup
if (ages.TryGetValue("Ada", out int age))
    Console.WriteLine(age);

// Iteration is sorted by key
foreach ((string name, int years) in ages)
    Console.WriteLine($"{name}: {years}");
// Ada, Grace, Linus

// Range / first / last via LINQ on the sorted enumerator
string first = ages.First().Key;                   // "Ada"
string last  = ages.Last().Key;                    // "Linus"

// Remove
ages.Remove("Linus");`}],properties:[{name:"Count",type:"int",description:"Number of pairs in the map."},{name:"Keys",type:"KeyCollection",description:"Keys in sorted order \u2014 live view, not a snapshot."},{name:"Values",type:"ValueCollection",description:"Values in key-sorted order \u2014 live view."},{name:"Comparer",type:"IComparer<TKey>",description:"Key comparer in use; defaults to Comparer<TKey>.Default."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(log n). Set overwrites; read throws KeyNotFoundException for missing keys."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 void",complexity:"O(log n)"},{name:"TryAdd",signature:"TryAdd(TKey key, TValue value) \u2192 bool",complexity:"O(log n)"},{name:"Remove",signature:"Remove(TKey key) \u2192 bool",complexity:"O(log n)"},{name:"TryGetValue",signature:"TryGetValue(TKey, out TValue) \u2192 bool",complexity:"O(log n)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(log n)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"sd",label:"SortedDictionary<K,V>",accent:"generic"},{id:"sl",label:"SortedList<K,V>",accent:"generic"},{id:"d",label:"Dictionary<K,V>",accent:"generic"},{id:"id",label:"ImmutableSortedDictionary",accent:"immutable"}],rows:[{aspect:"Backing",cells:{sd:"Red-black tree.",sl:"Two parallel arrays.",d:"Hash table.",id:"AVL tree, persistent."}},{aspect:"Add",cells:{sd:"O(log n).",sl:"O(n) (shifts).",d:"O(1) average.",id:"O(log n), returns new."}},{aspect:"Lookup",cells:{sd:"O(log n).",sl:"O(log n).",d:"O(1) average.",id:"O(log n)."}},{aspect:"Memory",cells:{sd:"Higher \u2014 node overhead.",sl:"Tightest of the three.",d:"Bucket overhead.",id:"Higher \u2014 node overhead."}},{aspect:"Order",cells:{sd:"Sorted by key.",sl:"Sorted by key.",d:"Insertion order.",id:"Sorted by key."}},{aspect:"Best for",cells:{sd:"Write-heavy ordered map.",sl:"Read-heavy ordered map.",d:"The default map.",id:"Snapshot ordered map."}}]},related:[{slug:"dictionary"},{slug:"sorted-list"},{slug:"sorted-set"},{slug:"immutable-sorted-dictionary"}]};var p={slug:"sorted-list",name:"SortedList<TKey, TValue>",namespace:"generic",metaDescription:"System.Collections.Generic.SortedList<TKey, TValue> \u2014 two parallel arrays sorted by key. O(log n) lookup, O(n) insert at random positions. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 2.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"warn",label:"O(n) insert at middle"},{variant:"neutral",label:"Sorted by key"},{variant:"ok",label:"Indexable"}],lead:"A sorted key-value map backed by two parallel arrays \u2014 one of keys, one of values, both kept in lock-step sorted order. Lookup is O(log n) via binary search; inserting in the middle is O(n) because it shifts. Tighter memory than SortedDictionary, slower writes; the right shape for read-heavy ordered maps.",metrics:[{label:"Lookup",value:"O(log n)",note:"binary search the keys array"},{label:"Add",value:"O(n)",note:"shifts to make room (O(log n) at the end)"},{label:"Index by position",value:"O(1)",note:"GetKeyAtIndex / GetValueAtIndex"}],whenToUse:"Reach for SortedList when reads dominate and the data set is small to medium \u2014 config maps, lookup tables, sorted views built once. The indexable form (GetKeyAtIndex / Values\\[i\\]) is unique among the sorted maps and useful when you need both ordering and positional access.",callout:{variant:"warn",title:"O(n) inserts hurt at scale",body:"Adding a key in the middle of a 100k-entry SortedList shifts roughly 50k slots. If your write rate is anything but rare, switch to SortedDictionary \u2014 same ordered semantics, O(log n) inserts, no array shifting."},examples:[{caption:"Indexable ordered map",language:"csharp",source:`// Construct
SortedList<string, int> scores = new();
SortedList<string, int> sized = new(capacity: 256);

// Add \u2014 O(n) average, O(log n) at the end
scores.Add("alice",   95);
scores.Add("bob",     72);
scores.Add("charlie", 88);

// Indexer by KEY \u2014 O(log n)
int alice = scores["alice"];
scores["bob"] = 75;

// Index by POSITION \u2014 unique to SortedList among ordered maps
string firstKey = scores.GetKeyAtIndex(0);         // "alice"
int    firstVal = scores.GetValueAtIndex(0);

// TryGetValue \u2014 idiomatic safe lookup
if (scores.TryGetValue("charlie", out int v))
    Console.WriteLine(v);

// Walk in key order
foreach ((string name, int s) in scores)
    Console.WriteLine($"{name}: {s}");

// IndexOfKey \u2014 binary search returns the position or ~insertionPoint
int idx = scores.IndexOfKey("bob");                // 1
int missing = scores.IndexOfKey("zoe");            // ~3

// Remove
scores.Remove("bob");
scores.RemoveAt(0);`}],properties:[{name:"Count",type:"int",description:"Number of pairs."},{name:"Capacity",type:"int",description:"Underlying array length. Set up front to avoid the doubling chain."},{name:"Keys",type:"IList<TKey>",description:"Sorted keys \u2014 also indexable by position."},{name:"Values",type:"IList<TValue>",description:"Values in key-sorted order \u2014 also indexable by position."},{name:"Comparer",type:"IComparer<TKey>",description:"Key comparer in use."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(log n). Set overwrites; read throws KeyNotFoundException for missing keys."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 void",complexity:"O(n)"},{name:"TryAdd",signature:"TryAdd(TKey key, TValue value) \u2192 bool",complexity:"O(n)"},{name:"Remove",signature:"Remove(TKey key) \u2192 bool",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"TryGetValue",signature:"TryGetValue(TKey, out TValue) \u2192 bool",complexity:"O(log n)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(log n)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"IndexOfKey",signature:"IndexOfKey(TKey key) \u2192 int",complexity:"O(log n)"},{name:"IndexOfValue",signature:"IndexOfValue(TValue value) \u2192 int",complexity:"O(n)"},{name:"GetKeyAtIndex",signature:"GetKeyAtIndex(int index) \u2192 TKey",complexity:"O(1)"},{name:"GetValueAtIndex",signature:"GetValueAtIndex(int index) \u2192 TValue",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"sl",label:"SortedList<K,V>",accent:"generic"},{id:"sd",label:"SortedDictionary<K,V>",accent:"generic"},{id:"d",label:"Dictionary<K,V>",accent:"generic"}],rows:[{aspect:"Backing",cells:{sl:"Two parallel arrays.",sd:"Red-black tree.",d:"Hash table."}},{aspect:"Lookup",cells:{sl:"O(log n).",sd:"O(log n).",d:"O(1) average."}},{aspect:"Add",cells:{sl:"O(n).",sd:"O(log n).",d:"O(1) average."}},{aspect:"By position",cells:{sl:"O(1) GetKey/ValueAt.",sd:"Not supported.",d:"Not supported."}},{aspect:"Memory",cells:{sl:"Tightest of the three.",sd:"Tree node overhead.",d:"Bucket overhead."}},{aspect:"Best for",cells:{sl:"Read-heavy ordered map.",sd:"Write-heavy ordered map.",d:"The default map."}}]},related:[{slug:"sorted-dictionary"},{slug:"dictionary"},{slug:"list"},{slug:"legacy-sorted-list"}]};var y={slug:"hash-set",name:"HashSet<T>",namespace:"generic",metaDescription:"System.Collections.Generic.HashSet<T> \u2014 hash-table-backed set, O(1) average for Add/Contains/Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 3.5"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Unordered"},{variant:"ok",label:"Set algebra built in"}],lead:"A set of unique values backed by a hash table. Add, Contains, and Remove are O(1) on average; iteration is unordered. The set algebra methods (UnionWith, IntersectWith, ExceptWith) work in-place and are O(n+m), which makes HashSet the right shape for membership tests and set arithmetic alike.",metrics:[{label:"Add",value:"O(1)",note:"amortised; rehashes on overflow"},{label:"Contains",value:"O(1)",note:"one hash, one bucket walk"},{label:"Remove",value:"O(1)",note:"unlinks from the bucket chain"}],whenToUse:'Reach for HashSet whenever you ask "have I seen this?" \u2014 dedupe pipelines, visited-node tracking in graph walks, set difference between two collections. Prefer SortedSet<T> when you need ordered iteration; prefer Dictionary<K,V> when each item carries a payload.',callout:{variant:"note",title:"Pass a comparer for value equality",body:"The default comparer (EqualityComparer<T>.Default) uses GetHashCode and Equals. For case-insensitive strings pass StringComparer.OrdinalIgnoreCase; for records, equality is by value automatically; for custom classes you usually want to provide an IEqualityComparer<T> rather than override Equals globally."},examples:[{caption:"Membership and set algebra",language:"csharp",source:`// Construct
HashSet<string> seen = new();
HashSet<string> ci = new(StringComparer.OrdinalIgnoreCase);
HashSet<int>    seeded = new(new[] { 1, 2, 3 });

// Add \u2014 returns false if already present (no throw)
bool added = seen.Add("page-1");                   // true
seen.Add("page-1");                                 // false

// Contains \u2014 O(1)
bool has = seen.Contains("page-1");

// Remove \u2014 returns whether anything was removed
seen.Remove("page-1");

// Set algebra (mutates the receiver in place)
HashSet<int> a = new(new[] { 1, 2, 3, 4 });
HashSet<int> b = new(new[] { 3, 4, 5, 6 });
a.UnionWith(b);          // a now {1, 2, 3, 4, 5, 6}
a.IntersectWith(b);      // a now {3, 4, 5, 6}
a.ExceptWith(b);         // a now {}
a.SymmetricExceptWith(b);// xor: items only in one or the other

// Predicate-based check without allocating
bool subset = a.IsSubsetOf(b);
bool overlaps = a.Overlaps(b);

// Bulk dedupe via constructor
List<string> messy = new() { "a", "b", "a", "c", "b" };
HashSet<string> unique = new(messy);               // {a, b, c}`}],properties:[{name:"Count",type:"int",description:"Items in the set. Tracked, not computed."},{name:"Comparer",type:"IEqualityComparer<T>",description:"Equality comparer in use."}],methods:[{name:"Add",signature:"Add(T item) \u2192 bool",complexity:"O(1)"},{name:"Remove",signature:"Remove(T item) \u2192 bool",complexity:"O(1)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"UnionWith",signature:"UnionWith(IEnumerable<T> other) \u2192 void",complexity:"O(k)"},{name:"IntersectWith",signature:"IntersectWith(IEnumerable<T> other) \u2192 void",complexity:"O(n + k)"},{name:"ExceptWith",signature:"ExceptWith(IEnumerable<T> other) \u2192 void",complexity:"O(k)"},{name:"SymmetricExceptWith",signature:"SymmetricExceptWith(IEnumerable<T> other) \u2192 void",complexity:"O(k)"},{name:"IsSubsetOf",signature:"IsSubsetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(n + k)"},{name:"IsSupersetOf",signature:"IsSupersetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(k)"},{name:"Overlaps",signature:"Overlaps(IEnumerable<T> other) \u2192 bool",complexity:"O(k)"},{name:"EnsureCapacity",signature:"EnsureCapacity(int capacity) \u2192 int",complexity:"O(n)"},{name:"TrimExcess",signature:"TrimExcess() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"hs",label:"HashSet<T>",accent:"generic"},{id:"ss",label:"SortedSet<T>",accent:"generic"},{id:"d",label:"Dictionary<K,V>",accent:"generic"},{id:"ihs",label:"ImmutableHashSet<T>",accent:"immutable"}],rows:[{aspect:"Backing",cells:{hs:"Hash table.",ss:"Red-black tree.",d:"Hash table.",ihs:"HAMT, persistent."}},{aspect:"Add",cells:{hs:"O(1) average.",ss:"O(log n).",d:"O(1) average.",ihs:"O(log n), returns new."}},{aspect:"Contains",cells:{hs:"O(1) average.",ss:"O(log n).",d:"O(1) average.",ihs:"O(log n)."}},{aspect:"Order",cells:{hs:"Insertion order on iterate.",ss:"Sorted.",d:"Insertion order.",ihs:"Unordered."}},{aspect:"Best for",cells:{hs:"Membership, dedupe.",ss:"Ordered unique values.",d:"Key \u2192 value map.",ihs:"Snapshot sets."}}]},related:[{slug:"sorted-set"},{slug:"dictionary"},{slug:"immutable-hash-set"},{slug:"list"}]};var h={slug:"sorted-set",name:"SortedSet<T>",namespace:"generic",metaDescription:"System.Collections.Generic.SortedSet<T> \u2014 red-black tree of unique sorted values. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Generic"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Sorted"},{variant:"ok",label:"Range views"}],lead:"A set of unique values kept in sorted order, backed by a red-black tree. Add, Contains, and Remove are O(log n); iteration walks in-order. Min, Max, and GetViewBetween give you cheap access to the extremes and ranges, which is what HashSet can\u2019t do.",metrics:[{label:"Add",value:"O(log n)",note:"tree rotation on insert"},{label:"Contains",value:"O(log n)",note:"descend the tree"},{label:"Min / Max",value:"O(log n)",note:"leftmost / rightmost descent"}],whenToUse:"Reach for SortedSet when ordered iteration matters or you need range queries \u2014 sorted log keys, leaderboards walked top-to-bottom, half-open intervals via GetViewBetween. Use HashSet when order doesn\u2019t matter; the constant-factor cost of the tree is real.",callout:{variant:"highlight",title:"GetViewBetween is a live window",body:"GetViewBetween returns a SortedSet that mirrors the slice of the original set between two bounds. Inserts into the original within the range show up in the view; inserts into the view outside the range throw. Cheap, expressive, and unique to SortedSet."},examples:[{caption:"Sorted, ranged, set algebra",language:"csharp",source:`// Construct
SortedSet<int>    nums = new(new[] { 7, 2, 9, 4, 1 });
SortedSet<string> names = new(StringComparer.OrdinalIgnoreCase);

// Add \u2014 returns false on duplicates
nums.Add(5);
nums.Add(2);                                        // false, already present

// Iteration is sorted
foreach (int n in nums) Console.WriteLine(n);       // 1, 2, 4, 5, 7, 9

// Min and Max \u2014 O(log n)
int min = nums.Min;
int max = nums.Max;

// Range view \u2014 live window between two bounds
SortedSet<int> mid = nums.GetViewBetween(3, 8);     // {4, 5, 7}
foreach (int n in mid) Console.WriteLine(n);

// Set algebra (in place)
SortedSet<int> a = new(new[] { 1, 2, 3, 4 });
SortedSet<int> b = new(new[] { 3, 4, 5, 6 });
a.UnionWith(b);
a.IntersectWith(b);
a.ExceptWith(b);

// Reverse iteration
foreach (int n in nums.Reverse())
    Console.WriteLine(n);                          // 9, 7, 5, 4, 2, 1`}],properties:[{name:"Count",type:"int",description:"Items in the set."},{name:"Min",type:"T",description:"Smallest element. O(log n)."},{name:"Max",type:"T",description:"Largest element. O(log n)."},{name:"Comparer",type:"IComparer<T>",description:"Order comparer in use."}],methods:[{name:"Add",signature:"Add(T item) \u2192 bool",complexity:"O(log n)"},{name:"Remove",signature:"Remove(T item) \u2192 bool",complexity:"O(log n)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(log n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"GetViewBetween",signature:"GetViewBetween(T lower, T upper) \u2192 SortedSet<T>",complexity:"O(log n)"},{name:"Reverse",signature:"Reverse() \u2192 IEnumerable<T>",complexity:"O(1)"},{name:"UnionWith",signature:"UnionWith(IEnumerable<T> other) \u2192 void",complexity:"O(k log n)"},{name:"IntersectWith",signature:"IntersectWith(IEnumerable<T> other) \u2192 void",complexity:"O(n + k)"},{name:"ExceptWith",signature:"ExceptWith(IEnumerable<T> other) \u2192 void",complexity:"O(k log n)"},{name:"IsSubsetOf",signature:"IsSubsetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(n + k)"}],comparison:{columns:[{id:"ss",label:"SortedSet<T>",accent:"generic"},{id:"hs",label:"HashSet<T>",accent:"generic"},{id:"iss",label:"ImmutableSortedSet<T>",accent:"immutable"},{id:"sd",label:"SortedDictionary<K,V>",accent:"generic"}],rows:[{aspect:"Backing",cells:{ss:"Red-black tree.",hs:"Hash table.",iss:"AVL tree, persistent.",sd:"Red-black tree."}},{aspect:"Add",cells:{ss:"O(log n).",hs:"O(1) average.",iss:"O(log n), returns new.",sd:"O(log n)."}},{aspect:"Order",cells:{ss:"Sorted.",hs:"Unordered.",iss:"Sorted.",sd:"Sorted by key."}},{aspect:"Min/Max",cells:{ss:"O(log n).",hs:"Not supported.",iss:"O(log n).",sd:"First/Last via LINQ."}},{aspect:"Range views",cells:{ss:"GetViewBetween \u2014 live.",hs:"Not supported.",iss:"Snapshot only.",sd:"Not supported."}},{aspect:"Best for",cells:{ss:"Ordered unique values.",hs:"Membership tests.",iss:"Snapshot ordered sets.",sd:"Ordered key-value map."}}]},related:[{slug:"hash-set"},{slug:"sorted-dictionary"},{slug:"immutable-sorted-set"},{slug:"priority-queue"}]};var b={slug:"observable-collection",name:"ObservableCollection<T>",namespace:"generic",metaDescription:"System.Collections.ObjectModel.ObservableCollection<T> \u2014 list that raises CollectionChanged on every mutation. The MVVM workhorse. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.ObjectModel"},{variant:"neutral",label:"Since .NET 3.0"},{variant:"ok",label:"Generic"},{variant:"warn",label:"Not thread-safe"},{variant:"ok",label:"INotifyCollectionChanged"},{variant:"ok",label:"INotifyPropertyChanged"}],lead:"A List-like collection that raises CollectionChanged after every mutation and PropertyChanged for Count and indexer changes. The default backing collection for data-bound lists in WPF, MAUI, WinUI, and Avalonia. Same big-O as List<T>, plus the cost of the event dispatch.",metrics:[{label:"Add",value:"O(1) amortized",note:"plus event dispatch"},{label:"Index access",value:"O(1)",note:"same as List<T>"},{label:"Insert / Remove at i",value:"O(n)",note:"shifts plus event dispatch"}],whenToUse:"Reach for ObservableCollection<T> in any data-bound UI scenario where the view should auto-refresh on collection changes \u2014 MVVM lists, search results, kanban columns. Outside of UI binding the event overhead is pure cost; use List<T> instead.",callout:{variant:"warn",title:"CollectionChanged fires on the originating thread",body:"If a background thread mutates the collection, the event fires on that thread \u2014 and a UI binding will throw because UI elements can only be touched from the UI thread. Either marshal the mutation back via Dispatcher / SynchronizationContext, or use a thread-safe wrapper that re-raises events on the right thread."},examples:[{caption:"Bindable list",language:"csharp",source:`using System.Collections.ObjectModel;
using System.Collections.Specialized;

// Construct \u2014 empty or seeded from any IEnumerable
ObservableCollection<string> tasks = new();
ObservableCollection<int> seeded = new(new[] { 1, 2, 3 });

// Subscribe to changes \u2014 typical MVVM pattern
tasks.CollectionChanged += OnChanged;

// Add \u2014 O(1) amortised; raises CollectionChanged with action = Add
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
            Console.WriteLine($"~ {e.OldItems?[0]} \u2192 {e.NewItems?[0]}");
            break;
        case NotifyCollectionChangedAction.Move:
            Console.WriteLine($"\u2195 {e.OldStartingIndex} \u2192 {e.NewStartingIndex}");
            break;
        case NotifyCollectionChangedAction.Reset:
            Console.WriteLine("cleared");
            break;
    }
}`}],properties:[{name:"Count",type:"int",description:"Number of items. Raises PropertyChanged on change."},{name:"this[int index]",type:"T",description:"Indexer \u2014 raises CollectionChanged on set."}],methods:[{name:"Add",signature:"Add(T item) \u2192 void",complexity:"O(1) amortized"},{name:"Insert",signature:"Insert(int index, T item) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(T item) \u2192 bool",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"Move",signature:"Move(int oldIndex, int newIndex) \u2192 void",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(T item) \u2192 int",complexity:"O(n)"}],comparison:{columns:[{id:"oc",label:"ObservableCollection<T>",accent:"generic"},{id:"list",label:"List<T>",accent:"generic"},{id:"roc",label:"ReadOnlyObservableCollection<T>",accent:"generic"}],rows:[{aspect:"Notifications",cells:{oc:"CollectionChanged + PropertyChanged.",list:"None.",roc:"Re-raises wrapped collection events."}},{aspect:"Mutation API",cells:{oc:"Add / Insert / Remove / Move / Clear.",list:"Same minus Move.",roc:"None \u2014 read-only."}},{aspect:"Thread-safety",cells:{oc:"No \u2014 UI thread only.",list:"No.",roc:"Same as wrapped collection."}},{aspect:"Best for",cells:{oc:"MVVM / data-bound UI lists.",list:"Headless lists.",roc:"Exposing a bindable list as read-only."}}]},related:[{slug:"list"},{slug:"linked-list"},{slug:"immutable-list"}]};var g={slug:"array-list",name:"ArrayList",namespace:"legacy",metaDescription:"System.Collections.ArrayList \u2014 pre-generics resizing list of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Non-generic"},{variant:"warn",label:"Boxes value types"},{variant:"warn",label:"Not thread-safe"},{variant:"warn",label:"Avoid in new code"}],lead:"A resizing list of object \u2014 the .NET 1.0 answer to dynamic arrays, before generics existed. Same shape as List<T> (O(1) amortised append, O(n) middle insert) plus an unavoidable cost: every value type that goes in gets boxed onto the heap, and every read needs an unsafe cast on the way out. Use List<T> in new code; this page exists for the moments you maintain old code.",metrics:[{label:"Add",value:"O(1) amortized",note:"doubles on overflow; boxes value types"},{label:"Index access",value:"O(1)",note:"returns object; cast required"},{label:"Insert / Remove at i",value:"O(n)",note:"shifts everything after i"}],whenToUse:"Reach for ArrayList only when interacting with code from before .NET 2.0 that has not been migrated to generics. In every other case List<T> is faster, safer, and easier to read. The Microsoft Learn page on ArrayList itself recommends List<T>.",callout:{variant:"warn",title:"Boxing is the real cost",body:"Every int, every struct, every value type stored in an ArrayList is allocated on the heap as a boxed copy. A million-entry ArrayList<int> equivalent is a million extra heap allocations and a million extra GC pressures. List<int> stores the values inline. The asymptotic story is identical; the actual cost is not."},examples:[{caption:"How it looked, why we don't anymore",language:"csharp",source:`using System.Collections;

// Construct
ArrayList items = new();
ArrayList sized = new(capacity: 1024);
ArrayList seeded = new(new[] { 1, "two", 3.0 });   // mixed types \u2014 anything goes

// Add \u2014 boxes if the value is a value type
items.Add(42);              // int \u2192 boxed
items.Add("hello");         // already a reference type
items.Add(3.14);            // double \u2192 boxed
items.AddRange(new[] { 1, 2, 3 });

// Index access \u2014 returns object, cast required
int first = (int)items[0];                          // unbox + cast
string second = (string)items[1];

// Iterate \u2014 must cast inside the loop
foreach (object o in items)
{
    if (o is int n) Console.WriteLine(n);
}

// Insert / Remove \u2014 same O(n) shifting as List<T>
items.Insert(0, 99);
items.RemoveAt(2);
items.Remove(42);                                   // searches linearly

// The modern equivalent \u2014 strongly typed, no boxing
List<int> modern = new() { 1, 2, 3 };
modern.Add(42);                                      // stored as int, no allocation`}],properties:[{name:"Count",type:"int",description:"Number of items currently in the list."},{name:"Capacity",type:"int",description:"Backing array length. Set up front to avoid the doubling chain."},{name:"this[int index]",type:"object",description:"Indexer \u2014 O(1). Returns object; the caller must cast and may need to unbox."}],methods:[{name:"Add",signature:"Add(object value) \u2192 int",complexity:"O(1) amortized"},{name:"AddRange",signature:"AddRange(ICollection c) \u2192 void",complexity:"O(k)"},{name:"Insert",signature:"Insert(int index, object value) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(object obj) \u2192 void",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"Contains",signature:"Contains(object item) \u2192 bool",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(object value) \u2192 int",complexity:"O(n)"},{name:"Sort",signature:"Sort() \u2192 void",complexity:"O(n log n)"},{name:"BinarySearch",signature:"BinarySearch(object value) \u2192 int",complexity:"O(log n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 object[]",complexity:"O(n)"}],comparison:{columns:[{id:"al",label:"ArrayList",accent:"legacy"},{id:"list",label:"List<T>",accent:"generic"},{id:"arr",label:"T[]",accent:"primitive"}],rows:[{aspect:"Type safety",cells:{al:"None \u2014 object.",list:"Generic \u2014 full.",arr:"Generic \u2014 full."}},{aspect:"Value types",cells:{al:"Boxed on every Add.",list:"Stored inline.",arr:"Stored inline."}},{aspect:"Add",cells:{al:"O(1) amortised + boxing.",list:"O(1) amortised.",arr:"Not supported."}},{aspect:"Index access",cells:{al:"O(1) + cast / unbox.",list:"O(1).",arr:"O(1) \u2014 fastest available."}},{aspect:"Best for",cells:{al:"Maintenance only.",list:"The default ordered list.",arr:"Hot loops, fixed sizes."}}]},related:[{slug:"list"},{slug:"array"},{slug:"hashtable"}]};var T={slug:"hashtable",name:"Hashtable",namespace:"legacy",metaDescription:"System.Collections.Hashtable \u2014 pre-generics hash table of object \u2192 object. Reads thread-safe, writes need a lock. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Non-generic"},{variant:"warn",label:"Boxes value types"},{variant:"ok",label:"Reads are thread-safe"},{variant:"warn",label:"Writes need a lock"}],lead:"A hash table from object keys to object values \u2014 the .NET 1.0 dictionary, before generics. O(1) average across the board, plus a quiet legacy quirk: reads from a single Hashtable are thread-safe, writes are not. Dictionary<K,V> drops the thread-safe-read promise (because it was rarely useful) and gains type safety, less boxing, and better performance. Use Dictionary<K,V> in new code.",metrics:[{label:"Add",value:"O(1)",note:"amortised; rehashes on overflow"},{label:"Lookup",value:"O(1)",note:"one hash, one bucket walk; cast required"},{label:"Remove",value:"O(1)",note:"unlinks from the bucket chain"}],whenToUse:"Reach for Hashtable only when you maintain code that already uses it. The thread-safe-read promise sounds appealing but is rarely sufficient on its own \u2014 most multi-writer scenarios still need a lock or ConcurrentDictionary. New code should pick Dictionary<K,V> or ConcurrentDictionary<K,V> with intent.",callout:{variant:"warn",title:"Thread-safe reads, not full thread safety",body:'A single Hashtable is safe for many readers and one writer \u2014 but a "writer" includes any thread that mutates the structure, including via expansion-triggering Add. If multiple threads can write you still need a lock or, more usefully, ConcurrentDictionary, which was designed for the multi-writer case from the start.'},examples:[{caption:"Object-keyed map",language:"csharp",source:`using System.Collections;

// Construct
Hashtable map = new();
Hashtable sized = new(capacity: 1024);
Hashtable ci = new(StringComparer.OrdinalIgnoreCase);

// Add \u2014 keys and values are both object
map.Add("Ada",   36);                               // 36 boxed
map.Add(42, "answer");                              // 42 boxed as key
map["Linus"] = 54;                                   // indexer also adds

// Lookup \u2014 returns object; null indicates "not present"
object? value = map["Ada"];
if (value is int age)
    Console.WriteLine(age);

// ContainsKey, ContainsValue
bool has = map.ContainsKey("Ada");
bool any = map.ContainsValue(36);                   // also boxed for comparison

// Iterate \u2014 yields DictionaryEntry, not KeyValuePair
foreach (DictionaryEntry e in map)
    Console.WriteLine($"{e.Key} \u2192 {e.Value}");

// Synchronized wrapper for safe writes
Hashtable safe = Hashtable.Synchronized(map);

// Modern equivalent \u2014 type-safe, no boxing
Dictionary<string, int> modern = new()
{
    ["Ada"]   = 36,
    ["Linus"] = 54,
};`}],properties:[{name:"Count",type:"int",description:"Number of entries."},{name:"Keys",type:"ICollection",description:"Live view over keys."},{name:"Values",type:"ICollection",description:"Live view over values."},{name:"IsSynchronized",type:"bool",description:"Whether this instance is the wrapper returned by Synchronized."},{name:"this[object key]",type:"object?",description:"Indexer \u2014 set adds or overwrites; read returns null when missing."}],methods:[{name:"Add",signature:"Add(object key, object value) \u2192 void",complexity:"O(1)"},{name:"Remove",signature:"Remove(object key) \u2192 void",complexity:"O(1)"},{name:"ContainsKey",signature:"ContainsKey(object key) \u2192 bool",complexity:"O(1)"},{name:"ContainsValue",signature:"ContainsValue(object value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"Synchronized",signature:"Hashtable.Synchronized(Hashtable t) \u2192 Hashtable",complexity:"O(1)"}],comparison:{columns:[{id:"ht",label:"Hashtable",accent:"legacy"},{id:"d",label:"Dictionary<K,V>",accent:"generic"},{id:"cd",label:"ConcurrentDictionary",accent:"concurrent"}],rows:[{aspect:"Type safety",cells:{ht:"None \u2014 object \u2192 object.",d:"Generic \u2014 full.",cd:"Generic \u2014 full."}},{aspect:"Value types",cells:{ht:"Boxed on every Add.",d:"Stored inline.",cd:"Stored inline."}},{aspect:"Reads",cells:{ht:"Safe for many readers.",d:"Single thread only.",cd:"Lock-free, fully safe."}},{aspect:"Writes",cells:{ht:"Need a lock or Synchronized.",d:"Single thread only.",cd:"Striped locks, fully safe."}},{aspect:"Best for",cells:{ht:"Legacy code only.",d:"The default map.",cd:"Multi-writer maps."}}]},related:[{slug:"dictionary"},{slug:"concurrent-dictionary"},{slug:"array-list"}]};var f={slug:"legacy-stack",name:"Stack (legacy)",namespace:"legacy",metaDescription:"System.Collections.Stack \u2014 pre-generics LIFO stack of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Non-generic"},{variant:"warn",label:"Boxes value types"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"LIFO"}],lead:"A LIFO stack of object \u2014 the .NET 1.0 stack, kept around for compatibility with code that predates generics. Same Push / Pop / Peek as Stack<T>, plus the unavoidable boxing tax on every value type that goes in. Use Stack<T> in new code.",metrics:[{label:"Push",value:"O(1) amortized",note:"doubles when full; boxes value types"},{label:"Pop",value:"O(1)",note:"returns object; cast required"},{label:"Peek",value:"O(1)",note:"reads the top in place"}],whenToUse:"Reach for the legacy Stack only when maintaining code that already uses it. Stack<T> from System.Collections.Generic is faster, type-safe, and free of boxing for value types.",examples:[{caption:"Push, pop, cast",language:"csharp",source:`using System.Collections;

Stack stack = new();
Stack sized = new(initialCapacity: 64);

stack.Push(42);                                    // int \u2192 boxed
stack.Push("hello");
stack.Push(3.14);

object top = stack.Peek();                         // returns object
double pi = (double)stack.Pop();                   // cast + unbox
string s = (string)stack.Pop();
int n = (int)stack.Pop();

// Iterate top-to-bottom
foreach (object o in stack)
    Console.WriteLine(o);

// Modern equivalent \u2014 no boxing, no casts
Stack<int> modern = new();
modern.Push(42);
int v = modern.Pop();`}],properties:[{name:"Count",type:"int",description:"Items in the stack."}],methods:[{name:"Push",signature:"Push(object obj) \u2192 void",complexity:"O(1) amortized"},{name:"Pop",signature:"Pop() \u2192 object",complexity:"O(1)"},{name:"Peek",signature:"Peek() \u2192 object",complexity:"O(1)"},{name:"Contains",signature:"Contains(object obj) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 object[]",complexity:"O(n)"}],comparison:{columns:[{id:"ls",label:"Stack (legacy)",accent:"legacy"},{id:"s",label:"Stack<T>",accent:"generic"},{id:"cs",label:"ConcurrentStack<T>",accent:"concurrent"}],rows:[{aspect:"Type safety",cells:{ls:"None \u2014 object.",s:"Generic \u2014 full.",cs:"Generic \u2014 full."}},{aspect:"Value types",cells:{ls:"Boxed on Push.",s:"Stored inline.",cs:"Stored inline."}},{aspect:"Thread-safe",cells:{ls:"No.",s:"No.",cs:"Yes \u2014 lock-free."}},{aspect:"Best for",cells:{ls:"Legacy code only.",s:"The default LIFO.",cs:"Multi-writer LIFO."}}]},related:[{slug:"stack"},{slug:"concurrent-stack"},{slug:"immutable-stack"},{slug:"array-list"}]};var v={slug:"legacy-queue",name:"Queue (legacy)",namespace:"legacy",metaDescription:"System.Collections.Queue \u2014 pre-generics FIFO queue of object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Non-generic"},{variant:"warn",label:"Boxes value types"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"FIFO"}],lead:"A FIFO queue of object \u2014 the .NET 1.0 queue, sibling of the legacy Stack. Same Enqueue / Dequeue / Peek as Queue<T>, with the same boxing tax for value types. Modern code should pick Queue<T> from System.Collections.Generic.",metrics:[{label:"Enqueue",value:"O(1) amortized",note:"doubles when full; boxes value types"},{label:"Dequeue",value:"O(1)",note:"returns object; cast required"},{label:"Peek",value:"O(1)",note:"reads head in place"}],whenToUse:"Reach for the legacy Queue only when maintaining code that already uses it. Queue<T> is faster, type-safe, and avoids the heap allocation that boxing forces on every value-type Enqueue.",examples:[{caption:"Enqueue, dequeue, cast",language:"csharp",source:`using System.Collections;

Queue q = new();
Queue sized = new(capacity: 64);

q.Enqueue("first");
q.Enqueue(2);                                       // int \u2192 boxed
q.Enqueue(3.14);

object head = q.Peek();
string first = (string)q.Dequeue();
int    n     = (int)q.Dequeue();

// Iterate head-to-tail
foreach (object o in q)
    Console.WriteLine(o);

// Modern equivalent
Queue<int> modern = new();
modern.Enqueue(1);
int x = modern.Dequeue();`}],properties:[{name:"Count",type:"int",description:"Items in the queue."}],methods:[{name:"Enqueue",signature:"Enqueue(object obj) \u2192 void",complexity:"O(1) amortized"},{name:"Dequeue",signature:"Dequeue() \u2192 object",complexity:"O(1)"},{name:"Peek",signature:"Peek() \u2192 object",complexity:"O(1)"},{name:"Contains",signature:"Contains(object obj) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 object[]",complexity:"O(n)"}],comparison:{columns:[{id:"lq",label:"Queue (legacy)",accent:"legacy"},{id:"q",label:"Queue<T>",accent:"generic"},{id:"cq",label:"ConcurrentQueue<T>",accent:"concurrent"}],rows:[{aspect:"Type safety",cells:{lq:"None \u2014 object.",q:"Generic \u2014 full.",cq:"Generic \u2014 full."}},{aspect:"Value types",cells:{lq:"Boxed on Enqueue.",q:"Stored inline.",cq:"Stored inline."}},{aspect:"Thread-safe",cells:{lq:"No.",q:"No.",cq:"Yes \u2014 lock-free."}},{aspect:"Best for",cells:{lq:"Legacy code only.",q:"The default FIFO.",cq:"Multi-writer FIFO."}}]},related:[{slug:"queue"},{slug:"concurrent-queue"},{slug:"immutable-queue"},{slug:"legacy-stack"}]};var k={slug:"legacy-sorted-list",name:"SortedList (legacy)",namespace:"legacy",metaDescription:"System.Collections.SortedList \u2014 pre-generics sorted map of object \u2192 object. Boxes value types, no type safety. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Non-generic"},{variant:"warn",label:"Boxes value types"},{variant:"warn",label:"O(n) insert at middle"},{variant:"neutral",label:"Sorted by key"}],lead:"A sorted key-value map \u2014 the .NET 1.0 ancestor of SortedList<TKey, TValue>. Two parallel arrays kept sorted by key; same shape as the generic version, with the boxing tax that any non-generic legacy collection brings. Modern code should pick SortedList<K,V> from System.Collections.Generic.",metrics:[{label:"Lookup",value:"O(log n)",note:"binary search the keys array"},{label:"Add",value:"O(n)",note:"shifts to make room"},{label:"Index by position",value:"O(1)",note:"GetByIndex / GetKey"}],whenToUse:"Reach for the legacy SortedList only when maintaining old code. SortedList<K,V> is the like-for-like replacement; SortedDictionary<K,V> trades higher memory for O(log n) inserts when writes are frequent.",examples:[{caption:"Sorted object map",language:"csharp",source:`using System.Collections;

SortedList sl = new();
sl.Add("alice", 95);
sl.Add("bob",   72);
sl.Add(1, "one");                                   // any object key works

// Lookup by key
int alice = (int)sl["alice"]!;

// Lookup by position \u2014 unique to SortedList
object firstKey = sl.GetKey(0);
object firstVal = sl.GetByIndex(0);

// Iterate \u2014 DictionaryEntry, like Hashtable
foreach (DictionaryEntry e in sl)
    Console.WriteLine($"{e.Key} \u2192 {e.Value}");

// Modern equivalent
SortedList<string, int> modern = new();
modern.Add("alice", 95);
int v = modern["alice"];`}],properties:[{name:"Count",type:"int",description:"Number of pairs."},{name:"Capacity",type:"int",description:"Backing array length."},{name:"Keys",type:"IList",description:"Sorted keys \u2014 also indexable by position."},{name:"Values",type:"IList",description:"Values in key-sorted order \u2014 also indexable by position."},{name:"this[object key]",type:"object?",description:"Indexer \u2014 O(log n). Set adds or overwrites; read returns null when missing."}],methods:[{name:"Add",signature:"Add(object key, object value) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(object key) \u2192 void",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"ContainsKey",signature:"ContainsKey(object key) \u2192 bool",complexity:"O(log n)"},{name:"ContainsValue",signature:"ContainsValue(object value) \u2192 bool",complexity:"O(n)"},{name:"GetKey",signature:"GetKey(int index) \u2192 object",complexity:"O(1)"},{name:"GetByIndex",signature:"GetByIndex(int index) \u2192 object",complexity:"O(1)"},{name:"IndexOfKey",signature:"IndexOfKey(object key) \u2192 int",complexity:"O(log n)"},{name:"IndexOfValue",signature:"IndexOfValue(object value) \u2192 int",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"lsl",label:"SortedList (legacy)",accent:"legacy"},{id:"sl",label:"SortedList<K,V>",accent:"generic"},{id:"sd",label:"SortedDictionary<K,V>",accent:"generic"}],rows:[{aspect:"Type safety",cells:{lsl:"None \u2014 object.",sl:"Generic \u2014 full.",sd:"Generic \u2014 full."}},{aspect:"Value types",cells:{lsl:"Boxed on Add.",sl:"Stored inline.",sd:"Stored inline."}},{aspect:"Lookup",cells:{lsl:"O(log n) + cast.",sl:"O(log n).",sd:"O(log n)."}},{aspect:"Add",cells:{lsl:"O(n).",sl:"O(n).",sd:"O(log n)."}},{aspect:"Best for",cells:{lsl:"Legacy code only.",sl:"Read-heavy ordered map.",sd:"Write-heavy ordered map."}}]},related:[{slug:"sorted-list"},{slug:"sorted-dictionary"},{slug:"hashtable"}]};var w={slug:"bit-array",name:"BitArray",namespace:"legacy",metaDescription:"System.Collections.BitArray \u2014 fixed-length array of bits packed into 32-bit words. Bitwise operations, sieves, flags. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"ok",label:"Memory-dense"},{variant:"warn",label:"Not thread-safe"},{variant:"ok",label:"Bitwise operators"},{variant:"neutral",label:"Fixed length"}],lead:"A fixed-length array of bits packed into 32-bit words \u2014 eight bits per byte, no boxing, bitwise And / Or / Xor / Not built in. Lives under System.Collections for historical reasons but earns its keep as the most memory-dense way to store boolean state in the BCL. Useful in modern code where bit-packed flags or sieves matter.",metrics:[{label:"Get / Set bit",value:"O(1)",note:"bit-mask into the word array"},{label:"And / Or / Xor",value:"O(n)",note:"word-by-word over both arrays"},{label:"Memory",value:"O(n)",note:"one bit per element [O(n / 32)]"}],whenToUse:"Reach for BitArray when storing thousands of booleans (flags, presence vectors, sieves) and memory matters \u2014 a bool[] uses one byte per entry, BitArray uses one bit. Use bool[] when speed of individual access dominates and the count is small; use HashSet<int> when the indices are sparse.",callout:{variant:"highlight",title:"A million booleans for 128 KB",body:"A BitArray of length 1,000,000 uses about 128 KB; a bool[] of the same length uses 1 MB. The cost of the bit-mask on each access is small, the saving is real. Sieves of Eratosthenes, presence sets keyed by small integers, hot-path flag arrays \u2014 all natural fits."},examples:[{caption:"Flags, sieves, bitwise ops",language:"csharp",source:`using System.Collections;

// Construct \u2014 length, plus an optional initial value
BitArray flags = new(length: 1024);                 // all false
BitArray seeded = new(length: 8, defaultValue: true);
BitArray fromBool = new(new[] { true, false, true });
BitArray fromBytes = new(new byte[] { 0b1010_1010 });

// Get / Set \u2014 O(1)
flags[3] = true;
bool b = flags[3];

// Bitwise \u2014 mutates in place, returns the receiver
BitArray a = new(new[] { true, false, true,  false });
BitArray b2 = new(new[] { true, true,  false, false });

a.And(b2);                                          // a = {1, 0, 0, 0}
a.Or(b2);                                           // a = {1, 1, 0, 0}
a.Xor(b2);                                          // a = {0, 0, 0, 0}
a.Not();                                            // a = {1, 1, 1, 1}

// Iterate \u2014 yields bool
foreach (bool bit in flags)
    if (bit) Console.WriteLine("set");

// Sieve of Eratosthenes \u2014 classic BitArray fit
static BitArray Sieve(int n)
{
    BitArray prime = new(n + 1, true);
    prime[0] = prime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (prime[i])
            for (int j = i * i; j <= n; j += i)
                prime[j] = false;
    return prime;
}`}],properties:[{name:"Length",type:"int",description:"Number of bits. Setting it grows or truncates."},{name:"Count",type:"int",description:"Same as Length \u2014 kept for ICollection."},{name:"this[int index]",type:"bool",description:"Indexer \u2014 O(1) get and set."}],methods:[{name:"Set",signature:"Set(int index, bool value) \u2192 void",complexity:"O(1)"},{name:"Get",signature:"Get(int index) \u2192 bool",complexity:"O(1)"},{name:"SetAll",signature:"SetAll(bool value) \u2192 void",complexity:"O(n / 32)"},{name:"And",signature:"And(BitArray value) \u2192 BitArray",complexity:"O(n)"},{name:"Or",signature:"Or(BitArray value) \u2192 BitArray",complexity:"O(n)"},{name:"Xor",signature:"Xor(BitArray value) \u2192 BitArray",complexity:"O(n)"},{name:"Not",signature:"Not() \u2192 BitArray",complexity:"O(n)"},{name:"HasAllSet",signature:"HasAllSet() \u2192 bool",complexity:"O(n)"},{name:"HasAnySet",signature:"HasAnySet() \u2192 bool",complexity:"O(n)"},{name:"CopyTo",signature:"CopyTo(Array array, int index) \u2192 void",complexity:"O(n)"},{name:"Clone",signature:"Clone() \u2192 object",complexity:"O(n)"}],comparison:{columns:[{id:"ba",label:"BitArray",accent:"legacy"},{id:"bool",label:"bool[]",accent:"primitive"},{id:"hs",label:"HashSet<int>",accent:"generic"}],rows:[{aspect:"Memory",cells:{ba:"~1 bit / element.",bool:"1 byte / element.",hs:"Bucket overhead per item."}},{aspect:"Get / Set",cells:{ba:"O(1) with bit-mask.",bool:"O(1) direct.",hs:"O(1) hash."}},{aspect:"Bitwise ops",cells:{ba:"And, Or, Xor, Not in place.",bool:"Manual loops.",hs:"IntersectWith / UnionWith / ExceptWith."}},{aspect:"Length",cells:{ba:"Resizable via Length set.",bool:"Fixed at allocation.",hs:"Sparse \u2014 items, not slots."}},{aspect:"Best for",cells:{ba:"Dense flags, sieves.",bool:"Small dense flag arrays.",hs:"Sparse integer presence sets."}}]},related:[{slug:"array"},{slug:"hash-set"},{slug:"list"}]};var S={slug:"string-collection",name:"StringCollection",namespace:"legacy",metaDescription:"System.Collections.Specialized.StringCollection \u2014 strongly-typed list of strings. Pre-generics convenience type; use List<string> in new code. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Specialized"},{variant:"neutral",label:"Since .NET 1.0"},{variant:"warn",label:"Pre-generics specialization"},{variant:"warn",label:"Not thread-safe"},{variant:"neutral",label:"Indexed"},{variant:"warn",label:"Avoid in new code"}],lead:"A list of string. Predates generics \u2014 when ArrayList was the only option, the BCL shipped a handful of typed-specialised collections (StringCollection, NameValueCollection) so callers could avoid casting. Today List<string> does the same thing better. Settings.Default.Properties exposes a StringCollection in the Windows Forms designer; that is roughly the only reason the type still appears in modern code.",metrics:[{label:"Add",value:"O(1) amortized",note:"doubles the backing array"},{label:"Index access",value:"O(1)",note:"returns string, no cast"},{label:"Insert / Remove at i",value:"O(n)",note:"shifts everything after i"}],whenToUse:"Reach for StringCollection only when the API you call returns one \u2014 Properties.Settings, certain configuration surfaces. For your own data, List<string> is the like-for-like replacement with the same big-O and a better surface.",examples:[{caption:"Typed list, no casts",language:"csharp",source:`using System.Collections.Specialized;

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
modern.Add("gamma");`}],properties:[{name:"Count",type:"int",description:"Number of strings."},{name:"this[int index]",type:"string?",description:"Indexer \u2014 O(1)."}],methods:[{name:"Add",signature:"Add(string value) \u2192 int",complexity:"O(1) amortized"},{name:"AddRange",signature:"AddRange(string[] value) \u2192 void",complexity:"O(k)"},{name:"Insert",signature:"Insert(int index, string value) \u2192 void",complexity:"O(n)"},{name:"Remove",signature:"Remove(string value) \u2192 void",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 void",complexity:"O(n)"},{name:"Contains",signature:"Contains(string value) \u2192 bool",complexity:"O(n)"},{name:"IndexOf",signature:"IndexOf(string value) \u2192 int",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"CopyTo",signature:"CopyTo(string[] array, int index) \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"sc",label:"StringCollection",accent:"legacy"},{id:"ls",label:"List<string>",accent:"generic"},{id:"arr",label:"string[]",accent:"primitive"}],rows:[{aspect:"Type safety",cells:{sc:"Specialised to string.",ls:"Generic \u2014 full.",arr:"Generic \u2014 full."}},{aspect:"Add",cells:{sc:"O(1) amortised.",ls:"O(1) amortised.",arr:"Not supported."}},{aspect:"Index access",cells:{sc:"O(1).",ls:"O(1).",arr:"O(1)."}},{aspect:"Resize",cells:{sc:"Grows on demand.",ls:"Grows on demand.",arr:"Fixed at allocation."}},{aspect:"Best for",cells:{sc:"Settings.Default surfaces.",ls:"The default string list.",arr:"Hot loops, fixed sizes."}}]},related:[{slug:"list"},{slug:"array-list"},{slug:"array"}]};var O={slug:"concurrent-dictionary",name:"ConcurrentDictionary<TKey, TValue>",namespace:"concurrent",metaDescription:"System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue> \u2014 striped-lock thread-safe hash table. Lock-free reads, fine-grained-locked writes. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Concurrent"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Lock-free reads"},{variant:"warn",label:"Atomic-update API"}],lead:"A thread-safe hash table designed for many concurrent readers and writers. Reads are lock-free; writes take a striped lock \u2014 only one of N internal locks (typically one per CPU core), so unrelated writes proceed in parallel. Reach for it whenever a Dictionary<K,V> would need a lock around it; the striped design almost always beats the global lock you would otherwise write.",metrics:[{label:"TryAdd / TryRemove",value:"O(1)",note:"one striped lock acquisition"},{label:"TryGetValue",value:"O(1)",note:"lock-free read of the bucket"},{label:"AddOrUpdate",value:"O(1)",note:"atomic compose, may retry on contention"}],whenToUse:"Reach for ConcurrentDictionary whenever the same hash map is touched from multiple threads \u2014 caches, in-memory indexes, accumulators in parallel pipelines. Stick to Dictionary<K,V> when only one thread mutates and reads happen on the same thread; the concurrent version costs more per operation in the single-threaded case.",callout:{variant:"note",title:"Use the atomic helpers, not the indexer",body:'TryAdd, TryRemove, AddOrUpdate, GetOrAdd, and TryUpdate are atomic against other writers. Reading via the indexer and then writing back is NOT \u2014 another thread can race you between the two. Whenever you find yourself writing "if it exists, change it; otherwise add it", reach for AddOrUpdate.'},diagram:{caption:"Striped locks",body:`  buckets   \u250C\u2500\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2500\u2510 ... \u250C\u2500\u2500\u2500\u2500\u2510
            \u2502  0 \u2502 \u2502  1 \u2502 \u2502  2 \u2502 \u2502  3 \u2502 \u2502  4 \u2502     \u2502 N-1\u2502
            \u2514\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2518     \u2514\u2500\u2500\u2500\u2500\u2518
                \u25B2      \u25B2      \u25B2      \u25B2
                \u2502      \u2502      \u2502      \u2502
            \u250C\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2510 \u250C\u2500\u2534\u2500\u2500\u2500\u2500\u2510 \u250C\u2500\u2534\u2500\u2500\u2500\u2500\u2510
  locks    \u2502 lock 0 \u2502 \u2502 lock 1\u2502 \u2502 lock 2\u2502  ...     \u2190 typically one per core
            \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

  Each bucket maps to one of N locks. Writers contend ONLY when they
  hash to the same lock. Readers never take a lock at all.`},examples:[{caption:"Atomic update patterns",language:"csharp",source:`using System.Collections.Concurrent;

ConcurrentDictionary<string, int> hits = new();
ConcurrentDictionary<string, int> sized = new(concurrencyLevel: 8, capacity: 1024);

// Try-form set / remove
bool added   = hits.TryAdd("home", 1);
bool removed = hits.TryRemove("home", out int oldValue);

// GetOrAdd \u2014 atomic "lazy initialise on first touch"
int counter = hits.GetOrAdd("hot-page", _ => 0);

// AddOrUpdate \u2014 atomic compose
hits.AddOrUpdate(
    key: "/about",
    addValue: 1,
    updateValueFactory: (_, existing) => existing + 1);

// TryUpdate \u2014 compare-and-swap, returns false if the existing value changed
bool swapped = hits.TryUpdate("/about", newValue: 100, comparisonValue: 1);

// Iterate \u2014 yields a SNAPSHOT of entries seen so far (not a live view)
foreach ((string key, int value) in hits)
    Console.WriteLine($"{key}: {value}");

// The DON'T pattern \u2014 racy
//   int n = hits["/about"];           \u2190 read
//   hits["/about"] = n + 1;           \u2190 write \u2014 another thread may have raced
// Use AddOrUpdate instead.

// Bulk-style snapshot to a Dictionary if you need a stable view
Dictionary<string, int> snapshot = hits.ToDictionary(kv => kv.Key, kv => kv.Value);`}],properties:[{name:"Count",type:"int",description:"Approximate item count. May briefly observe in-flight changes; takes all internal locks to compute."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check; avoids the all-locks cost of Count."},{name:"Keys",type:"ICollection<TKey>",description:"Snapshot of keys at the moment of the call. Not a live view."},{name:"Values",type:"ICollection<TValue>",description:"Snapshot of values at the moment of the call."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 set is atomic; combined read-and-write is NOT. Use AddOrUpdate / TryUpdate."}],methods:[{name:"TryAdd",signature:"TryAdd(TKey key, TValue value) \u2192 bool",complexity:"O(1)"},{name:"TryRemove",signature:"TryRemove(TKey key, out TValue value) \u2192 bool",complexity:"O(1)"},{name:"TryGetValue",signature:"TryGetValue(TKey, out TValue) \u2192 bool",complexity:"O(1)"},{name:"TryUpdate",signature:"TryUpdate(TKey key, TValue newValue, TValue comparisonValue) \u2192 bool",complexity:"O(1)"},{name:"GetOrAdd",signature:"GetOrAdd(TKey key, Func<TKey, TValue> factory) \u2192 TValue",complexity:"O(1)"},{name:"AddOrUpdate",signature:"AddOrUpdate(TKey, Func<TKey,TValue> add, Func<TKey,TValue,TValue> update) \u2192 TValue",complexity:"O(1)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 KeyValuePair<TKey, TValue>[]",complexity:"O(n)"}],comparison:{columns:[{id:"cd",label:"ConcurrentDictionary",accent:"concurrent"},{id:"d",label:"Dictionary<K,V> + lock",accent:"generic"},{id:"id",label:"ImmutableDictionary",accent:"immutable"},{id:"ht",label:"Hashtable.Synchronized",accent:"legacy"}],rows:[{aspect:"Locking",cells:{cd:"Striped \u2014 N internal locks.",d:"Single lock you write.",id:"None \u2014 values never change.",ht:"Single global lock."}},{aspect:"Reads",cells:{cd:"Lock-free.",d:"Take the shared lock.",id:"Lock-free.",ht:"Wait for the global lock."}},{aspect:"Writes scale",cells:{cd:"Linearly with cores.",d:"Single-writer at a time.",id:"Producer creates new instance.",ht:"Single-writer at a time."}},{aspect:"Atomic compose",cells:{cd:"AddOrUpdate, GetOrAdd, TryUpdate.",d:"You hand-roll inside the lock.",id:"SetItem returns new map.",ht:"You hand-roll inside the lock."}},{aspect:"Best for",cells:{cd:"Multi-writer hash maps.",d:"Single-thread or rare contention.",id:"Snapshot semantics.",ht:"Legacy code only."}}]},related:[{slug:"dictionary"},{slug:"concurrent-queue"},{slug:"concurrent-bag"},{slug:"immutable-dictionary"},{slug:"blocking-collection"}]};var C={slug:"concurrent-queue",name:"ConcurrentQueue<T>",namespace:"concurrent",metaDescription:"System.Collections.Concurrent.ConcurrentQueue<T> \u2014 lock-free FIFO queue using a linked list of segments. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Concurrent"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Lock-free"},{variant:"neutral",label:"FIFO"}],lead:"A lock-free FIFO queue built on a linked list of fixed-size segments. Enqueue and TryDequeue both use compare-and-swap rather than locks, so contention costs little even at high thread counts. The thread-safe drop-in for Queue<T>; the right answer when you have multiple producers, multiple consumers, or both.",metrics:[{label:"Enqueue",value:"O(1)",note:"CAS at the tail; allocates a new segment on segment overflow"},{label:"TryDequeue",value:"O(1)",note:"CAS at the head; returns false if empty"},{label:"TryPeek",value:"O(1)",note:"snapshot read of the head"}],whenToUse:"Reach for ConcurrentQueue whenever multiple threads append work and one or more threads drain it \u2014 log shipping, work pools, parallel pipelines. If consumers should BLOCK while empty, wrap a ConcurrentQueue inside a BlockingCollection<T>; ConcurrentQueue itself never blocks.",callout:{variant:"note",title:"Iteration is a moment-in-time snapshot",body:"foreach over a ConcurrentQueue takes a snapshot \u2014 items added after iteration began are not seen, items drained during iteration may or may not be seen. Useful for diagnostics; not the right way to drain a queue. Drain via repeated TryDequeue calls instead."},examples:[{caption:"Multiple producers, one consumer",language:"csharp",source:`using System.Collections.Concurrent;

ConcurrentQueue<string> jobs = new();

// Enqueue \u2014 many threads can call this concurrently
Parallel.For(0, 1_000, i => jobs.Enqueue($"job-{i}"));

// Drain \u2014 TryDequeue returns false when empty
while (jobs.TryDequeue(out string? job))
    Process(job);

// TryPeek \u2014 non-blocking; safe under concurrent writes
if (jobs.TryPeek(out string? next))
    Console.WriteLine($"next will be {next}");

// Snapshot iteration \u2014 diagnostic only
int approxCount = 0;
foreach (string j in jobs) approxCount++;

// Pattern: producer / consumer with a CancellationToken
async Task ConsumeAsync(ConcurrentQueue<string> q, CancellationToken ct)
{
    while (!ct.IsCancellationRequested)
    {
        if (q.TryDequeue(out string? job))
        {
            Process(job);
        }
        else
        {
            // No work \u2014 yield the thread before retrying
            await Task.Delay(10, ct);
        }
    }
}

void Process(string s) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Item count. Walks the segment chain \u2014 avoid in hot loops; prefer IsEmpty."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."}],methods:[{name:"Enqueue",signature:"Enqueue(T item) \u2192 void",complexity:"O(1)"},{name:"TryDequeue",signature:"TryDequeue(out T result) \u2192 bool",complexity:"O(1)"},{name:"TryPeek",signature:"TryPeek(out T result) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"CopyTo",signature:"CopyTo(T[] array, int index) \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"cq",label:"ConcurrentQueue<T>",accent:"concurrent"},{id:"q",label:"Queue<T> + lock",accent:"generic"},{id:"iq",label:"ImmutableQueue<T>",accent:"immutable"},{id:"block",label:"BlockingCollection<T>",accent:"concurrent"}],rows:[{aspect:"Backing",cells:{cq:"Linked segment chain.",q:"Circular array.",iq:"Two immutable stacks.",block:"Wraps any IProducerConsumerCollection."}},{aspect:"Synchronisation",cells:{cq:"Lock-free CAS.",q:"Single lock you write.",iq:"None \u2014 immutable.",block:"Built-in semaphore signalling."}},{aspect:"Empty behaviour",cells:{cq:"TryDequeue returns false.",q:"Throws.",iq:"Returns same queue.",block:"Take blocks; TryTake fails fast."}},{aspect:"Best for",cells:{cq:"Multi-writer FIFO.",q:"Single-thread FIFO.",iq:"Snapshot event sourcing.",block:"Producer-consumer with backpressure."}}]},related:[{slug:"queue"},{slug:"concurrent-stack"},{slug:"concurrent-bag"},{slug:"blocking-collection"},{slug:"immutable-queue"}]};var A={slug:"concurrent-stack",name:"ConcurrentStack<T>",namespace:"concurrent",metaDescription:"System.Collections.Concurrent.ConcurrentStack<T> \u2014 lock-free LIFO stack using a singly-linked list with compare-and-swap. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Concurrent"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Lock-free"},{variant:"neutral",label:"LIFO"}],lead:"A lock-free LIFO stack built as a singly-linked list with compare-and-swap on the head pointer. Push and TryPop allocate a node and swap; no locks, no global synchronisation. The thread-safe alternative to Stack<T> \u2014 useful for parallel work-stealing patterns and rare worker pools.",metrics:[{label:"Push",value:"O(1)",note:"allocate node + CAS on head"},{label:"TryPop",value:"O(1)",note:"CAS on head; returns false if empty"},{label:"PushRange",value:"O(k)",note:"links a chain of k items, single CAS"}],whenToUse:"Reach for ConcurrentStack when LIFO matters AND multiple threads push or pop. The most-recent-first ordering is what makes work-stealing worker pools efficient. For multi-producer FIFO use ConcurrentQueue; for unordered work pools where any item is fine, ConcurrentBag scales better.",callout:{variant:"warn",title:"Per-push allocation",body:"Every Push allocates a linked-list node \u2014 there is no array reuse. In tight hot loops this becomes GC pressure. PushRange amortises by linking k nodes with a single CAS at the head; reach for it whenever you have a batch ready."},examples:[{caption:"Lock-free LIFO",language:"csharp",source:`using System.Collections.Concurrent;

ConcurrentStack<int> work = new();
ConcurrentStack<int> seeded = new(new[] { 1, 2, 3 });

// Push \u2014 many threads can call this concurrently
Parallel.For(0, 1_000, work.Push);

// TryPop \u2014 returns false when empty
while (work.TryPop(out int item))
    Process(item);

// TryPeek \u2014 diagnostic; the value may be popped before you read it again
if (work.TryPeek(out int top))
    Console.WriteLine(top);

// Batch push \u2014 single CAS for k items, less GC pressure
int[] batch = { 10, 11, 12, 13 };
work.PushRange(batch);

// Batch pop \u2014 pulls multiple items in one call
int[] buffer = new int[16];
int popped = work.TryPopRange(buffer);
for (int i = 0; i < popped; i++)
    Process(buffer[i]);

void Process(int n) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Item count. Walks the linked list \u2014 prefer IsEmpty."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."}],methods:[{name:"Push",signature:"Push(T item) \u2192 void",complexity:"O(1)"},{name:"PushRange",signature:"PushRange(T[] items) \u2192 void",complexity:"O(k)"},{name:"TryPop",signature:"TryPop(out T result) \u2192 bool",complexity:"O(1)"},{name:"TryPopRange",signature:"TryPopRange(T[] items) \u2192 int",complexity:"O(k)"},{name:"TryPeek",signature:"TryPeek(out T result) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"}],comparison:{columns:[{id:"cs",label:"ConcurrentStack<T>",accent:"concurrent"},{id:"s",label:"Stack<T> + lock",accent:"generic"},{id:"is",label:"ImmutableStack<T>",accent:"immutable"},{id:"cb",label:"ConcurrentBag<T>",accent:"concurrent"}],rows:[{aspect:"Backing",cells:{cs:"Linked list with CAS.",s:"Resizing array.",is:"Cons list.",cb:"Thread-local stacks + steal list."}},{aspect:"Synchronisation",cells:{cs:"Lock-free CAS.",s:"Single lock you write.",is:"None \u2014 immutable.",cb:"Lock-free for owner; stealing locks."}},{aspect:"Allocation",cells:{cs:"One node per Push.",s:"Amortised zero on Push.",is:"One node per Push.",cb:"Mostly array-backed thread-locals."}},{aspect:"Order",cells:{cs:"LIFO across all threads.",s:"LIFO.",is:"LIFO across snapshots.",cb:"Unordered \u2014 best for work pools."}},{aspect:"Best for",cells:{cs:"Multi-writer LIFO, work-steal.",s:"Single-thread LIFO.",is:"Snapshot LIFO histories.",cb:"Unordered worker pools."}}]},related:[{slug:"stack"},{slug:"concurrent-queue"},{slug:"concurrent-bag"},{slug:"immutable-stack"}]};var x={slug:"concurrent-bag",name:"ConcurrentBag<T>",namespace:"concurrent",metaDescription:"System.Collections.Concurrent.ConcurrentBag<T> \u2014 thread-local stacks with work stealing. The fastest concurrent collection when order does not matter. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Concurrent"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Work-stealing"},{variant:"warn",label:"Unordered"}],lead:"An unordered, thread-safe collection optimised for the case where the same thread tends to add and take. Each thread gets its own internal stack; Add and TryTake on the local stack are nearly free. When a thread finds its own stack empty it steals from another thread\u2019s \u2014 the same work-stealing pattern that makes the .NET thread pool fast.",metrics:[{label:"Add (own thread)",value:"O(1)",note:"thread-local push, no contention"},{label:"TryTake (own)",value:"O(1)",note:"thread-local pop, no contention"},{label:"TryTake (steal)",value:"O(1)",note:"locks another thread\u2019s stack"}],whenToUse:"Reach for ConcurrentBag when ordering does not matter and threads tend to consume what they produce \u2014 object pools, parallel-for accumulators, scratch buffers reused across iterations. When ordering matters or producers are different from consumers, ConcurrentQueue is faster.",callout:{variant:"highlight",title:"Same-thread is free",body:"When a thread\u2019s local stack contains items, Add and TryTake do not touch any other thread\u2019s state \u2014 no atomics, no locks, no cache-line bouncing. Bag is the fastest concurrent collection in the BCL precisely because most accesses stay local. Cross-thread stealing has a cost; the design assumes it is the exception."},examples:[{caption:"Same-thread fast path",language:"csharp",source:`using System.Collections.Concurrent;

ConcurrentBag<byte[]> buffers = new();

// Object-pool pattern \u2014 each thread tends to reuse what it made
Parallel.For(0, 10_000, _ =>
{
    byte[] buf = buffers.TryTake(out byte[]? existing)
        ? existing
        : new byte[1024];

    DoWork(buf);

    buffers.Add(buf);                              // mostly returns to local stack
});

// Bulk accumulation in parallel
ConcurrentBag<int> primes = new();
Parallel.For(2, 1_000, n =>
{
    if (IsPrime(n)) primes.Add(n);
});

// Drain \u2014 order is unspecified
while (primes.TryTake(out int p))
    Console.WriteLine(p);

bool IsPrime(int n) { /* ... */ return true; }
void DoWork(byte[] b) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Approximate item count across all thread-local stacks."},{name:"IsEmpty",type:"bool",description:"True only when every thread-local stack is empty."}],methods:[{name:"Add",signature:"Add(T item) \u2192 void",complexity:"O(1)"},{name:"TryTake",signature:"TryTake(out T result) \u2192 bool",complexity:"O(1)"},{name:"TryPeek",signature:"TryPeek(out T result) \u2192 bool",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 void",complexity:"O(n)"},{name:"ToArray",signature:"ToArray() \u2192 T[]",complexity:"O(n)"},{name:"CopyTo",signature:"CopyTo(T[] array, int index) \u2192 void",complexity:"O(n)"}],comparison:{columns:[{id:"cb",label:"ConcurrentBag<T>",accent:"concurrent"},{id:"cq",label:"ConcurrentQueue<T>",accent:"concurrent"},{id:"cs",label:"ConcurrentStack<T>",accent:"concurrent"},{id:"cd",label:"ConcurrentDictionary",accent:"concurrent"}],rows:[{aspect:"Order",cells:{cb:"Unordered.",cq:"FIFO.",cs:"LIFO.",cd:"Unordered."}},{aspect:"Best access pattern",cells:{cb:"Same thread adds and takes.",cq:"Cross-thread enqueue/dequeue.",cs:"Cross-thread push/pop.",cd:"By-key access from any thread."}},{aspect:"Allocation",cells:{cb:"Thread-local stacks reuse memory.",cq:"Linked segments.",cs:"One node per Push.",cd:"Bucket arrays + entries."}},{aspect:"Best for",cells:{cb:"Object pools, scratch buffers.",cq:"Producer-consumer pipelines.",cs:"Multi-writer LIFO.",cd:"Multi-writer key-value maps."}}]},related:[{slug:"concurrent-queue"},{slug:"concurrent-stack"},{slug:"concurrent-dictionary"},{slug:"list"}]};var I={slug:"blocking-collection",name:"BlockingCollection<T>",namespace:"concurrent",metaDescription:"System.Collections.Concurrent.BlockingCollection<T> \u2014 producer-consumer wrapper around any IProducerConsumerCollection. Bounding, blocking, completion. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Concurrent"},{variant:"neutral",label:"Since .NET 4.0"},{variant:"ok",label:"Generic"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Bounding"},{variant:"ok",label:"Blocking semantics"}],lead:"A producer-consumer wrapper around any IProducerConsumerCollection \u2014 defaults to ConcurrentQueue. Add semaphore-based blocking on top: Add waits when bounded and full; Take waits when empty; CompleteAdding signals consumers that no more items are coming. The standard answer for synchronous producer-consumer patterns; modern code increasingly reaches for System.Threading.Channels instead, but BlockingCollection is still everywhere.",metrics:[{label:"Add",value:"O(1)",note:"blocks on bounded full; throws after CompleteAdding"},{label:"Take",value:"O(1)",note:"blocks while empty; throws when complete and drained"},{label:"TryAdd / TryTake",value:"O(1)",note:"fail-fast variants with optional timeout"}],whenToUse:"Reach for BlockingCollection in classic producer-consumer code that is synchronous (uses Take, GetConsumingEnumerable, threads \u2014 not Tasks). For async pipelines, System.Threading.Channels is the modern replacement: same shape, awaitable, no thread blocking. BlockingCollection still wins where threads are the unit and back-pressure is required.",callout:{variant:"note",title:"CompleteAdding is the shutdown signal",body:"After CompleteAdding, no further Add succeeds \u2014 but consumers can still drain remaining items. Once the underlying collection is empty, Take throws InvalidOperationException and IsCompleted becomes true. GetConsumingEnumerable handles all of this for you, which is why it\u2019s the recommended consumer pattern."},examples:[{caption:"Classic producer-consumer",language:"csharp",source:`using System.Collections.Concurrent;

// Default is unbounded queue-backed
BlockingCollection<string> jobs = new();

// Bounded queue \u2014 Add blocks when full
BlockingCollection<string> bounded = new(boundedCapacity: 100);

// Stack-backed \u2014 LIFO ordering
BlockingCollection<string> lifo = new(new ConcurrentStack<string>());

// Producer side
Task producer = Task.Run(() =>
{
    for (int i = 0; i < 1_000; i++)
        jobs.Add($"job-{i}");                       // blocks if bounded and full
    jobs.CompleteAdding();
});

// Consumer side \u2014 GetConsumingEnumerable is the idiomatic loop
Task consumer = Task.Run(() =>
{
    foreach (string job in jobs.GetConsumingEnumerable())
        Process(job);                                // exits when CompleteAdding + drained
});

await Task.WhenAll(producer, consumer);

// Try-form with timeout \u2014 useful for graceful shutdown
if (jobs.TryTake(out string? next, TimeSpan.FromSeconds(1)))
    Process(next);

// AddToAny / TakeFromAny \u2014 coordinate across multiple collections
BlockingCollection<int>[] queues = { new(), new() };
int idx = BlockingCollection<int>.TakeFromAny(queues, out int item);

void Process(string s) { /* ... */ }`}],properties:[{name:"Count",type:"int",description:"Items currently buffered in the underlying collection."},{name:"BoundedCapacity",type:"int",description:"Maximum capacity, or -1 when unbounded."},{name:"IsAddingCompleted",type:"bool",description:"True once CompleteAdding has been called."},{name:"IsCompleted",type:"bool",description:"True once CompleteAdding has been called AND the collection is empty."}],methods:[{name:"Add",signature:"Add(T item) \u2192 void",complexity:"O(1)"},{name:"TryAdd",signature:"TryAdd(T item, int millisecondsTimeout) \u2192 bool",complexity:"O(1)"},{name:"Take",signature:"Take() \u2192 T",complexity:"O(1)"},{name:"TryTake",signature:"TryTake(out T item, int millisecondsTimeout) \u2192 bool",complexity:"O(1)"},{name:"CompleteAdding",signature:"CompleteAdding() \u2192 void",complexity:"O(1)"},{name:"GetConsumingEnumerable",signature:"GetConsumingEnumerable() \u2192 IEnumerable<T>",complexity:"O(1)"},{name:"AddToAny",signature:"BlockingCollection<T>.AddToAny(BlockingCollection<T>[] cols, T item) \u2192 int",complexity:"O(k)"},{name:"TakeFromAny",signature:"BlockingCollection<T>.TakeFromAny(BlockingCollection<T>[] cols, out T item) \u2192 int",complexity:"O(k)"}],comparison:{columns:[{id:"bc",label:"BlockingCollection<T>",accent:"concurrent"},{id:"cq",label:"ConcurrentQueue<T>",accent:"concurrent"},{id:"ch",label:"Channel<T>",accent:"concurrent"},{id:"q",label:"Queue<T> + lock",accent:"generic"}],rows:[{aspect:"Style",cells:{bc:"Synchronous, thread-blocking.",cq:"Synchronous, non-blocking.",ch:"Async, awaitable.",q:"Synchronous, single-threaded."}},{aspect:"Empty Take",cells:{bc:"Blocks until item or completion.",cq:"TryDequeue returns false.",ch:"await returns when ready.",q:"Throws."}},{aspect:"Bounded",cells:{bc:"Optional via ctor.",cq:"No.",ch:"Bounded or unbounded.",q:"No."}},{aspect:"Completion",cells:{bc:"CompleteAdding signal.",cq:"No built-in.",ch:"Writer.Complete signal.",q:"No built-in."}},{aspect:"Best for",cells:{bc:"Thread-based producer-consumer.",cq:"High-throughput multi-writer FIFO.",ch:"Modern async pipelines.",q:"Single-thread FIFO."}}]},related:[{slug:"concurrent-queue"},{slug:"concurrent-stack"},{slug:"concurrent-bag"},{slug:"queue"}]};var L={slug:"immutable-array",name:"ImmutableArray<T>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableArray<T> \u2014 readonly struct wrapping a frozen T[]. O(1) read, O(n) every modification. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Struct \u2014 zero indirection"},{variant:"warn",label:"O(n) modifications"}],lead:'A readonly struct that wraps a frozen T[]. Reads are exactly as fast as a raw array \u2014 there is no indirection, no boxing, no allocation per access. The cost is on the write side: every "mutation" copies the entire backing array. The right immutable shape for read-heavy snapshots that are seldom rewritten.',metrics:[{label:"Index access",value:"O(1)",note:"direct offset, identical to T[]"},{label:"Add / SetItem",value:"O(n)",note:"allocates a new array and copies"},{label:"Slicing",value:"O(1)",note:"AsSpan, AsMemory \u2014 zero copy [O(1) View]"}],whenToUse:"Reach for ImmutableArray when the data is read often, modified rarely, and you want the closest possible cost to a regular array. Configuration loaded once at startup; operator results in a parallel pipeline; frozen views handed to many consumers. Use ImmutableList when modification frequency is meaningful \u2014 its tree structure makes Add and SetItem O(log n) instead of O(n).",callout:{variant:"highlight",title:"Pay nothing for reads",body:"ImmutableArray is a struct holding a single T[] reference. Indexer reads compile down to the same instructions as raw array access \u2014 no virtual calls, no enumerator allocation, no extra dereferences. If reads dominate and writes are rare, this is the immutable type whose read cost is invisible."},examples:[{caption:"Construct, read, rewrite",language:"csharp",source:`using System.Collections.Immutable;

// Construct \u2014 collection expression syntax (C# 12+)
ImmutableArray<int> nums = [1, 2, 3, 4, 5];
ImmutableArray<int> empty = [];
ImmutableArray<int> fromArray = ImmutableArray.Create(1, 2, 3);

// Read \u2014 same as a raw array
int third = nums[2];                                // 3
int len = nums.Length;

foreach (int n in nums)
    Console.WriteLine(n);

// "Mutations" return a new instance \u2014 original is unchanged
ImmutableArray<int> with99 = nums.Add(99);          // O(n) copy
ImmutableArray<int> swapped = nums.SetItem(0, 100); // O(n) copy
ImmutableArray<int> shorter = nums.RemoveAt(2);     // O(n) copy

// AsSpan / AsMemory \u2014 zero-cost views, often the right answer
Span<int> view = nums.AsSpan();                     // ReadOnly Span actually

// Builder pattern \u2014 many writes, ONE freeze
ImmutableArray<int>.Builder builder = ImmutableArray.CreateBuilder<int>();
for (int i = 0; i < 1_000; i++) builder.Add(i);
ImmutableArray<int> result = builder.ToImmutable();  // O(1) handoff`}],properties:[{name:"Length",type:"int",description:"Number of elements. Read from the wrapped array."},{name:"IsEmpty",type:"bool",description:"True when Length is 0."},{name:"IsDefault",type:"bool",description:"True when this is `default(ImmutableArray<T>)` \u2014 backing array is null. Calling members in this state throws; check before use when value originates from default-initialisation."},{name:"this[int index]",type:"T",description:"Indexer \u2014 O(1) read. Returns by value; cannot be assigned."}],methods:[{name:"Add",signature:"Add(T item) \u2192 ImmutableArray<T>",complexity:"O(n)"},{name:"AddRange",signature:"AddRange(IEnumerable<T> items) \u2192 ImmutableArray<T>",complexity:"O(n + k)"},{name:"Insert",signature:"Insert(int index, T item) \u2192 ImmutableArray<T>",complexity:"O(n)"},{name:"SetItem",signature:"SetItem(int index, T value) \u2192 ImmutableArray<T>",complexity:"O(n)"},{name:"RemoveAt",signature:"RemoveAt(int index) \u2192 ImmutableArray<T>",complexity:"O(n)"},{name:"Remove",signature:"Remove(T item) \u2192 ImmutableArray<T>",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 ImmutableArray<T>",complexity:"O(1)"},{name:"AsSpan",signature:"AsSpan() \u2192 ReadOnlySpan<T>",complexity:"O(1)"},{name:"AsMemory",signature:"AsMemory() \u2192 ReadOnlyMemory<T>",complexity:"O(1)"},{name:"IndexOf",signature:"IndexOf(T item) \u2192 int",complexity:"O(n)"},{name:"BinarySearch",signature:"BinarySearch(T value) \u2192 int",complexity:"O(log n)"},{name:"ToBuilder",signature:"ToBuilder() \u2192 ImmutableArray<T>.Builder",complexity:"O(n)"}],comparison:{columns:[{id:"ia",label:"ImmutableArray<T>",accent:"immutable"},{id:"il",label:"ImmutableList<T>",accent:"immutable"},{id:"arr",label:"T[]",accent:"primitive"},{id:"list",label:"List<T>",accent:"generic"}],rows:[{aspect:"Backing",cells:{ia:"A frozen T[].",il:"AVL tree of segments.",arr:"A T[].",list:"A T[] it owns."}},{aspect:"Read",cells:{ia:"O(1) \u2014 same as array.",il:"O(log n).",arr:"O(1).",list:"O(1)."}},{aspect:"Write",cells:{ia:"O(n) \u2014 full copy.",il:"O(log n) \u2014 path copy.",arr:"O(1) in place.",list:"O(1) amortised at end."}},{aspect:"Allocation per write",cells:{ia:"New array.",il:"Path of nodes.",arr:"None.",list:"None until resize."}},{aspect:"Best for",cells:{ia:"Read-heavy snapshots.",il:"Modification-friendly snapshots.",arr:"Owned mutable storage.",list:"The default ordered list."}}]},related:[{slug:"immutable-list"},{slug:"array"},{slug:"list"},{slug:"span"},{slug:"memory"}]};var E={slug:"immutable-list",name:"ImmutableList<T>",namespace:"primitive",metaDescription:"System.Collections.Immutable.ImmutableList<T> \u2014 persistent ordered list backed by an AVL tree. O(log n) access/mutation. Optimized for structural sharing.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:".NET 10 / C# 14"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Structural Sharing"},{variant:"warn",label:"O(log n) Reads"}],lead:"A persistent ordered list backed by a self-balancing AVL tree of segments. Every operation is O(log n) \u2014 including index access. Each modification produces a new list that shares unchanged segments with its predecessor, ensuring memory efficiency across snapshots.",metrics:[{label:"Index access",value:"O(log n)",note:"tree traversal"},{label:"Add / Insert",value:"O(log n)",note:"returns new list + rebalance"},{label:"SetItem",value:"O(log n)",note:"path copy, shared subtrees"}],whenToUse:'Use ImmutableList when you need frequent snapshots or "undo" history where O(n) array copies are too expensive. If your data is 95% reads and small enough to copy, use ImmutableArray instead.',callout:{variant:"note",title:"Performance Tip: Builders",body:"Batching matters. When making multiple writes, use `ToBuilder()`. It allows mutation in-place and converts back to an ImmutableList in O(1) time by freezing the final tree structure."},diagram:{caption:"Structural sharing on insertion",body:`  List A          List B = A.Insert(2, "X")
    \u250C\u2500\u2510                \u250C\u2500\u2510
    \u2502R\u2502                \u2502R'\u2502     R' is a new root
    \u2514\u252C\u2518                \u2514\u252C\u2518
   \u250C\u2500\u2534\u2500\u2500\u2510             \u250C\u2500\u2534\u2500\u2500\u2510
   \u25BC    \u25BC             \u25BC    \u25BC
  \u250C\u2500\u2510  \u250C\u2500\u2510           \u250C\u2500\u2510  \u250C\u2500\u2510   Only L' is new;
  \u2502L\u2502  \u2502R\u2502           \u2502L'\u2502 \u2502R\u2502   R is shared by ref.
  \u2514\u2500\u2518  \u2514\u2500\u2518           \u2514\u2500\u2518  \u2514\u2500\u2518`},examples:[{caption:"Snapshots and Builders",language:"csharp",source:`using System.Collections.Immutable;

// 1. Immutable modification
var list = ImmutableList.Create(1, 2, 3);
var next = list.Add(4); // list is still [1, 2, 3]

// 2. High-performance batching
var builder = list.ToBuilder();
for(int i = 0; i < 100; i++) builder.Add(i);
var finalized = builder.ToImmutable(); // O(1) handoff`}],properties:[{name:"Count",type:"int",description:"Total elements in the tree."},{name:"IsEmpty",type:"bool",description:"True if root is null."},{name:"this[int]",type:"T",description:"O(log n) access via tree traversal."}],methods:[{name:"Add",signature:"Add(T value)",complexity:"O(log n)"},{name:"AddRange",signature:"AddRange(IEnumerable<T>)",complexity:"O(log n)"},{name:"Insert",signature:"Insert(int, T)",complexity:"O(log n)"},{name:"SetItem",signature:"SetItem(int, T)",complexity:"O(log n)"},{name:"RemoveAt",signature:"RemoveAt(int)",complexity:"O(log n)"},{name:"ToBuilder",signature:"ToBuilder()",complexity:"O(1)"}],comparison:{columns:[{id:"il",label:"ImmutableList",accent:"immutable"},{id:"ia",label:"ImmutableArray",accent:"immutable"},{id:"list",label:"List<T>",accent:"generic"}],rows:[{aspect:"Backing",cells:{il:"AVL Tree",ia:"Array",list:"Array"}},{aspect:"Read",cells:{il:"O(log n)",ia:"O(1)",list:"O(1)"}},{aspect:"Write",cells:{il:"O(log n)",ia:"O(n)",list:"O(1)"}},{aspect:"Sharing",cells:{il:"Yes",ia:"No",list:"N/A"}}]},related:[{slug:"immutable-array"},{slug:"list"},{slug:"immutable-dictionary"}]};var R={slug:"immutable-dictionary",name:"ImmutableDictionary<TKey, TValue>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableDictionary<TKey, TValue> \u2014 persistent unordered map backed by a HAMT (hash array mapped trie). O(log n) for everything. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"HAMT \u2014 fast in practice"},{variant:"warn",label:"Unordered"}],lead:"A persistent unordered key-value map backed by a hash array mapped trie (HAMT). Add, lookup, and remove are all O(log n) but with very small constants \u2014 in practice the trie depth is bounded near 6, so reads behave close to O(1). Each modification returns a new dictionary that shares unchanged subtries with its predecessor.",metrics:[{label:"Add",value:"O(log n)",note:"returns a new map; trie depth ~6 in practice"},{label:"Lookup",value:"O(log n)",note:"one hash, one trie walk"},{label:"Remove",value:"O(log n)",note:"returns a new map; subtrees mostly shared"}],whenToUse:"Reach for ImmutableDictionary whenever a key-value snapshot must remain valid even as new versions are produced \u2014 configuration with hot-reload, view models flowing through a pipeline, time-travel state in a Redux-style store. Use ConcurrentDictionary when many threads mutate the SAME map; use Dictionary when only one thread mutates and snapshots aren\u2019t needed.",callout:{variant:"note",title:"Builders for batched writes",body:"A loop of SetItem calls allocates a new path per call. Use ToBuilder when you have a batch of changes \u2014 the builder mutates internally, then ToImmutable hands off the result with structural sharing intact. Performance gap is dramatic for k operations: O(k log n) vs O(k log n) with much smaller constants and fewer allocations."},examples:[{caption:"Snapshots and updates",language:"csharp",source:`using System.Collections.Immutable;

// Construct
ImmutableDictionary<string, int> empty = ImmutableDictionary<string, int>.Empty;
ImmutableDictionary<string, int> a = empty
    .Add("one",   1)
    .Add("two",   2)
    .Add("three", 3);

// Lookup \u2014 returns new dictionary on writes
bool found = a.TryGetValue("one", out int n);       // n = 1
int    val = a["two"];                               // 2
bool   has = a.ContainsKey("three");

// Modifications return new instances
ImmutableDictionary<string, int> b = a.SetItem("one", 11);
ImmutableDictionary<string, int> c = b.Remove("two");

// Builder for batches
ImmutableDictionary<string, int>.Builder builder = a.ToBuilder();
for (int i = 0; i < 1_000; i++)
    builder["key-" + i] = i;
ImmutableDictionary<string, int> bulk = builder.ToImmutable();

// Custom comparer \u2014 case-insensitive keys
ImmutableDictionary<string, int> ci =
    ImmutableDictionary.Create<string, int>(StringComparer.OrdinalIgnoreCase)
        .Add("Hello", 1);

// Iteration \u2014 order is unspecified (HAMT walk order)
foreach ((string key, int value) in a)
    Console.WriteLine($"{key} \u2192 {value}");`}],properties:[{name:"Count",type:"int",description:"Number of pairs in the map."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."},{name:"Keys",type:"IEnumerable<TKey>",description:"Unordered view of keys; safe to enumerate while other threads hold their own snapshots."},{name:"Values",type:"IEnumerable<TValue>",description:"Unordered view of values."},{name:"KeyComparer",type:"IEqualityComparer<TKey>",description:"Key equality comparer in use."},{name:"ValueComparer",type:"IEqualityComparer<TValue>",description:"Value equality comparer for SetItem no-op detection."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(log n) read. Throws KeyNotFoundException on miss; the map cannot be assigned via the indexer."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 ImmutableDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"SetItem",signature:"SetItem(TKey key, TValue value) \u2192 ImmutableDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"Remove",signature:"Remove(TKey key) \u2192 ImmutableDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"TryGetValue",signature:"TryGetValue(TKey key, out TValue value) \u2192 bool",complexity:"O(log n)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(log n)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 ImmutableDictionary<TKey, TValue>",complexity:"O(1)"},{name:"ToBuilder",signature:"ToBuilder() \u2192 ImmutableDictionary<TKey, TValue>.Builder",complexity:"O(1)"},{name:"WithComparers",signature:"WithComparers(IEqualityComparer<TKey>?, IEqualityComparer<TValue>?) \u2192 ImmutableDictionary<TKey, TValue>",complexity:"O(n)"}],comparison:{columns:[{id:"id",label:"ImmutableDictionary",accent:"immutable"},{id:"isd",label:"ImmutableSortedDictionary",accent:"immutable"},{id:"d",label:"Dictionary<K,V>",accent:"generic"},{id:"cd",label:"ConcurrentDictionary",accent:"concurrent"}],rows:[{aspect:"Backing",cells:{id:"HAMT.",isd:"AVL tree.",d:"Hash table.",cd:"Striped hash table."}},{aspect:"Add / Lookup",cells:{id:"O(log n) \u2014 small constants.",isd:"O(log n).",d:"O(1) average.",cd:"O(1) average, lock-free reads."}},{aspect:"Order",cells:{id:"Unordered.",isd:"Sorted by key.",d:"Insertion order on iter.",cd:"Unordered."}},{aspect:"Mutation",cells:{id:"Returns new instance.",isd:"Returns new instance.",d:"In place.",cd:"In place."}},{aspect:"Best for",cells:{id:"Snapshot key-value state.",isd:"Snapshot ordered map.",d:"The default map.",cd:"Multi-writer maps."}}]},related:[{slug:"immutable-sorted-dictionary"},{slug:"dictionary"},{slug:"concurrent-dictionary"},{slug:"immutable-hash-set"}]};var q={slug:"immutable-sorted-dictionary",name:"ImmutableSortedDictionary<TKey, TValue>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableSortedDictionary<TKey, TValue> \u2014 persistent ordered map backed by an AVL tree. O(log n) for everything. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"Sorted by key"},{variant:"ok",label:"AVL tree"}],lead:"A persistent ordered key-value map backed by an AVL tree. Every operation is O(log n); iteration is in key order. Each modification returns a new dictionary that shares unchanged subtrees with the predecessor \u2014 same shape as ImmutableSortedSet, with a value attached to each key.",metrics:[{label:"Add",value:"O(log n)",note:"tree rotation; returns a new map"},{label:"Lookup",value:"O(log n)",note:"descend the tree"},{label:"Iteration",value:"O(n)",note:"in-order traversal, sorted"}],whenToUse:"Reach for ImmutableSortedDictionary when ordered iteration matters AND snapshots must stay valid as new versions are produced \u2014 sorted views in a UI that flow through pipelines, key-ordered audit logs that retain history, time-series caches keyed by timestamp. Use ImmutableDictionary when order doesn\u2019t matter; use SortedDictionary when no snapshots are needed.",callout:{variant:"note",title:"Custom comparers via WithComparers",body:"The default comparer is Comparer<TKey>.Default. To re-key by a custom order \u2014 case-insensitive strings, reverse numeric, locale-aware sorts \u2014 call WithComparers and pass an IComparer<TKey>. The result is a new map; the operation is O(n) because the tree must be rebuilt under the new order."},examples:[{caption:"Sorted snapshots",language:"csharp",source:`using System.Collections.Immutable;

ImmutableSortedDictionary<string, int> empty =
    ImmutableSortedDictionary<string, int>.Empty;

ImmutableSortedDictionary<string, int> a = empty
    .Add("Linus", 54)
    .Add("Ada",   36)
    .Add("Grace", 85);

// Iteration is sorted by key
foreach ((string name, int years) in a)
    Console.WriteLine($"{name}: {years}");
// Ada, Grace, Linus

// SetItem \u2014 overwrite or add
ImmutableSortedDictionary<string, int> b = a.SetItem("Ada", 37);

// Remove returns a new map
ImmutableSortedDictionary<string, int> c = b.Remove("Linus");

// Builder pattern for batches
ImmutableSortedDictionary<string, int>.Builder builder = a.ToBuilder();
for (int i = 0; i < 1_000; i++)
    builder["key-" + i] = i;
ImmutableSortedDictionary<string, int> bulk = builder.ToImmutable();

// Custom comparer \u2014 reverse alphabetical
ImmutableSortedDictionary<string, int> rev =
    ImmutableSortedDictionary
        .Create<string, int>(Comparer<string>.Create((x, y) => y.CompareTo(x)))
        .AddRange(a);`}],properties:[{name:"Count",type:"int",description:"Number of pairs."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."},{name:"Keys",type:"IEnumerable<TKey>",description:"Sorted view of keys."},{name:"Values",type:"IEnumerable<TValue>",description:"Values in key-sorted order."},{name:"KeyComparer",type:"IComparer<TKey>",description:"Key order comparer in use."},{name:"ValueComparer",type:"IEqualityComparer<TValue>",description:"Value equality comparer for SetItem no-op detection."},{name:"this[TKey key]",type:"TValue",description:"Indexer \u2014 O(log n) read. Throws KeyNotFoundException on miss; cannot be assigned."}],methods:[{name:"Add",signature:"Add(TKey key, TValue value) \u2192 ImmutableSortedDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"SetItem",signature:"SetItem(TKey key, TValue value) \u2192 ImmutableSortedDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"Remove",signature:"Remove(TKey key) \u2192 ImmutableSortedDictionary<TKey, TValue>",complexity:"O(log n)"},{name:"TryGetValue",signature:"TryGetValue(TKey key, out TValue value) \u2192 bool",complexity:"O(log n)"},{name:"ContainsKey",signature:"ContainsKey(TKey key) \u2192 bool",complexity:"O(log n)"},{name:"ContainsValue",signature:"ContainsValue(TValue value) \u2192 bool",complexity:"O(n)"},{name:"Clear",signature:"Clear() \u2192 ImmutableSortedDictionary<TKey, TValue>",complexity:"O(1)"},{name:"ToBuilder",signature:"ToBuilder() \u2192 ImmutableSortedDictionary<TKey, TValue>.Builder",complexity:"O(1)"},{name:"WithComparers",signature:"WithComparers(IComparer<TKey>?, IEqualityComparer<TValue>?) \u2192 ImmutableSortedDictionary<TKey, TValue>",complexity:"O(n)"}],comparison:{columns:[{id:"isd",label:"ImmutableSortedDictionary",accent:"immutable"},{id:"id",label:"ImmutableDictionary",accent:"immutable"},{id:"sd",label:"SortedDictionary<K,V>",accent:"generic"},{id:"d",label:"Dictionary<K,V>",accent:"generic"}],rows:[{aspect:"Backing",cells:{isd:"AVL tree, persistent.",id:"HAMT, persistent.",sd:"AVL tree.",d:"Hash table."}},{aspect:"Add / Lookup",cells:{isd:"O(log n).",id:"O(log n) \u2014 small constants.",sd:"O(log n).",d:"O(1) average."}},{aspect:"Order",cells:{isd:"Sorted by key.",id:"Unordered.",sd:"Sorted by key.",d:"Insertion order on iter."}},{aspect:"Snapshots",cells:{isd:"Each version stays valid.",id:"Each version stays valid.",sd:"No \u2014 mutates in place.",d:"No."}},{aspect:"Best for",cells:{isd:"Snapshot ordered map.",id:"Snapshot key-value state.",sd:"Single-thread ordered.",d:"The default map."}}]},related:[{slug:"immutable-dictionary"},{slug:"sorted-dictionary"},{slug:"immutable-sorted-set"},{slug:"dictionary"}]};var D={slug:"immutable-hash-set",name:"ImmutableHashSet<T>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableHashSet<T> \u2014 persistent set backed by a HAMT. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"HAMT"},{variant:"warn",label:"Unordered"}],lead:"A persistent unordered set backed by a hash array mapped trie. Add, Contains, and Remove are O(log n) with very small constants. Set algebra operations (Union, Intersect, Except) return new sets with maximum structural sharing \u2014 the unchanged elements are not re-allocated.",metrics:[{label:"Add",value:"O(log n)",note:"returns new set; subtrie copy on path"},{label:"Contains",value:"O(log n)",note:"one hash, one trie walk"},{label:"Remove",value:"O(log n)",note:"returns new set; mostly shared"}],whenToUse:"Reach for ImmutableHashSet when membership snapshots must persist as new versions form \u2014 feature flag sets that flow through middleware, allow-lists handed across modules, deduped accumulators in functional pipelines. Use HashSet when the same thread mutates and no snapshot is needed.",callout:{variant:"note",title:"Set algebra produces new sets, cheaply",body:"Union, Intersect, and Except each return a new ImmutableHashSet that structurally shares as much of both inputs as possible. A union with one element added is essentially Add; a large intersection still walks the smaller side once. The cost is honest, the result is reusable forever."},examples:[{caption:"Snapshot membership",language:"csharp",source:`using System.Collections.Immutable;

ImmutableHashSet<string> empty = ImmutableHashSet<string>.Empty;
ImmutableHashSet<string> a = empty
    .Add("alpha")
    .Add("beta")
    .Add("gamma");

// Contains \u2014 O(log n)
bool has = a.Contains("alpha");

// Add returns new set; original unchanged
ImmutableHashSet<string> b = a.Add("delta");

// Set algebra \u2014 every result is a new set
ImmutableHashSet<string> u = a.Union(new[] { "delta", "epsilon" });
ImmutableHashSet<string> i = a.Intersect(new[] { "alpha", "zeta" });   // {alpha}
ImmutableHashSet<string> x = a.Except(new[] { "beta" });                // {alpha, gamma}

// Custom comparer \u2014 case-insensitive
ImmutableHashSet<string> ci =
    ImmutableHashSet.Create<string>(StringComparer.OrdinalIgnoreCase)
        .Add("Hello")
        .Add("HELLO");                                                    // dedupes to one entry

// Builder for batched writes
ImmutableHashSet<string>.Builder builder = a.ToBuilder();
foreach (string s in LoadAllowList())
    builder.Add(s);
ImmutableHashSet<string> result = builder.ToImmutable();

IEnumerable<string> LoadAllowList() => new[] { "x", "y" };`}],properties:[{name:"Count",type:"int",description:"Number of items."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."},{name:"KeyComparer",type:"IEqualityComparer<T>",description:"Equality comparer in use."}],methods:[{name:"Add",signature:"Add(T item) \u2192 ImmutableHashSet<T>",complexity:"O(log n)"},{name:"Remove",signature:"Remove(T item) \u2192 ImmutableHashSet<T>",complexity:"O(log n)"},{name:"Contains",signature:"Contains(T item) \u2192 bool",complexity:"O(log n)"},{name:"Union",signature:"Union(IEnumerable<T> other) \u2192 ImmutableHashSet<T>",complexity:"O(k log n)"},{name:"Intersect",signature:"Intersect(IEnumerable<T> other) \u2192 ImmutableHashSet<T>",complexity:"O(min(n,k) log n)"},{name:"Except",signature:"Except(IEnumerable<T> other) \u2192 ImmutableHashSet<T>",complexity:"O(k log n)"},{name:"SymmetricExcept",signature:"SymmetricExcept(IEnumerable<T> other) \u2192 ImmutableHashSet<T>",complexity:"O(k log n)"},{name:"IsSubsetOf",signature:"IsSubsetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(n + k)"},{name:"IsSupersetOf",signature:"IsSupersetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(k log n)"},{name:"Overlaps",signature:"Overlaps(IEnumerable<T> other) \u2192 bool",complexity:"O(k log n)"},{name:"Clear",signature:"Clear() \u2192 ImmutableHashSet<T>",complexity:"O(1)"},{name:"ToBuilder",signature:"ToBuilder() \u2192 ImmutableHashSet<T>.Builder",complexity:"O(1)"},{name:"WithComparer",signature:"WithComparer(IEqualityComparer<T>?) \u2192 ImmutableHashSet<T>",complexity:"O(n)"}],comparison:{columns:[{id:"ihs",label:"ImmutableHashSet<T>",accent:"immutable"},{id:"iss",label:"ImmutableSortedSet<T>",accent:"immutable"},{id:"hs",label:"HashSet<T>",accent:"generic"}],rows:[{aspect:"Backing",cells:{ihs:"HAMT, persistent.",iss:"AVL tree, persistent.",hs:"Hash table."}},{aspect:"Add",cells:{ihs:"O(log n) \u2014 small constants.",iss:"O(log n).",hs:"O(1) average."}},{aspect:"Order",cells:{ihs:"Unordered.",iss:"Sorted.",hs:"Insertion order on iter."}},{aspect:"Snapshot",cells:{ihs:"Each version stays valid.",iss:"Each version stays valid.",hs:"Mutates in place."}},{aspect:"Best for",cells:{ihs:"Snapshot membership sets.",iss:"Snapshot ordered sets.",hs:"Single-thread membership."}}]},related:[{slug:"immutable-sorted-set"},{slug:"hash-set"},{slug:"immutable-dictionary"}]};var N={slug:"immutable-sorted-set",name:"ImmutableSortedSet<T>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableSortedSet<T> \u2014 persistent ordered set backed by an AVL tree. O(log n) Add/Contains/Remove. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"AVL tree"},{variant:"ok",label:"O(log n) by index"}],lead:"A persistent ordered set backed by an AVL tree. Add, Contains, and Remove are O(log n); iteration walks in order. Unique among the immutable collections, the tree carries subtree counts, so accessing the i-th element is O(log n) via an indexer \u2014 sorted snapshots that double as indexable sequences.",metrics:[{label:"Add",value:"O(log n)",note:"rotation + path copy"},{label:"Contains",value:"O(log n)",note:"descend the tree"},{label:"Indexer",value:"O(log n)",note:"subtree counts make rank lookup logarithmic"}],whenToUse:"Reach for ImmutableSortedSet when ordered membership matters AND snapshots must persist \u2014 sorted leaderboards passed across modules, range views shared between threads, time-windowed audit sets. Use SortedSet when no snapshot is needed; use ImmutableHashSet when ordering doesn\u2019t matter.",callout:{variant:"highlight",title:"Indexable sorted set",body:"ImmutableSortedSet exposes an indexer \u2014 set[42] returns the 42nd element in sorted order, O(log n). The AVL nodes carry subtree sizes so rank queries are logarithmic. No other immutable collection in the BCL gives you sorted indexing without first materialising to a list."},examples:[{caption:"Sorted, ranged, indexable",language:"csharp",source:`using System.Collections.Immutable;

ImmutableSortedSet<int> empty = ImmutableSortedSet<int>.Empty;
ImmutableSortedSet<int> a = empty
    .Add(7).Add(2).Add(9).Add(4).Add(1);

// Iteration is sorted
foreach (int n in a) Console.WriteLine(n);          // 1, 2, 4, 7, 9

// Sorted-set indexer \u2014 unique to this type
int third = a[2];                                   // 4

// Min and Max \u2014 both O(log n)
int min = a.Min;
int max = a.Max;

// Range view \u2014 like SortedSet.GetViewBetween
ImmutableSortedSet<int> mid = a.Range(3, 8);        // {4, 7}

// Set algebra returns new sets
ImmutableSortedSet<int> b = a.Union(new[] { 5, 6 });
ImmutableSortedSet<int> c = a.Intersect(new[] { 4, 7, 100 });

// Reverse \u2014 lazy enumerable, not a new set
foreach (int n in a.Reverse())
    Console.WriteLine(n);

// Custom comparer \u2014 descending integers
ImmutableSortedSet<int> desc =
    ImmutableSortedSet.Create<int>(Comparer<int>.Create((x, y) => y.CompareTo(x)))
        .Union(a);`}],properties:[{name:"Count",type:"int",description:"Number of items."},{name:"IsEmpty",type:"bool",description:"Cheap emptiness check."},{name:"Min",type:"T",description:"Smallest element. O(log n)."},{name:"Max",type:"T",description:"Largest element. O(log n)."},{name:"KeyComparer",type:"IComparer<T>",description:"Order comparer in use."},{name:"this[int index]",type:"T",description:"Sorted-set indexer \u2014 O(log n) by rank."}],methods:[{name:"Add",signature:"Add(T value) \u2192 ImmutableSortedSet<T>",complexity:"O(log n)"},{name:"Remove",signature:"Remove(T value) \u2192 ImmutableSortedSet<T>",complexity:"O(log n)"},{name:"Contains",signature:"Contains(T value) \u2192 bool",complexity:"O(log n)"},{name:"Range",signature:"Range(T fromValue, T toValue) \u2192 ImmutableSortedSet<T>",complexity:"O(log n)"},{name:"Reverse",signature:"Reverse() \u2192 IEnumerable<T>",complexity:"O(1)"},{name:"Union",signature:"Union(IEnumerable<T> other) \u2192 ImmutableSortedSet<T>",complexity:"O(k log n)"},{name:"Intersect",signature:"Intersect(IEnumerable<T> other) \u2192 ImmutableSortedSet<T>",complexity:"O(min(n,k) log n)"},{name:"Except",signature:"Except(IEnumerable<T> other) \u2192 ImmutableSortedSet<T>",complexity:"O(k log n)"},{name:"IsSubsetOf",signature:"IsSubsetOf(IEnumerable<T> other) \u2192 bool",complexity:"O(n + k)"},{name:"Clear",signature:"Clear() \u2192 ImmutableSortedSet<T>",complexity:"O(1)"},{name:"ToBuilder",signature:"ToBuilder() \u2192 ImmutableSortedSet<T>.Builder",complexity:"O(1)"},{name:"WithComparer",signature:"WithComparer(IComparer<T>?) \u2192 ImmutableSortedSet<T>",complexity:"O(n)"}],comparison:{columns:[{id:"iss",label:"ImmutableSortedSet<T>",accent:"immutable"},{id:"ihs",label:"ImmutableHashSet<T>",accent:"immutable"},{id:"ss",label:"SortedSet<T>",accent:"generic"}],rows:[{aspect:"Backing",cells:{iss:"AVL tree, persistent.",ihs:"HAMT, persistent.",ss:"Red-black tree."}},{aspect:"Add",cells:{iss:"O(log n) \u2014 returns new.",ihs:"O(log n) \u2014 returns new.",ss:"O(log n) in place."}},{aspect:"Order",cells:{iss:"Sorted.",ihs:"Unordered.",ss:"Sorted."}},{aspect:"Indexable",cells:{iss:"Yes \u2014 O(log n) by rank.",ihs:"No.",ss:"No."}},{aspect:"Best for",cells:{iss:"Snapshot ordered sets.",ihs:"Snapshot membership sets.",ss:"Single-thread ordered."}}]},related:[{slug:"immutable-hash-set"},{slug:"sorted-set"},{slug:"immutable-sorted-dictionary"}]};var P={slug:"immutable-queue",name:"ImmutableQueue<T>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableQueue<T> \u2014 persistent FIFO queue using two immutable stacks. O(1) Enqueue, O(1) amortised Dequeue. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"O(1) Enqueue"},{variant:"neutral",label:"FIFO"}],lead:"A persistent FIFO queue built from two immutable stacks \u2014 one for incoming items, one for outgoing. Enqueue pushes onto the in-stack; Dequeue pops from the out-stack, reversing the in-stack into it on demand. Result: O(1) Enqueue, O(1) amortised Dequeue, full immutability, every version stays valid.",metrics:[{label:"Enqueue",value:"O(1)",note:"pushes onto the in-stack; returns new queue"},{label:"Dequeue",value:"O(1) amortized",note:"rebalances when out-stack empties"},{label:"Peek",value:"O(1) amortized",note:"reads the head of out-stack; rebalances if needed"}],whenToUse:"Reach for ImmutableQueue when FIFO ordering matters AND every snapshot must remain valid \u2014 event-sourced state machines, audit trails replayed in order, message logs that flow across module boundaries. Use Queue when single-threaded; ConcurrentQueue when many threads share the SAME queue.",callout:{variant:"note",title:"Two-stack rebalance is the trick",body:"Imagine pushing onto stack-in and popping from stack-out. When stack-out is empty, transfer everything from stack-in to stack-out by popping from one and pushing to the other \u2014 that single transfer is O(n) but happens once for each item enqueued. Average it out: each item touches the rebalance once, so amortised cost stays O(1)."},examples:[{caption:"Persistent FIFO",language:"csharp",source:`using System.Collections.Immutable;

ImmutableQueue<string> empty = ImmutableQueue<string>.Empty;

// Enqueue returns a new queue
ImmutableQueue<string> q1 = empty.Enqueue("first");
ImmutableQueue<string> q2 = q1.Enqueue("second");
ImmutableQueue<string> q3 = q2.Enqueue("third");

// Peek \u2014 head only, no removal
string head = q3.Peek();                            // "first"

// Dequeue \u2014 head plus the new tail-queue
ImmutableQueue<string> q4 = q3.Dequeue(out string popped);
// popped = "first", q4 contains second and third

// Iteration walks in FIFO order
foreach (string s in q3)
    Console.WriteLine(s);                            // first, second, third

// Branching from a shared base
ImmutableQueue<string> a = q3.Enqueue("a-only");
ImmutableQueue<string> b = q3.Enqueue("b-only");
// q3, a, and b all coexist; "first/second/third" is shared between them

// Drain pattern
ImmutableQueue<string> remaining = q3;
while (!remaining.IsEmpty)
{
    remaining = remaining.Dequeue(out string item);
    Console.WriteLine(item);
}`}],properties:[{name:"IsEmpty",type:"bool",description:"Cheap emptiness check. Note: ImmutableQueue does NOT expose Count \u2014 counting requires a full walk and is intentionally not part of the API."}],methods:[{name:"Enqueue",signature:"Enqueue(T value) \u2192 ImmutableQueue<T>",complexity:"O(1)"},{name:"Dequeue",signature:"Dequeue() \u2192 ImmutableQueue<T>",complexity:"O(1) amortized"},{name:"Dequeue",signature:"Dequeue(out T value) \u2192 ImmutableQueue<T>",complexity:"O(1) amortized"},{name:"Peek",signature:"Peek() \u2192 T",complexity:"O(1) amortized"},{name:"Clear",signature:"Clear() \u2192 ImmutableQueue<T>",complexity:"O(1)"}],comparison:{columns:[{id:"iq",label:"ImmutableQueue<T>",accent:"immutable"},{id:"q",label:"Queue<T>",accent:"generic"},{id:"cq",label:"ConcurrentQueue<T>",accent:"concurrent"},{id:"is",label:"ImmutableStack<T>",accent:"immutable"}],rows:[{aspect:"Backing",cells:{iq:"Two immutable stacks.",q:"Circular array.",cq:"Linked segment chain.",is:"Cons list."}},{aspect:"Order",cells:{iq:"FIFO.",q:"FIFO.",cq:"FIFO.",is:"LIFO."}},{aspect:"Mutation",cells:{iq:"Returns new queue.",q:"In place.",cq:"In place.",is:"Returns new stack."}},{aspect:"Snapshots",cells:{iq:"Every version valid.",q:"No.",cq:"No.",is:"Every version valid."}},{aspect:"Best for",cells:{iq:"Snapshot FIFO state.",q:"Single-thread FIFO.",cq:"Multi-writer FIFO.",is:"Snapshot LIFO state."}}]},related:[{slug:"immutable-stack"},{slug:"queue"},{slug:"concurrent-queue"},{slug:"immutable-list"}]};var B={slug:"immutable-stack",name:"ImmutableStack<T>",namespace:"immutable",metaDescription:"System.Collections.Immutable.ImmutableStack<T> \u2014 persistent LIFO stack as a cons list. O(1) Push, Pop, Peek. Reference for .NET 10 / C# 14.",badges:[{variant:"namespace",label:"System.Collections.Immutable"},{variant:"neutral",label:"Since .NET Framework 4.5"},{variant:"ok",label:"Immutable"},{variant:"ok",label:"Thread-safe"},{variant:"ok",label:"O(1) everything"},{variant:"neutral",label:"LIFO"}],lead:'A persistent LIFO stack backed by a singly-linked cons list. Push prepends; Pop returns the tail of the list \u2014 both O(1) and the structure shares all unchanged tail nodes between versions. The simplest, fastest persistent collection in the BCL; functional textbooks would call this "the canonical immutable stack."',metrics:[{label:"Push",value:"O(1)",note:"allocates one node, prepends"},{label:"Pop",value:"O(1)",note:"returns the tail; allocation-free"},{label:"Peek",value:"O(1)",note:"reads the head value"}],whenToUse:"Reach for ImmutableStack whenever a LIFO history must persist \u2014 undo stacks, recursive descent without recursion, parser context tracking, time-travel debugging. Use Stack when single-threaded; ConcurrentStack when many threads share the SAME stack.",callout:{variant:"highlight",title:"Pop is allocation-free",body:"Push allocates a single node. Pop, uniquely, allocates nothing \u2014 the new stack IS the existing tail of the list. Branching from a shared base (two different Pushes onto the same stack) costs one node each and shares the rest. The simplest persistent structure with the cleanest cost story."},diagram:{caption:"Cons-list sharing",body:`  base               base.Push("X")              base.Push("Y")
                                                    \u2502
    head \u2500\u2500\u25B6 "Y"     head \u2500\u2500\u25B6 "X" \u2500\u2500\u2510              \u2502
              \u2502                     \u2502              \u2502
              \u25BC                     \u25BC              \u25BC
            ...                   tail (shared with base.Push("Y") and base)
              \u2502
              \u25BC
            null

    Push: one new node prepended.
    Pop:  return the tail \u2014 no allocation.`},examples:[{caption:"Persistent LIFO",language:"csharp",source:`using System.Collections.Immutable;

ImmutableStack<string> empty = ImmutableStack<string>.Empty;

// Push returns new stack
ImmutableStack<string> s1 = empty.Push("a");
ImmutableStack<string> s2 = s1.Push("b");
ImmutableStack<string> s3 = s2.Push("c");

// Peek \u2014 head only
string head = s3.Peek();                            // "c"

// Pop overload that returns the value AND the new stack
ImmutableStack<string> s4 = s3.Pop(out string popped);
// popped = "c", s4 has [b, a]

// Iteration walks head-to-tail
foreach (string s in s3)
    Console.WriteLine(s);                            // c, b, a

// Branching shares all tail nodes
ImmutableStack<string> branchX = s2.Push("X");
ImmutableStack<string> branchY = s2.Push("Y");
// s2, branchX, branchY all coexist; the [b, a] tail is shared

// Drain
ImmutableStack<string> remaining = s3;
while (!remaining.IsEmpty)
{
    remaining = remaining.Pop(out string item);
    Console.WriteLine(item);
}`}],properties:[{name:"IsEmpty",type:"bool",description:"Cheap emptiness check. Like ImmutableQueue, ImmutableStack does NOT expose Count \u2014 counting would require a full walk and is intentionally not part of the API."}],methods:[{name:"Push",signature:"Push(T value) \u2192 ImmutableStack<T>",complexity:"O(1)"},{name:"Pop",signature:"Pop() \u2192 ImmutableStack<T>",complexity:"O(1)"},{name:"Pop",signature:"Pop(out T value) \u2192 ImmutableStack<T>",complexity:"O(1)"},{name:"Peek",signature:"Peek() \u2192 T",complexity:"O(1)"},{name:"Clear",signature:"Clear() \u2192 ImmutableStack<T>",complexity:"O(1)"}],comparison:{columns:[{id:"is",label:"ImmutableStack<T>",accent:"immutable"},{id:"s",label:"Stack<T>",accent:"generic"},{id:"cs",label:"ConcurrentStack<T>",accent:"concurrent"},{id:"iq",label:"ImmutableQueue<T>",accent:"immutable"}],rows:[{aspect:"Backing",cells:{is:"Cons list.",s:"Resizing array.",cs:"Linked list with CAS.",iq:"Two immutable stacks."}},{aspect:"Push",cells:{is:"O(1) \u2014 one node.",s:"O(1) amortised.",cs:"O(1) lock-free.",iq:"O(1) Enqueue."}},{aspect:"Pop",cells:{is:"O(1) \u2014 allocation-free.",s:"O(1).",cs:"O(1) lock-free.",iq:"O(1) amortised."}},{aspect:"Snapshots",cells:{is:"Every version valid.",s:"No.",cs:"No.",iq:"Every version valid."}},{aspect:"Best for",cells:{is:"Snapshot LIFO state.",s:"Single-thread LIFO.",cs:"Multi-writer LIFO.",iq:"Snapshot FIFO state."}}]},related:[{slug:"immutable-queue"},{slug:"stack"},{slug:"concurrent-stack"},{slug:"immutable-list"}]};var V={array:n,span:r,memory:o,list:i,"linked-list":s,stack:l,queue:c,"priority-queue":u,dictionary:d,"sorted-dictionary":m,"sorted-list":p,"hash-set":y,"sorted-set":h,"observable-collection":b,"array-list":g,hashtable:T,"legacy-stack":f,"legacy-queue":v,"legacy-sorted-list":k,"bit-array":w,"string-collection":S,"concurrent-dictionary":O,"concurrent-queue":C,"concurrent-stack":A,"concurrent-bag":x,"blocking-collection":I,"immutable-array":L,"immutable-list":E,"immutable-dictionary":R,"immutable-sorted-dictionary":q,"immutable-hash-set":D,"immutable-sorted-set":N,"immutable-queue":P,"immutable-stack":B};function rt(e){return V[e]}function M(){return Object.values(V)}function F(e){return M().filter(t=>t.namespace===e)}function ot(){return a.map(e=>({namespace:e,structures:F(e.id)}))}export{a,U as b,rt as c,M as d,F as e,ot as f};
