import { describe, it, expect } from 'vitest';
import { SpatialObjectStorage } from '../SpatialObjectStorage';

describe('SpatialObjectStorage', () => {
  it('stores and retrives values', () => {
    const storage = new SpatialObjectStorage(3);
    const position = [1, 2, 3];
    const object = { foo: 'bar' };
    const result = storage.setObject({ position, object }).getObject({ position });
    expect(result).toEqual({ position, ...object });
  });

  it('is immutable', () => {
    const storage = new SpatialObjectStorage(3);
    const position = [1, 2, 3];
    const object = { foo: 'bar' };
    const result = storage.setObject({ position, object });
    expect(result).not.toBe(storage);
  });

  it('allows entry iteration', () => {
    const storage = new SpatialObjectStorage(3);
    const position = [1, 2, 3];
    const object = { foo: 'bar' };
    const result = storage.setObject({ position, object }).entries();
    expect(result).toEqual([{ position, ...object }]);
  });

  it('allows removal', () => {
    const storage = new SpatialObjectStorage(3);
    const position = [1, 2, 3];
    const object = { foo: 'bar' };
    const result = storage.setObject({ position, object }).remove({ position }).entries();
    expect(result).toEqual([]);
  });

  it('allows multiple entries to be set at once', () => {
    const storage = new SpatialObjectStorage(3);
    const entries = [
      { position: [1, 2, 3], object: { foo: 'bar' } },
      { position: [4, 5, 6], object: { foo: 'baz' } },
    ];
    const result = storage.setMultipleObjects(entries).entries();
    expect(result).toEqual(entries.map(({ position, object }) => ({ position, ...object })));
  });

  it('allows multiple entries to be retrieved at once', () => {
    const storage = new SpatialObjectStorage(3);
    const entries = [
      { position: [1, 2, 3], object: { foo: 'bar' } },
      { position: [4, 5, 6], object: { foo: 'baz' } },
    ];
    const result = storage.setMultipleObjects(entries).getMultipleObjects(entries);
    expect(result).toEqual(entries.map(({ position, object }) => ({ position, ...object })));
  });
});
