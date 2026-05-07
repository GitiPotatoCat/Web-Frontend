// =============================================================================
// Forte · structure data model
// =============================================================================
// Every documentation page — all 34 of them — is rendered by ONE Angular
// component (built in step 4) that consumes a `Structure` object. This file
// defines the shape of that object. Authoring a new docs page therefore
// means writing one TypeScript file under data/structures/, NOT writing
// new templates or components.
//
// The type system carries the editorial contract:
//
//   • Every section of a docs page corresponds to a typed field here.
//   • Optional fields (`?`) are sections the page may legitimately skip.
//   • Discriminated unions (`kind: '...'`) catch authoring mistakes that
//     would otherwise silently render wrong (a "method" missing a return
//     type, a "callout" using an unknown style, etc.).
//   • Readonly arrays prevent us from mutating data at runtime by accident
//     — these objects are constants describing pages, not state.
//
// If you need to add a new section type, do it HERE first, then update
// the structure-page template, then add data. That order keeps the
// content and the renderer in lockstep.
// =============================================================================

import type { NamespaceId } from './namespaces';
import type { Slug } from './slugs';

// -----------------------------------------------------------------------------
// Re-exports — saves consumers from importing four separate paths.
// -----------------------------------------------------------------------------

export type { NamespaceId } from './namespaces';
export type { Slug } from './slugs';

// =============================================================================
// 1 · BADGES — the row of pill labels under a hero title
// =============================================================================
// A structure's hero shows several small pill labels: namespace name, ".NET
// 10", "Thread-safe", "Heap-allocated", and so on. We use a discriminated
// union so the renderer can style each variant correctly without a
// conditional ladder over magic strings.

export type BadgeVariant =
    /** The big namespace pill — coloured per `--ns-*-bg`. */
    | 'namespace'
    /** Positive trait (Thread-safe, Sorted, Lock-free). Renders emerald. */
    | 'ok'
    /** Cautionary trait (Boxes values, Legacy, Not thread-safe). Renders amber. */
    | 'warn'
    /** A neutral fact (Since .NET 4.5, LIFO, FIFO). Renders grey-on-grey. */
    | 'neutral';

export interface Badge 
{
    readonly variant: BadgeVariant;
    readonly label: string;
}

// =============================================================================
// 2 · METRIC CARDS — the trio of complexity tiles below the hero
// =============================================================================
// Each docs page shows three "metric cards": Insert / Lookup / Remove or some
// variant. They display the operation name, the Big-O class, and a short
// note. The complexity field is typed as a finite union so we can later
// drive the animated complexity-graph component (step 8) from it directly.

export type Complexity =
    | 'O(1)'
    | 'O(log n)'
    | 'O(n)' 
    | 'O(k)'
    | 'O(n log n)'
    | 'O(n²)'
    | 'O(1) amortized'
    | 'O(log n) amortized'
    | 'O(n) worst-case';

export interface Metric 
{
    /** Operation label — "Insert", "Lookup", "Pop", etc. */
    readonly label: string;
    /** Asymptotic class. Use one of the Complexity variants. */
    readonly value: Complexity;
    /** A one-line italic note explaining the cost in human terms. */
    readonly note: string;
}

// =============================================================================
// 3 · CALLOUTS — the highlighted boxed paragraph below the metrics
// =============================================================================
// Every page has at most one prominent callout. It's a colour-coded
// "watch out for this" or "secret superpower" block. Variant drives both
// the border-left tint and the eyebrow label colour.

export type CalloutVariant =
    /** Common gotcha or footgun. Renders amber with a warning eyebrow. */
    | 'warn'
    /** A unique strength — used for ImmutableStack's zero-alloc Pop, etc. */
    | 'highlight'
    /** Neutral architectural insight. Renders indigo. */
    | 'note';

export interface Callout 
{
    readonly variant: CalloutVariant;
    readonly title: string;
    /** Plain-text body. Markdown is intentionally NOT supported — the data
        should describe content, not formatting. If we need richer prose
        we'll model it explicitly. */
    readonly body: string;
}

// =============================================================================
// 4 · CODE BLOCKS — the example section
// =============================================================================
// Each page carries one or more code examples. Each block has a language
// (always 'csharp' for now, but typed as a union so we can extend later)
// and an optional caption shown above. We don't pre-tokenise the source
// here — syntax highlighting happens at render time inside the code-block
// component (step 4). Keeping the data raw means content stays portable.

export type CodeLanguage = 'csharp';

export interface CodeBlock 
{
    /** Optional caption — appears above the code as a small label. */
    readonly caption?: string;
    readonly language: CodeLanguage;
    /** The raw source. Tabs become spaces — see authoring notes. */
    readonly source: string;
}

// =============================================================================
// 5 · PROPERTIES TABLE
// =============================================================================
// The "Properties" section is a 3-column table: name, type, description.
// The renderer formats each appropriately (mono for name and type, sans
// for description).

export interface Property 
{
    readonly name: string;
    /** Full C# type — e.g. "int", "ICollection<TKey>", "IEqualityComparer<T>". */
    readonly type: string;
    readonly description: string;
}

// =============================================================================
// 6 · METHODS TABLE
// =============================================================================
// 3 columns: method name, full signature, complexity. We separate the
// name from the signature so we can render the name in a stronger weight
// while the signature stays as plain mono.

export interface Method 
{
    readonly name: string;
    /** Full signature — "Add(T item) → void", "TryGetValue(K, out V) → bool". */
    readonly signature: string;
    /** Reuses the Complexity union so we get the same enforcement. */
    readonly complexity: Complexity;
}

// =============================================================================
// 7 · COMPARISON TABLE — "X vs Y" matrices
// =============================================================================
// Most pages compare the structure against 2-4 alternatives. The table is
// generic over its column count — each row provides ONE cell per column,
// keyed by the column's stable id. We model columns with explicit ids so
// we never accidentally re-order rows out of sync with headers.

export interface ComparisonColumn 
{
    /** Stable identifier (used as map key). */
    readonly id: string;
    /** Header label — usually the type name being compared. */
    readonly label: string;
    /** Optional namespace tint, applied to the header cell only. */
    readonly accent?: NamespaceId;
}

export interface ComparisonRow 
{
    /** The dimension being compared — "Backing", "Order", "Thread safety". */
    readonly aspect: string;
    /** Map from column.id → cell text. Every column MUST have a value. */
    readonly cells: Readonly<Record<string, string>>;
}

export interface ComparisonTable 
{
    readonly columns: ReadonlyArray<ComparisonColumn>;
    readonly rows: ReadonlyArray<ComparisonRow>;
}

// =============================================================================
// 8 · DIAGRAM — the ASCII / structural illustration tile
// =============================================================================
// Some pages show a small ASCII or boxed diagram (the cons-list view on
// ImmutableStack, the bucket diagram on Dictionary). We model it as a
// caption + monospace body, with optional highlight ranges for accenting
// specific lines. This is where we'd later swap in a real SVG diagram if
// we wanted; the data shape stays the same.

export interface Diagram 
{
    readonly caption?: string;
    /** Multi-line monospace text. Newlines are preserved as-is. */
    readonly body: string;
}

// =============================================================================
// 9 · RELATED CHIPS — the footer-of-content navigation
// =============================================================================
// The bottom of each page lists "Related structures": a row of clickable
// chips. Each chip points to another `Slug` so the type system rejects
// broken cross-references at compile time. (If you delete a structure file
// without updating the references, TypeScript fails the build.)

export interface RelatedChip 
{
    /** Must be a known slug. Compile error if you typo it. */
    readonly slug: Slug;
    /** Optional override for the chip label; defaults to the target's name. */
    readonly label?: string;
}

// =============================================================================
// 10 · STRUCTURE — the page itself
// =============================================================================
// The root type. Every section under data/structures/ exports one of these.
// The order of fields here mirrors the order they appear on the page, top-
// to-bottom, so reading this interface is also a description of what the
// rendered page looks like.

export interface Structure {
    // ---- Identity ---------------------------------------------------------

    /** URL slug. Must match the registry key. Single source of truth: slugs.ts. */
    readonly slug: Slug;

    /** Display name — "List<T>", "ConcurrentDictionary<K,V>". Renders in Fraunces. */
    readonly name: string;

    /** Which group this belongs to. Drives the colour and the breadcrumbs. */
    readonly namespace: NamespaceId;

    /** Plaintext description. Used for <meta description> and og:description. */
    readonly metaDescription: string;

    // ---- Hero ------------------------------------------------------------

    /** Pills shown beneath the title. ALWAYS include the namespace badge first. */
    readonly badges: ReadonlyArray<Badge>;

    /** The lede paragraph — italic Fraunces, sets the page's voice in 1-3 lines. */
    readonly lead: string;

    // ---- Body sections ---------------------------------------------------

    /** Three complexity cards. Authors should pick the THREE most-used
        operations for this structure — not necessarily Add/Get/Remove. */
    readonly metrics: readonly [Metric, Metric, Metric];

    /** "When to use" — italic serif paragraph. Mandatory; this is the page's
        most-read sentence. Speak in voice: "Reach for X when…". */
    readonly whenToUse: string;

    /** Optional callout block. Use sparingly — overuse dilutes impact. */
    readonly callout?: Callout;

    /** Optional structural diagram. Some types don't need one. */
    readonly diagram?: Diagram;

    /** At least one example block. */
    readonly examples: ReadonlyArray<CodeBlock>;

    /** Properties table. Empty array allowed if the structure exposes none
        worth documenting beyond Count (e.g. ImmutableStack). */
    readonly properties: ReadonlyArray<Property>;

    /** Methods table. Should list every public method worth knowing. */
    readonly methods: ReadonlyArray<Method>;

    /** Optional comparison matrix. Most pages have one; primitive ones may not. */
    readonly comparison?: ComparisonTable;

    /** "Related structures" chip row. 3-5 entries reads best. */
    readonly related: ReadonlyArray<RelatedChip>;
}