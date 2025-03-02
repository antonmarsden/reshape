/**
 * Converts an array of objects into a `Map` using a specified key property and optional value properties.
 *
 * @template T - The type of objects in the array.
 * @template K - The key property of the object (must be a key of `T`).
 * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
 *
 * @param {T[]} array - The array of objects to convert into a `Map`.
 * @param {K} keyProp - The property of the object to use as the key in the `Map`.
 * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Map`.
 * If not provided, the entire object will be used as the value.
 *
 * @returns {Map<T[K], V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T>}
 * A `Map` where:
 * - The keys are the values of the `keyProp` property.
 * - The values are either:
 *   - A subset of the object (if `valueProps` is an array of keys).
 *   - A single property of the object (if `valueProps` is a single key).
 *   - The entire object (if `valueProps` is not provided).
 *
 * @example
 * // Example 1: Using a single value property
 * const array1 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const map1 = arrayToMap(array1, 'id', 'name');
 * // Map<number, string>:
 * // 1 => 'Alice'
 * // 2 => 'Bob'
 *
 * @example
 * // Example 2: Using multiple value properties
 * const array2 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const map2 = arrayToMap(array2, 'id', ['name', 'age']);
 * // Map<number, { name: string, age: number }>:
 * // 1 => { name: 'Alice', age: 25 }
 * // 2 => { name: 'Bob', age: 30 }
 *
 * @example
 * // Example 3: Using no value properties (entire object as value)
 * const array3 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const map3 = arrayToMap(array3, 'id');
 * // Map<number, { id: number, name: string, age: number }>:
 * // 1 => { id: 1, name: 'Alice', age: 25 }
 * // 2 => { id: 2, name: 'Bob', age: 30 }
 */
export const arrayToMap = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    array: T[],
    keyProp: K,
    valueProps?: V
): Map<T[K], V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T> => {
    return new Map(
        array.map((item) => [
            item[keyProp],
            valueProps === undefined
                ? item
                : (Array.isArray(valueProps)
                    ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]]))
                    : item[valueProps as keyof T])
        ])
    );
};

/**
 * Converts an array of objects into a `Record` using a specified key property and optional value properties.
 *
 * @template T - The type of objects in the array.
 * @template K - The key property of the object (must be a key of `T`).
 * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
 *
 * @param {T[]} array - The array of objects to convert into a `Record`.
 * @param {K} keyProp - The property of the object to use as the key in the `Record`.
 * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Record`.
 * If not provided, the entire object will be used as the value.
 *
 * @returns {Record<T[K] & PropertyKey, V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T>}
 * A `Record` where:
 * - The keys are the values of the `keyProp` property.
 * - The values are either:
 *   - A subset of the object (if `valueProps` is an array of keys).
 *   - A single property of the object (if `valueProps` is a single key).
 *   - The entire object (if `valueProps` is not provided).
 *
 * @example
 * // Example 1: Using a single value property
 * const array1 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const record1 = arrayToRecord(array1, 'id', 'name');
 * // Record<number, string>:
 * // { 1: 'Alice', 2: 'Bob' }
 *
 * @example
 * // Example 2: Using multiple value properties
 * const array2 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const record2 = arrayToRecord(array2, 'id', ['name', 'age']);
 * // Record<number, { name: string, age: number }>:
 * // { 1: { name: 'Alice', age: 25 }, 2: { name: 'Bob', age: 30 } }
 *
 * @example
 * // Example 3: Using no value properties (entire object as value)
 * const array3 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 * ];
 * const record3 = arrayToRecord(array3, 'id');
 * // Record<number, { id: number, name: string, age: number }>:
 * // { 1: { id: 1, name: 'Alice', age: 25 }, 2: { id: 2, name: 'Bob', age: 30 } }
 */
export const arrayToRecord = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    array: T[],
    keyProp: K,
    valueProps?: V
): Record<T[K] & PropertyKey, V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T> => {
    return array.reduce(
        (acc, item) => {
            const key = item[keyProp];
            const value = valueProps === undefined
                ? item
                : (Array.isArray(valueProps)
                    ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]]))
                    : item[valueProps as keyof T]);
            acc[key as T[K] & PropertyKey] = value as V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T;
            return acc;
        },
        {} as Record<T[K] & PropertyKey, V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T>
    );
};

/**
 * Converts an array of objects into a `Map` where each key maps to an array of values, using a specified key property and optional value properties.
 *
 * @template T - The type of objects in the array.
 * @template K - The key property of the object (must be a key of `T`).
 * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
 *
 * @param {T[]} array - The array of objects to convert into a multi-map.
 * @param {K} keyProp - The property of the object to use as the key in the `Map`.
 * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Map`.
 * If not provided, the entire object will be used as the value.
 *
 * @returns {Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>}
 * A `Map` where:
 * - The keys are the values of the `keyProp` property.
 * - The values are arrays of either:
 *   - A subset of the object (if `valueProps` is an array of keys).
 *   - A single property of the object (if `valueProps` is a single key).
 *   - The entire object (if `valueProps` is not provided).
 *
 * @example
 * // Example 1: Using a single value property
 * const array1 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiMap1 = arrayToMultiMap(array1, 'id', 'name');
 * // Map<number, string[]>:
 * // 1 => ['Alice', 'Anna']
 * // 2 => ['Bob']
 *
 * @example
 * // Example 2: Using multiple value properties
 * const array2 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiMap2 = arrayToMultiMap(array2, 'id', ['name', 'age']);
 * // Map<number, { name: string, age: number }[]>:
 * // 1 => [{ name: 'Alice', age: 25 }, { name: 'Anna', age: 30 }]
 * // 2 => [{ name: 'Bob', age: 40 }]
 *
 * @example
 * // Example 3: Using no value properties (entire object as value)
 * const array3 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiMap3 = arrayToMultiMap(array3, 'id');
 * // Map<number, { id: number, name: string, age: number }[]>:
 * // 1 => [{ id: 1, name: 'Alice', age: 25 }, { id: 1, name: 'Anna', age: 30 }]
 * // 2 => [{ id: 2, name: 'Bob', age: 40 }]
 */
export const arrayToMultiMap = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    array: T[],
    keyProp: K,
    valueProps?: V // Make valueProps optional
): Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]> => {
    const multiMap = new Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>();

    array.forEach((item) => {
        const key = item[keyProp];
        const value = (
            valueProps === undefined
                ? item
                : (Array.isArray(valueProps)
                    ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]]))
                    : item[valueProps as keyof T])
        ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T;

        let values = multiMap.get(key);
        if (values === undefined) {
            values = [];
            multiMap.set(key, values);
        }
        values.push(value);
    });

    return multiMap;
};

/**
 * Converts an array of objects into a `Record` where each key maps to an array of values, using a specified key property and optional value properties.
 *
 * @template T - The type of objects in the array.
 * @template K - The key property of the object (must be a key of `T`).
 * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
 *
 * @param {T[]} array - The array of objects to convert into a multi-record.
 * @param {K} keyProp - The property of the object to use as the key in the `Record`.
 * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Record`.
 * If not provided, the entire object will be used as the value.
 *
 * @returns {Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>}
 * A `Record` where:
 * - The keys are the values of the `keyProp` property.
 * - The values are arrays of either:
 *   - A subset of the object (if `valueProps` is an array of keys).
 *   - A single property of the object (if `valueProps` is a single key).
 *   - The entire object (if `valueProps` is not provided).
 *
 * @example
 * // Example 1: Using a single value property
 * const array1 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiRecord1 = arrayToMultiRecord(array1, 'id', 'name');
 * // Record<number, string[]>:
 * // { 1: ['Alice', 'Anna'], 2: ['Bob'] }
 *
 * @example
 * // Example 2: Using multiple value properties
 * const array2 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiRecord2 = arrayToMultiRecord(array2, 'id', ['name', 'age']);
 * // Record<number, { name: string, age: number }[]>:
 * // { 1: [{ name: 'Alice', age: 25 }, { name: 'Anna', age: 30 }], 2: [{ name: 'Bob', age: 40 }] }
 *
 * @example
 * // Example 3: Using no value properties (entire object as value)
 * const array3 = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 1, name: 'Anna', age: 30 },
 *   { id: 2, name: 'Bob', age: 40 },
 * ];
 * const multiRecord3 = arrayToMultiRecord(array3, 'id');
 * // Record<number, { id: number, name: string, age: number }[]>:
 * // { 1: [{ id: 1, name: 'Alice', age: 25 }, { id: 1, name: 'Anna', age: 30 }], 2: [{ id: 2, name: 'Bob', age: 40 }] }
 */
export const arrayToMultiRecord = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
    array: T[],
    keyProp: K,
    valueProps?: V
): Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]> => {
    return array.reduce(
        (acc, item) => {
            const key = item[keyProp];
            const value = (
                valueProps === undefined
                    ? item
                    : (Array.isArray(valueProps)
                        ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]]))
                        : item[valueProps as keyof T])
            ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T;

            let values = acc[key as T[K] & PropertyKey];
            if (values === undefined) {
                values = [];
                acc[key as T[K] & PropertyKey] = values;
            }
            values.push(value);
            return acc;
        },
        {} as Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>
    );
};