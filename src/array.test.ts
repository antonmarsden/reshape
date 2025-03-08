import { arrayToMap } from './array.js';
import { test, describe, expect } from 'bun:test';

// Sample data
const testArray = [
  { id: 'a1', name: 'Alice', age: 30 },
  { id: 'b2', name: 'Bob', age: 25 },
  { id: 'c3', name: 'Charlie', age: 35 },
];

describe('arrayToMap - Type Safety', () => {
  test('should infer correct key type', () => {
    const map = arrayToMap(testArray, 'id');
    type ExpectedKey = string;
    const key: ExpectedKey = [...map.keys()][0];
    expect(typeof key).toBe('string');
  });

  test('should infer correct value type when valueProps is undefined', () => {
    const map = arrayToMap(testArray, 'id');
    type ExpectedValue = { id: string; name: string; age: number };
    const value: ExpectedValue = map.get('a1')!;
    expect(value).toHaveProperty('name');
  });

  test('should infer correct value type when selecting specific properties', () => {
    const map = arrayToMap(testArray, 'id', ['name']);
    type ExpectedValue = { name: string };
    const value: ExpectedValue = map.get('a1')!;
    expect(value).toHaveProperty('name');
    expect(value).not.toHaveProperty('age');
  });

  test('should infer correct value type when valueProps is a function', () => {
    const map = arrayToMap(testArray, 'id', ({ name, age }) => ({ nameAge: name + age }));
    type ExpectedValue = { nameAge: string };
    const value: ExpectedValue = map.get('a1')!;
    expect(value).toHaveProperty('nameAge');
    expect(value).not.toHaveProperty('age');
  });

  test('should infer correct key type when keyProp is a function', () => {
    const map = arrayToMap(testArray, (item) => item.name);
    type ExpectedKey = string;
    const key: ExpectedKey = [...map.keys()][0];
    expect(typeof key).toBe('string');
  });

  test('should enforce compile-time error if keyProp is invalid', () => {
    // @ts-expect-error - `nonExistentKey` does not exist in testArray items
    arrayToMap(testArray, 'nonExistentKey');
  });

  test('should enforce compile-time error if valueProps is invalid', () => {
    // @ts-expect-error - `nonExistentProp` does not exist in testArray items
    arrayToMap(testArray, 'id', ['nonExistentProp']);
  });
});
