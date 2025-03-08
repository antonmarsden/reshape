/**
 * Returns the keys of an object as a strongly-typed array of keys.
 *
 * @param obj - The object whose keys are to be extracted.
 * @returns An array of keys of the given object, typed as the keys of the object.
 *
 * @example
 * const person = { name: "Alice", age: 30 };
 * const keys = objectKeys(person); // Type: ['name', 'age']
 */
export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Returns the values of an object as a strongly-typed array of values.
 *
 * @param obj - The object whose values are to be extracted.
 * @returns An array of values of the given object, typed as the values of the object.
 *
 * @example
 * const person = { name: "Alice", age: 30 };
 * const values = objectValues(person); // Type: [string, number]
 */
export function objectValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

/**
 * Returns the entries of an object as a strongly-typed array of key-value pairs.
 *
 * @param obj - The object whose entries (key-value pairs) are to be extracted.
 * @returns An array of key-value pairs of the given object, where each element is a tuple of [key, value].
 *
 * @example
 * const person = { name: "Alice", age: 30 };
 * const entries = objectEntries(person); // Type: [['name', string], ['age', number]]
 */
export function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Creates an object from an array of key-value pairs, while maintaining strong typing for the object’s keys and values.
 *
 * @param entries - An array of key-value pairs to convert into an object. Each entry is a tuple of `[key, value]`.
 * @returns A new object with the provided key-value pairs, typed as `Record<K, V>`.
 *
 * @example
 * const entries = [['name', 'Alice'], ['age', 30]] as const;
 * const person = objectFromEntries(entries); // Type: { name: string, age: number }
 */
export function objectFromEntries<K extends PropertyKey, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
