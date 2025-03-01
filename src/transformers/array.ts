/**
 * Converts an array of objects into a `Map`, using a specified property as the key
 * and either a single property or multiple properties as the value.
 *
 * @template T - The type of objects in the input array.
 * @template K - The key property of the object, which will be used as the `Map` key.
 * @template V - Either a single property key (for simple values) or an array of property keys (for object values).
 *
 * @param array - The input array of objects to be transformed into a `Map`.
 * @param keyProp - The property of each object to be used as the key in the `Map`.
 * @param valueProps - A single property key to use as the value, or an array of property keys to create a subset of the object.
 *
 * @returns A `Map` where:
 * - The keys are derived from the specified `keyProp` of each object.
 * - The values are either:
 *   - The value of the specified property if `valueProps` is a single key.
 *   - A subset of the object containing only the specified properties if `valueProps` is an array of keys.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 }
 * ];
 *
 * // Mapping by `id`, extracting only `name`
 * const nameMap = arrayToMap(users, 'id', 'name');
 * console.log(nameMap.get(1)); // 'Alice'
 *
 * // Mapping by `id`, extracting `name` and `age`
 * const userSubsetMap = arrayToMap(users, 'id', ['name', 'age']);
 * console.log(userSubsetMap.get(1)); // { name: 'Alice', age: 25 }
 * ```
 */
export const arrayToMap = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Map<T[K], V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>]> => {
  return new Map(
    array.map((item) => [
      item[keyProp],
      (Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T]) as V extends readonly (keyof T)[]
        ? Pick<T, V[number]>
        : T[Extract<V, keyof T>],
    ])
  );
};

/**
 * Converts an array of objects into a `Record`, using a specified property as the key
 * and either a single property or multiple properties as the value.
 *
 * @template T - The type of objects in the input array.
 * @template K - The key property of the object, used as the `Record` key.
 * @template V - Either a single property key (for extracting a single value) or an array of property keys (for extracting a subset of each object).
 *
 * @param array - The input array of objects to be transformed into a `Record`.
 * @param keyProp - The property of each object to be used as the key in the `Record`.
 * @param valueProps - A single property key to use as the value, or an array of property keys to create a subset of the object.
 *
 * @returns A `Record` where:
 * - Each key is derived from the specified `keyProp` of the objects in the array.
 * - Each value is one of the following:
 *   - If `valueProps` is a single key, the value is a primitive or a single property value.
 *   - If `valueProps` is an array of keys, the value is an object containing only the specified properties.
 * - If multiple objects have the same key, the last one in the array will overwrite previous values.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, username: 'alice', age: 25 },
 *   { id: 2, username: 'bob', age: 30 }
 * ];
 *
 * // Creating a Record with `id` as key and `username` as value
 * const userRecord = arrayToRecord(users, 'id', 'username');
 * console.log(userRecord); // { 1: 'alice', 2: 'bob' }
 *
 * // Creating a Record with `id` as key and multiple properties (`username`, `age`)
 * const detailedUserRecord = arrayToRecord(users, 'id', ['username', 'age']);
 * console.log(detailedUserRecord);
 * // {
 * //   1: { username: 'alice', age: 25 },
 * //   2: { username: 'bob', age: 30 }
 * // }
 * ```
 */
export const arrayToRecord = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Record<T[K] & PropertyKey, V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>]> => {
  return array.reduce(
    (acc, item) => {
      const key = item[keyProp];
      const value = Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T];
      acc[key as T[K] & PropertyKey] = value as V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>];
      return acc;
    },
    {} as Record<T[K] & PropertyKey, V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>]>
  );
};

/**
 * Converts an array of objects into a `Map`, grouping values by a specified key property.
 * Each key in the resulting `Map` maps to an array of corresponding values.
 *
 * @template T - The type of objects in the input array.
 * @template K - The key property of the object, used as the `Map` key.
 * @template V - Either a single property key (for extracting a single value) or an array of property keys (for extracting a subset of each object).
 *
 * @param array - The input array of objects to be transformed into a `Map`.
 * @param keyProp - The property of each object to be used as the key in the `Map`.
 * @param valueProps - A single property key to use as the value, or an array of property keys to create a subset of the object.
 *
 * @returns A `Map` where:
 * - Each key is derived from the specified `keyProp` of the objects in the array.
 * - Each value is an array of corresponding values from the original objects:
 *   - If `valueProps` is a single key, the values in the array are primitive values.
 *   - If `valueProps` is an array of keys, the values are objects containing only the specified properties.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, group: 'admin', name: 'Alice' },
 *   { id: 2, group: 'user', name: 'Bob' },
 *   { id: 3, group: 'admin', name: 'Charlie' }
 * ];
 *
 * // Grouping users by `group`, extracting only `name`
 * const nameMultiMap = arrayToMultiMap(users, 'group', 'name');
 * console.log(nameMultiMap.get('admin')); // ['Alice', 'Charlie']
 *
 * // Grouping users by `group`, extracting both `id` and `name`
 * const userSubsetMultiMap = arrayToMultiMap(users, 'group', ['id', 'name']);
 * console.log(userSubsetMultiMap.get('admin')); // [{ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }]
 * ```
 */
export const arrayToMultiMap = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]> => {
  const multiMap = new Map<T[K], (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]>();

  array.forEach((item) => {
    const key = item[keyProp];
    const value = (
      Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T]
    ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>];
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
 * Converts an array of objects into a `Record`, grouping values by a specified key property.
 * Each key in the resulting `Record` maps to an array of corresponding values.
 *
 * @template T - The type of objects in the input array.
 * @template K - The key property of the object, used as the `Record` key.
 * @template V - Either a single property key (for extracting a single value) or an array of property keys (for extracting a subset of each object).
 *
 * @param array - The input array of objects to be transformed into a `Record`.
 * @param keyProp - The property of each object to be used as the key in the `Record`.
 * @param valueProps - A single property key to use as the value, or an array of property keys to create a subset of the object.
 *
 * @returns A `Record` where:
 * - Each key is derived from the specified `keyProp` of the objects in the array.
 * - Each value is an array of corresponding values from the original objects:
 *   - If `valueProps` is a single key, the values in the array are primitive values.
 *   - If `valueProps` is an array of keys, the values are objects containing only the specified properties.
 *
 * @example
 * ```ts
 * const users = [
 *   { id: 1, group: 'admin', name: 'Alice' },
 *   { id: 2, group: 'user', name: 'Bob' },
 *   { id: 3, group: 'admin', name: 'Charlie' }
 * ];
 *
 * // Grouping users by `group`, extracting only `name`
 * const nameMultiRecord = arrayToMultiRecord(users, 'group', 'name');
 * console.log(nameMultiRecord.admin); // ['Alice', 'Charlie']
 *
 * // Grouping users by `group`, extracting both `id` and `name`
 * const userSubsetMultiRecord = arrayToMultiRecord(users, 'group', ['id', 'name']);
 * console.log(userSubsetMultiRecord.admin); // [{ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }]
 * ```
 */
export const arrayToMultiRecord = <T, K extends keyof T, V extends keyof T | readonly (keyof T)[]>(
  array: T[],
  keyProp: K,
  valueProps: V
): Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]> => {
  return array.reduce(
    (acc, item) => {
      const key = item[keyProp];
      const value = (
        Array.isArray(valueProps) ? Object.fromEntries(valueProps.map((prop) => [prop, item[prop as keyof T]])) : item[valueProps as keyof T]
      ) as V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>];

      let values = acc[key as T[K] & PropertyKey];
      if (values === undefined) {
        values = [];
        acc[key as T[K] & PropertyKey] = values;
      }
      values.push(value);
      return acc;
    },
    {} as Record<T[K] & PropertyKey, (V extends readonly (keyof T)[] ? Pick<T, V[number]> : T[Extract<V, keyof T>])[]>
  );
};
