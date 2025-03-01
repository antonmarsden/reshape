/**
 * Converts a `Map` or `Record` back into an array of objects by reconstructing the key-value pairs
 * into objects with the original key property and values.
 *
 * @template K - The property key used as the `Map` key or `Record` key.
 * @template V - The value type stored in the `Map` or `Record`, which could be a single property value or an object with selected properties.
 *
 * @param data - The input `Map<K, V>` or `Record<K, V>`, where keys represent object properties and values represent either a single property value or a subset of properties.
 * @param keyProp - The property name to use for the reconstructed objects' key.
 *
 * @returns An array of objects where:
 * - The `keyProp` is restored as a property of the object.
 * - If values were primitives, they are stored under the `value` property.
 * - If values were objects, they are merged back into the object structure.
 *
 * @example
 * ```ts
 * // Example using Map
 * const userMap = new Map<number, { name: string }>([
 *   [1, { name: 'Alice' }],
 *   [2, { name: 'Bob' }]
 * ]);
 *
 * const usersFromMap = mapToArray(userMap, 'id');
 * console.log(usersFromMap);
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * // Example using Record
 * const userRecord: Record<number, { name: string }> = {
 *   1: { name: 'Alice' },
 *   2: { name: 'Bob' }
 * };
 *
 * const usersFromRecord = mapToArray(userRecord, 'id');
 * console.log(usersFromRecord);
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 */
export const mapToArray = <K extends PropertyKey, V extends object | string | number | boolean>(
    data: Map<K, V> | Record<K, V>,
    keyProp: string
): (V extends object ? V & Record<string, K> : Record<string, K> & Record<string, V>)[] => {
    return Array.from(
        data instanceof Map ? data.entries() : (Object.entries(data) as [K, V][])
    ).map(([key, value]) =>
        typeof value === 'object' && value !== null
            ? { ...value, [keyProp]: key }
            : { [keyProp]: key, value } as any
    );
};


/**
 * Converts a `Map` or `Record` of key-value pairs into an array of objects.
 * Each object contains the key as the value of `keyProp`, and the selected `valueProps`
 * as properties of the object.
 *
 * This function handles both `Map` and `Record` types and transforms them into arrays
 * of objects with the specified key and values based on the provided `keyProp` and
 * `valueProps`. It flattens the resulting array of arrays into a single array.
 *
 * @param data - A `Map` or `Record` containing key-value pairs. If `data` is a `Map`,
 *               its values are arrays; if it's a `Record`, the values are arrays of objects.
 * @param keyProp - The property key that will be used for the key in the resulting objects.
 * @param valueProps - The properties to include from each value. If an array is passed,
 *                     it will pick the properties specified; if a single property is passed,
 *                     it will map that property from each value.
 *
 * @returns An array of objects where each object has the `keyProp` as a key-value pair,
 *          along with the selected `valueProps` from the `data` entries.
 *
 * @example
 * const multiMap = new Map<number, { name: string; age: number }[]>([
 *   [1, [{ name: 'Alice', age: 25 }, { name: 'Alicia', age: 28 }]],
 *   [2, [{ name: 'Bob', age: 30 }]],
 * ]);
 *
 * const resultFromMap = multiMapToArray(multiMap, 'id', ['name', 'age']);
 * console.log(resultFromMap);
 * // Output:
 * // [
 * //   { id: 1, name: 'Alice', age: 25 },
 * //   { id: 1, name: 'Alicia', age: 28 },
 * //   { id: 2, name: 'Bob', age: 30 },
 * // ]
 *
 * @example
 * const record: Record<number, { name: string; age: number }[]> = {
 *   1: [{ name: 'Alice', age: 25 }, { name: 'Alicia', age: 28 }],
 *   2: [{ name: 'Bob', age: 30 }],
 * };
 *
 * const resultFromRecord = multiMapToArray(record, 'id', ['name', 'age']);
 * console.log(resultFromRecord);
 * // Output:
 * // [
 * //   { id: 1, name: 'Alice', age: 25 },
 * //   { id: 1, name: 'Alicia', age: 28 },
 * //   { id: 2, name: 'Bob', age: 30 },
 * // ]
 */
export const multiMapToArray = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    data: Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]> | Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]>,
    keyProp: K,
    valueProps: V
): T[] => {
    const entries = data instanceof Map
        ? Array.from(data.entries())
        : Object.entries(data) as [string, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]][];
    return entries.flatMap(([key, values]) => {
        return values.map((value) => ({
            [keyProp]: key,
            ...(Array.isArray(valueProps)
                ? valueProps.reduce((acc, prop) => ({ ...acc, [prop]: value[prop as keyof typeof value] }), {})
                : { [valueProps as keyof T]: value })
        }));
    });
};
