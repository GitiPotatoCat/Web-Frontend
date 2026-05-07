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

/**
 * The registry. Keys are URL slugs; values are page-shaped objects the
 * structure-page component renders.
 *
 * After step 9b we have 14 of 34 structures authored. The signature stays
 * `Partial<Record<Slug, Structure>>` until step 9f, when we tighten it
 * to `Record<Slug, Structure>` once every slug has a data file.
 */
export const STRUCTURES: Partial<Record<Slug, Structure>> = {
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
} as const;

export function getStructure(slug: Slug): Structure | undefined {
    return STRUCTURES[slug];
}

export function listStructures(): ReadonlyArray<Structure> {
    return Object.values(STRUCTURES) as ReadonlyArray<Structure>;
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