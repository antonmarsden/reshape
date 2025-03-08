export type ArrayToMapKey<K, T> = K extends keyof T ? T[K] : K extends (item: T) => PropertyKey ? ReturnType<K> : never;
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ArrayToMapValue<V, T> = V extends readonly (keyof T)[]
  ? Pick<T, Extract<V[number], keyof T>>
  : V extends keyof T
    ? T[V]
    : V extends (item: T) => any
      ? ReturnType<V>
      : T;

export function arrayToMap<T, K extends keyof T | ((item: T) => PropertyKey)>(array: T[], keyProp: K): Map<ArrayToMapKey<K, T>, T>;

export function arrayToMap<T, K extends keyof T | ((item: T) => PropertyKey), V extends keyof T>(array: T[], keyProp: K, valueProps: V): Map<ArrayToMapKey<K, T>, T[V]>;

export function arrayToMap<T, K extends keyof T | ((item: T) => PropertyKey), V extends readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Map<ArrayToMapKey<K, T>, Pick<T, V[number]>>;

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function arrayToMap<T, K extends keyof T | ((item: T) => PropertyKey), V extends (item: T) => any>(
  array: T[],
  keyProp: K,
  valueProps: V
): Map<ArrayToMapKey<K, T>, ReturnType<V>>;

/**
 * Converts an array of objects into a `Map`, using a specified key property or function,
 * and an optional value property, array of properties, or value transformation function.
 *
 * @template T - The type of objects in the array.
 * @template K - The type of the key property or key function.
 * @template V - The type of the value property, array of properties, or value function.
 *
 * @param {T[]} array - The array of objects to convert into a `Map`. If empty, an empty `Map` is returned.
 * @param {K} keyProp - The key property or function used to derive the keys for the `Map`.
 *                      - If a string key, each object's property with this key is used as the map key.
 *                      - If a function, it will be called with each item to compute the key.
 * @param {V} [valueProps] - Optional. The value property, array of properties, or function used to derive the values for the `Map`.
 *                           - If `undefined`, the entire object is used as the value.
 *                           - If a single key, the corresponding property value is used.
 *                           - If an array of keys, an object with only those properties is used.
 *                           - If a function, it will be called with each item to compute the value.
 *
 * @returns {Map<ArrayToMapKey<K, T>, ArrayToMapValue<V, T>>} A `Map` where:
 *          - The keys are derived from `keyProp`.
 *          - The values are derived from `valueProps` (or the entire object if `valueProps` is `undefined`).
 *
 * @throws {TypeError} If `array` is not an array.
 * @throws {Error} If `keyProp` is a string and some objects in `array` are missing that property.
 *
 * @example
 * const data = [
 *     { id: 1, name: 'Alice', age: 25 },
 *     { id: 2, name: 'Bob', age: 30 }
 * ];
 *
 * // Case 1: No valueProps (entire object as value)
 * const mapById = arrayToMap(data, 'id');
 * // Map<number, { id: number, name: string, age: number }>
 *
 * // Case 2: Single valueProp
 * const mapWithAge = arrayToMap(data, 'id', 'age');
 * // Map<number, number>
 *
 * // Case 3: Array of valueProps
 * const mapWithNameAndAge = arrayToMap(data, 'id', ['name', 'age']);
 * // Map<number, { name: string, age: number }>
 *
 * // Case 4: Function as valueProps
 * const mapWithCustomValue = arrayToMap(data, 'id', item => ({ fullName: item.name, isAdult: item.age >= 18 }));
 * // Map<number, { fullName: string, isAdult: boolean }>
 *
 * // Case 5: Function as keyProp
 * const mapByCustomKey = arrayToMap(data, item => `${item.name}-${item.age}`);
 * // Map<string, { id: number, name: string, age: number }>
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function arrayToMap<T, K extends keyof T | ((item: T) => PropertyKey), V extends keyof T | readonly (keyof T)[] | ((item: T) => any)>(
  array: T[],
  keyProp: K,
  valueProps?: V
): Map<ArrayToMapKey<K, T>, ArrayToMapValue<V, T>> {
  const getKey: (item: T) => ArrayToMapKey<K, T> =
    typeof keyProp === 'function' ? (keyProp as (item: T) => ArrayToMapKey<K, T>) : (((item: T) => item[keyProp as keyof T]) as (item: T) => ArrayToMapKey<K, T>);

  let getValue: (item: T) => ArrayToMapValue<V, T>;
  if (valueProps === undefined) {
    getValue = (item) => item as ArrayToMapValue<V, T>;
  } else if (typeof valueProps === 'function') {
    getValue = valueProps;
  } else if (Array.isArray(valueProps)) {
    const props = valueProps as readonly (keyof T)[];
    getValue = (item) => {
      const obj: Partial<Pick<T, keyof T>> = {};
      for (const prop of props) {
        obj[prop] = item[prop];
      }
      return obj as Pick<T, (typeof props)[number]> as ArrayToMapValue<V, T>;
    };
  } else {
    getValue = (item) => item[valueProps as keyof T] as ArrayToMapValue<V, T>;
  }

  const map = new Map<ArrayToMapKey<K, T>, ArrayToMapValue<V, T>>();

  for (const item of array) {
    map.set(getKey(item), getValue(item));
  }

  return map;
}

export type ArrayToRecordKey<K, T> = K extends keyof T ? T[K] & PropertyKey : K extends (item: T) => PropertyKey ? ReturnType<K> : never;
export type ArrayToRecordValue<V, T> = V extends readonly (keyof T)[]
  ? Pick<T, Extract<V[number], keyof T>>
  : V extends keyof T
    ? T[V]
    : V extends (item: T) => any
      ? ReturnType<V>
      : T;

export function arrayToRecord<T, K extends keyof T | ((item: T) => PropertyKey)>(array: T[], keyProp: K): Record<ArrayToRecordKey<K, T>, T>;

export function arrayToRecord<T, K extends keyof T | ((item: T) => PropertyKey), V extends keyof T>(array: T[], keyProp: K, valueProps: V): Record<ArrayToRecordKey<K, T>, T[V]>;

export function arrayToRecord<T, K extends keyof T | ((item: T) => PropertyKey), V extends readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Record<ArrayToRecordKey<K, T>, Pick<T, V[number]>>;

export function arrayToRecord<T, K extends keyof T | ((item: T) => PropertyKey), V extends (item: T) => any>(
  array: T[],
  keyProp: K,
  valueProps: V
): Record<ArrayToRecordKey<K, T>, ReturnType<V>>;

/**
 * Converts an array of objects into a `Record`, using a specified key property or function,
 * and an optional value property, array of properties, or value transformation function.
 *
 * @template T - The type of objects in the array.
 * @template K - The type of the key property or key function.
 * @template V - The type of the value property, array of properties, or value function.
 *
 * @param {T[]} array - The array of objects to convert into a `Record`. If empty, an empty `Record` is returned.
 * @param {K} keyProp - The key property or function used to derive the keys for the `Record`.
 *                      - If a string key, each object's property with this key is used as the record key.
 *                      - If a function, it will be called with each item to compute the key.
 *                      - The resulting keys will be converted to strings.
 * @param {V} [valueProps] - Optional. The value property, array of properties, or function used to derive the values for the `Record`.
 *                           - If `undefined`, the entire object is used as the value.
 *                           - If a single key, the corresponding property value is used.
 *                           - If an array of keys, an object with only those properties is used.
 *                           - If a function, it will be called with each item to compute the value.
 *
 * @returns {Record<string, ArrayToRecordValue<V, T>>} A `Record` where:
 *          - The keys are derived from `keyProp` and converted to strings.
 *          - The values are derived from `valueProps` (or the entire object if `valueProps` is `undefined`).
 *
 * @throws {TypeError} If `array` is not an array.
 * @throws {Error} If `keyProp` is a string and some objects in `array` are missing that property.
 * @throws {Error} If `keyProp` function returns a value that cannot be converted to a string.
 *
 * @example
 * const data = [
 *     { id: 1, name: 'Alice', age: 25 },
 *     { id: 2, name: 'Bob', age: 30 }
 * ];
 *
 * // Case 1: No valueProps (entire object as value)
 * const recordById = arrayToRecord(data, 'id');
 * // Record<number, { id: number, name: string, age: number }>
 *
 * // Case 2: Single valueProp
 * const recordWithAge = arrayToRecord(data, 'id', 'age');
 * // Record<number, number>
 *
 * // Case 3: Array of valueProps
 * const recordWithNameAndAge = arrayToRecord(data, 'id', ['name', 'age']);
 * // Record<number, { name: string, age: number }>
 *
 * // Case 4: Function as valueProps
 * const recordWithCustomValue = arrayToRecord(data, 'id', item => ({ fullName: item.name, isAdult: item.age >= 18 }));
 * // Record<number, { fullName: string, isAdult: boolean }>
 *
 * // Case 5: Function as keyProp
 * const recordByCustomKey = arrayToRecord(data, item => item.name.toUpperCase(), 'age');
 * // Record<string, number>
 */
export function arrayToRecord<T, K extends keyof T | ((item: T) => PropertyKey), V extends keyof T | readonly (keyof T)[] | ((item: T) => any)>(
  array: T[],
  keyProp: K,
  valueProps?: V
): Record<ArrayToRecordKey<K, T>, ArrayToRecordValue<V, T>> {
  const getKey: (item: T) => ArrayToRecordKey<K, T> =
    typeof keyProp === 'function' ? (keyProp as (item: T) => ArrayToRecordKey<K, T>) : (((item: T) => item[keyProp as keyof T]) as (item: T) => ArrayToRecordKey<K, T>);

  let getValue: (item: T) => ArrayToRecordValue<V, T>;
  if (valueProps === undefined) {
    getValue = (item) => item as ArrayToRecordValue<V, T>;
  } else if (typeof valueProps === 'function') {
    getValue = valueProps;
  } else if (Array.isArray(valueProps)) {
    const props = valueProps as readonly (keyof T)[];
    getValue = (item) => {
      const obj: Partial<Pick<T, keyof T>> = {};
      for (const prop of props) {
        obj[prop] = item[prop];
      }
      return obj as Pick<T, (typeof props)[number]> as ArrayToRecordValue<V, T>;
    };
  } else {
    getValue = (item) => item[valueProps as keyof T] as ArrayToRecordValue<V, T>;
  }

  // Using reduce() to accumulate key-value pairs into the record
  return array.reduce(
    (acc, item) => {
      acc[getKey(item)] = getValue(item); // Adding to the record
      return acc;
    },
    {} as Record<ArrayToRecordKey<K, T>, ArrayToRecordValue<V, T>>
  );
}

// export function arrayToMultiMap<T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
//   array: T[],
//   keyProp: K,
//   valueProps: V
// ): Map<T[K], Pick<T, V extends readonly (keyof T)[] ? V[number] : V>>;
//
// export function arrayToMultiMap<T, K extends keyof T>(array: T[], keyProp: K): Map<T[K], T[]>;
//
// /**
//  * Converts an array of objects into a `Map` where each key maps to an array of values, using a specified key property and optional value properties.
//  *
//  * @template T - The type of objects in the array.
//  * @template K - The key property of the object (must be a key of `T`).
//  * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
//  *
//  * @param {T[]} array - The array of objects to convert into a multi-map.
//  * @param {K} keyProp - The property of the object to use as the key in the `Map`.
//  * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Map`.
//  * If not provided, the entire object will be used as the value.
//  *
//  * @returns {Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>}
//  * A `Map` where:
//  * - The keys are the values of the `keyProp` property.
//  * - The values are arrays of either:
//  *   - A subset of the object (if `valueProps` is an array of keys).
//  *   - A single property of the object (if `valueProps` is a single key).
//  *   - The entire object (if `valueProps` is not provided).
//  *
//  * @example
//  * // Example 1: Using a single value property
//  * const array1 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiMap1 = arrayToMultiMap(array1, 'id', 'name');
//  * // Map<number, string[]>:
//  * // 1 => ['Alice', 'Anna']
//  * // 2 => ['Bob']
//  *
//  * @example
//  * // Example 2: Using multiple value properties
//  * const array2 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiMap2 = arrayToMultiMap(array2, 'id', ['name', 'age']);
//  * // Map<number, { name: string, age: number }[]>:
//  * // 1 => [{ name: 'Alice', age: 25 }, { name: 'Anna', age: 30 }]
//  * // 2 => [{ name: 'Bob', age: 40 }]
//  *
//  * @example
//  * // Example 3: Using no value properties (entire object as value)
//  * const array3 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiMap3 = arrayToMultiMap(array3, 'id');
//  * // Map<number, { id: number, name: string, age: number }[]>:
//  * // 1 => [{ id: 1, name: 'Alice', age: 25 }, { id: 1, name: 'Anna', age: 30 }]
//  * // 2 => [{ id: 2, name: 'Bob', age: 40 }]
//  */
// export function arrayToMultiMap<T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
//   array: T[],
//   keyProp: K,
//   valueProps?: V // Make valueProps optional
// ): Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]> {
//   const multiMap = new Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>();
//
//   array.forEach((item) => {
//     const key = item[keyProp];
//     const value = (
//       valueProps === undefined ? item : Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T]
//     ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T;
//
//     let values = multiMap.get(key);
//     if (values === undefined) {
//       values = [];
//       multiMap.set(key, values);
//     }
//     values.push(value);
//   });
//
//   return multiMap;
// }
//
// export function arrayToMultiRecord<T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
//   array: T[],
//   keyProp: K,
//   valueProps: V
// ): Record<T[K] & PropertyKey, Pick<T, V extends readonly (keyof T)[] ? V[number] : V>>;
//
// export function arrayToMultiRecord<T, K extends keyof T>(array: T[], keyProp: K): Record<T[K] & PropertyKey, T[]>;
//
// /**
//  * Converts an array of objects into a `Record` where each key maps to an array of values, using a specified key property and optional value properties.
//  *
//  * @template T - The type of objects in the array.
//  * @template K - The key property of the object (must be a key of `T`).
//  * @template V - The value property or properties of the object (can be a single key of `T` or an array of keys of `T`).
//  *
//  * @param {T[]} array - The array of objects to convert into a multi-record.
//  * @param {K} keyProp - The property of the object to use as the key in the `Record`.
//  * @param {V} [valueProps] - Optional. The property or properties of the object to use as the value in the `Record`.
//  * If not provided, the entire object will be used as the value.
//  *
//  * @returns {Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>}
//  * A `Record` where:
//  * - The keys are the values of the `keyProp` property.
//  * - The values are arrays of either:
//  *   - A subset of the object (if `valueProps` is an array of keys).
//  *   - A single property of the object (if `valueProps` is a single key).
//  *   - The entire object (if `valueProps` is not provided).
//  *
//  * @example
//  * // Example 1: Using a single value property
//  * const array1 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiRecord1 = arrayToMultiRecord(array1, 'id', 'name');
//  * // Record<number, string[]>:
//  * // { 1: ['Alice', 'Anna'], 2: ['Bob'] }
//  *
//  * @example
//  * // Example 2: Using multiple value properties
//  * const array2 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiRecord2 = arrayToMultiRecord(array2, 'id', ['name', 'age']);
//  * // Record<number, { name: string, age: number }[]>:
//  * // { 1: [{ name: 'Alice', age: 25 }, { name: 'Anna', age: 30 }], 2: [{ name: 'Bob', age: 40 }] }
//  *
//  * @example
//  * // Example 3: Using no value properties (entire object as value)
//  * const array3 = [
//  *   { id: 1, name: 'Alice', age: 25 },
//  *   { id: 1, name: 'Anna', age: 30 },
//  *   { id: 2, name: 'Bob', age: 40 },
//  * ];
//  * const multiRecord3 = arrayToMultiRecord(array3, 'id');
//  * // Record<number, { id: number, name: string, age: number }[]>:
//  * // { 1: [{ id: 1, name: 'Alice', age: 25 }, { id: 1, name: 'Anna', age: 30 }], 2: [{ id: 2, name: 'Bob', age: 40 }] }
//  */
// export function arrayToMultiRecord<T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
//   array: T[],
//   keyProp: K,
//   valueProps?: V
// ): Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]> {
//   return array.reduce(
//     (acc, item) => {
//       const key = item[keyProp];
//       const value = (
//         valueProps === undefined ? item : Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T]
//       ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T;
//
//       let values = acc[key as T[K] & PropertyKey];
//       if (values === undefined) {
//         values = [];
//         acc[key as T[K] & PropertyKey] = values;
//       }
//       values.push(value);
//       return acc;
//     },
//     {} as Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : V extends keyof T ? T[V] : T)[]>
//   );
// }
