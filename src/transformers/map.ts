/**
 * Converts a `Map` or `Record` into an array of objects, using a specified key property
 * and optionally selecting specific properties as the values.
 *
 * @template K - The type of the key property in the `Map` or `Record`. Must be a key of `V`.
 * @template V - The type of the values in the `Map` or `Record`. Must be an object.
 * @template P - The type of the properties to include in the resulting objects. Can be a single key of `V`,
 *               an array of keys of `V`, or `undefined` to include all properties.
 *
 * @param {Map<K, V> | Record<K, V>} map - The `Map` or `Record` to convert into an array.
 * @param {K} keyProp - The key property to use as the key in the resulting objects.
 * @param {P} [valueProps] - Optional. The property or properties of `V` to include in the resulting objects.
 *                            If not provided, all properties of `V` will be included.
 *
 * @returns {(P extends undefined
 *     ? V & Record<K, V[K]>
 *     : P extends keyof V
 *         ? Record<K, V[K]> & Record<P, V[P]>
 *         : P extends readonly (keyof V)[]
 *             ? Record<K, V[K]> & { [Key in P[number]]: V[Key] }
 *             : never)[]}
 *          An array of objects where:
 *          - Each object includes the `keyProp` with the corresponding key.
 *          - The values are either:
 *            - All properties of `V` (if `valueProps` is undefined),
 *            - A single property value (if `valueProps` is a single key), or
 *            - A subset of properties (if `valueProps` is an array of keys).
 *
 * @example
 * const map = new Map([
 *   [1, { name: 'Alice', age: 25 }],
 *   [2, { name: 'Bob', age: 30 }],
 * ]);
 *
 * // Case 1: No valueProps (include full object)
 * const result1 = mapToArray(map, 'id');
 * console.log(result1);
 * // Output: [
 * //   { id: 1, name: 'Alice', age: 25 },
 * //   { id: 2, name: 'Bob', age: 30 }
 * // ]
 *
 * // Case 2: Single valueProps (include only the specified property)
 * const result2 = mapToArray(map, 'id', 'name');
 * console.log(result2);
 * // Output: [
 * //   { id: 1, name: 'Alice' },
 * //   { id: 2, name: 'Bob' }
 * // ]
 *
 * // Case 3: Array of valueProps (include only the specified properties)
 * const result3 = mapToArray(map, 'id', ['name', 'age'] as const);
 * console.log(result3);
 * // Output: [
 * //   { id: 1, name: 'Alice', age: 25 },
 * //   { id: 2, name: 'Bob', age: 30 }
 * // ]
 */
export const mapToArray = <
    K extends keyof V,
    V extends object,
    P extends keyof V | readonly (keyof V)[] | undefined = undefined,
>(
    map: Map<K, V> | Record<K, V>,
    keyProp: K,
    valueProps?: P
): (P extends undefined
    ? V & Record<K, V[K]>
    : P extends keyof V
        ? Record<K, V[K]> & Record<P, V[P]>
        : P extends readonly (keyof V)[]
            ? Record<K, V[K]> & Pick<V, P[number]>
            : never)[] => {
    const entries = map instanceof Map ? map.entries() : Object.entries(map) as [K, V][];
    return Array.from(entries).map(([key, value]) => ({
        [keyProp]: key,
        ...(valueProps === undefined
            ? value
            : Array.isArray(valueProps)
                ? valueProps.reduce((acc, prop) => ({ ...acc, [prop]: value[prop as keyof V] }), {})
                : { [valueProps as keyof V]: value[valueProps as keyof V] }),
    }));
};

/**
 * Converts a `Map` or `Record` to an array of objects, each containing a `keyProp` property and optionally specified values.
 *
 * This function flattens the values in the map or record (which are assumed to be arrays of objects), then maps each object
 * to a new object that includes the `keyProp` (the key of the original `Map` or `Record`) along with the selected value properties.
 * If no specific value properties (`valueProps`) are provided, the entire object is spread into the result.
 *
 * @template T - The type of the objects inside the map/record, which will be transformed into the resulting array.
 * @template K - The type of the key in the `Map` or `Record`. Typically a string or number.
 * @template V - The type of the values inside the `Map` or `Record`. Can be a single property key or an array of keys of the value type.
 *
 * @param data - The `Map` or `Record` that you want to convert into an array of objects.
 *               The values in the map/record must be arrays of objects (or single objects depending on how `valueProps` is used).
 * @param keyProp - The name of the key property that will be added to each object in the resulting array.
 * @param valueProps - An optional list of properties from the value object that will be included in the resulting object.
 *                     If a single property is provided, it will be included directly.
 *                     If not provided, the entire value object will be included.
 *
 * @returns An array of objects where each object has the `keyProp` and selected properties from the value objects.
 *
 * @example
 * // Example 1: Converting a `Map` to an array with selected properties
 * const myMap = new Map([
 *   [1, [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]],
 *   [2, [{ name: 'Charlie', age: 35 }]]
 * ]);
 *
 * const result = multiMapToArray(myMap, 'id', ['name']);
 * console.log(result);
 * // Output: [{ id: 1, name: 'Alice' }, { id: 1, name: 'Bob' }, { id: 2, name: 'Charlie' }]
 *
 * @example
 * // Example 2: Converting a `Record` to an array with a single property
 * const myRecord = {
 *   1: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }],
 *   2: [{ name: 'Charlie', age: 35 }]
 * };
 *
 * const result = multiMapToArray(myRecord, 'id', 'name');
 * console.log(result);
 * // Output: [{ id: 1, name: 'Alice' }, { id: 1, name: 'Bob' }, { id: 2, name: 'Charlie' }]
 *
 * @example
 * // Example 3: Converting a `Map` to an array with all properties when no `valueProps` is provided
 * const myMap = new Map([
 *   [1, [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]],
 *   [2, [{ name: 'Charlie', age: 35 }]]
 * ]);
 *
 * const result = multiMapToArray(myMap, 'id');
 * console.log(result);
 * // Output: [{ id: 1, name: 'Alice', age: 25 }, { id: 1, name: 'Bob', age: 30 }, { id: 2, name: 'Charlie', age: 35 }]
 */
export const multiMapToArray = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    data: Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]> | Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]>,
    keyProp: K,
    valueProps?: V
): T[] => {
    const entries = data instanceof Map
        ? Array.from(data.entries())
        : Object.entries(data) as [string, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]][];
    return entries.flatMap(([key, values]) => {
        return values.map((value) => ({
            [keyProp]: key,
            ...(valueProps
                ? (Array.isArray(valueProps)
                    ? valueProps.reduce((acc, prop) => ({ ...acc, [prop]: value[prop as keyof typeof value] }), {})
                    : { [valueProps as keyof T]: value })
                : { ...value })
        }));
    });
};
