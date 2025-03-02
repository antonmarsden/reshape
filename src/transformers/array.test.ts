import { arrayToMap, arrayToMultiMap, arrayToMultiRecord, arrayToRecord } from './array';
import { test } from 'bun:test';

const data = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
];

test('arrayToMap', () => {
  arrayToMap(data, 'id', 'name');
});

test('arrayToRecord', () => {
  arrayToRecord(data, 'id', 'name');
});

test('arrayToObjectMap', () => {
  arrayToMap(data, 'id', ['name', 'age']);
  arrayToMap(data, 'id');
});

test('arrayToObjectRecord', () => {
  arrayToRecord(data, 'id', ['name', 'age']);
  arrayToRecord(data, 'id');
});

// Example usage:
const data2 = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 1, name: 'Alex', age: 28 },
  { id: 3, name: 'Charlie', age: 35 },
];

test('arrayToMultiMap', () => {
  arrayToMultiMap(data2, 'id', 'name');
  arrayToMultiMap(data2, 'id', ['name', 'age'] as const);
  arrayToMultiMap(data2, 'id');
});

test('arrayToMultiRecord', () => {
  arrayToMultiRecord(data2, 'id', 'name');
  arrayToMultiRecord(data2, 'id', ['name', 'age'] as const);
  arrayToMultiRecord(data2, 'id');
});
