import type { Structure } from '../types';
import type { Slug } from '../slugs';
import { NAMESPACES, type NamespaceMeta } from '../namespaces';

import { ARRAY_DATA } from './array.data';
import { SPAN_DATA } from './span.data';
import { MEMORY_DATA } from './memory.data';

import { LIST_DATA } from './list.data';
import { LINKED_LIST_DATA } from './linked-list.data';
import { STACK_DATA } from './stack.data';
import { QUEUE_DATA } from './queue.data';
import { PRIORITY_QUEUE_DATA } from './priority-queue.data';
import { DICTIONARY_DATA } from './dictionary.data';
import { SORTED_DICTIONARY_DATA } from './sorted-dictionary.data';
import { SORTED_LIST_DATA } from './sorted-list.data';
import { HASH_SET_DATA } from './hash-set.data';
import { SORTED_SET_DATA } from './sorted-set.data';
import { OBSERVABLE_COLLECTION_DATA } from './observable-collection.data';

import { ARRAY_LIST_DATA } from './array-list.data';
import { HASHTABLE_DATA } from './hashtable.data';
import { LEGACY_STACK_DATA } from './legacy-stack.data';
import { LEGACY_QUEUE_DATA } from './legacy-queue.data';
import { LEGACY_SORTED_LIST_DATA } from './legacy-sorted-list.data';
import { BIT_ARRAY_DATA } from './bit-array.data';
import { STRING_COLLECTION_DATA } from './string-collection.data';

import { CONCURRENT_DICTIONARY_DATA } from './concurrent-dictionary.data';
import { CONCURRENT_QUEUE_DATA } from './concurrent-queue.data';
import { CONCURRENT_STACK_DATA } from './concurrent-stack.data';
import { CONCURRENT_BAG_DATA } from './concurrent-bag.data';
import { BLOCKING_COLLECTION_DATA } from './blocking-collection.data';

import { IMMUTABLE_ARRAY_DATA } from './immutable-array.data';
import { IMMUTABLE_LIST_DATA } from './immutable-list.data';
import { IMMUTABLE_DICTIONARY_DATA } from './immutable-dictionary.data';
import { IMMUTABLE_SORTED_DICTIONARY_DATA } from './immutable-sorted-dictionary.data';
import { IMMUTABLE_HASH_SET_DATA } from './immutable-hash-set.data';
import { IMMUTABLE_SORTED_SET_DATA } from './immutable-sorted-set.data';
import { IMMUTABLE_QUEUE_DATA } from './immutable-queue.data';
import { IMMUTABLE_STACK_DATA } from './immutable-stack.data';

/**
 * The structure registry. Maps each Slug to its page-shaped data.
 *
 * The signature is intentionally `Record<Slug, Structure>` (not Partial)
 * — every Slug in the closed union MUST have a corresponding entry. If
 * anyone deletes a data file's import here, or forgets to register a new
 * one, TypeScript will refuse to compile. This is the final architectural
 * lock: the system can never ship an incomplete registry.
 *
 * To add a new structure:
 *   1. Add the slug to the `Slug` union in src/app/data/slugs.ts
 *   2. Author src/app/data/structures/{slug}.data.ts
 *   3. Import and register here — without this third step the build fails
 */
export const STRUCTURES: Record<Slug, Structure> = {
    // Primitive
    array: ARRAY_DATA,
    span: SPAN_DATA,
    memory: MEMORY_DATA,

    // Generic
    list: LIST_DATA,
    'linked-list': LINKED_LIST_DATA,
    stack: STACK_DATA,
    queue: QUEUE_DATA,
    'priority-queue': PRIORITY_QUEUE_DATA,
    dictionary: DICTIONARY_DATA,
    'sorted-dictionary': SORTED_DICTIONARY_DATA,
    'sorted-list': SORTED_LIST_DATA,
    'hash-set': HASH_SET_DATA,
    'sorted-set': SORTED_SET_DATA,
    'observable-collection': OBSERVABLE_COLLECTION_DATA,

    // Legacy
    'array-list': ARRAY_LIST_DATA,
    hashtable: HASHTABLE_DATA,
    'legacy-stack': LEGACY_STACK_DATA,
    'legacy-queue': LEGACY_QUEUE_DATA,
    'legacy-sorted-list': LEGACY_SORTED_LIST_DATA,
    'bit-array': BIT_ARRAY_DATA,
    'string-collection': STRING_COLLECTION_DATA,

    // Concurrent
    'concurrent-dictionary': CONCURRENT_DICTIONARY_DATA,
    'concurrent-queue': CONCURRENT_QUEUE_DATA,
    'concurrent-stack': CONCURRENT_STACK_DATA,
    'concurrent-bag': CONCURRENT_BAG_DATA,
    'blocking-collection': BLOCKING_COLLECTION_DATA,

    // Immutable
    'immutable-array': IMMUTABLE_ARRAY_DATA,
    'immutable-list': IMMUTABLE_LIST_DATA,
    'immutable-dictionary': IMMUTABLE_DICTIONARY_DATA,
    'immutable-sorted-dictionary': IMMUTABLE_SORTED_DICTIONARY_DATA,
    'immutable-hash-set': IMMUTABLE_HASH_SET_DATA,
    'immutable-sorted-set': IMMUTABLE_SORTED_SET_DATA,
    'immutable-queue': IMMUTABLE_QUEUE_DATA,
    'immutable-stack': IMMUTABLE_STACK_DATA,
} as const;

/**
 * Look up a structure by slug. Note the return type:
 *
 *   • If the caller passes a value typed as `Slug`, the result is
 *     unconditionally `Structure` — no nullish handling needed.
 *
 *   • The route resolver still receives a plain `string` from the URL,
 *     which it narrows to Slug via the cast in app.routes.ts; the
 *     undefined-handling lives there, where it belongs.
 *
 * This function exists for the few internal callers that already hold a
 * Slug-typed value (the chip list, the resolver, future link generators)
 * and want a guarantee they can dereference without checking.
 */
export function getStructure(slug: Slug): Structure {
    return STRUCTURES[slug];
}

export function listStructures(): ReadonlyArray<Structure> {
    return Object.values(STRUCTURES);
}

export function listStructuresIn(
    namespaceId: Structure['namespace'],
): ReadonlyArray<Structure> {
    return listStructures().filter(s => s.namespace === namespaceId);
}

export function listStructuresGrouped(): ReadonlyArray<{
    readonly namespace: NamespaceMeta;
    readonly structures: ReadonlyArray<Structure>;
}> {
    return NAMESPACES.map(ns => ({
        namespace: ns,
        structures: listStructuresIn(ns.id),
    }));
}