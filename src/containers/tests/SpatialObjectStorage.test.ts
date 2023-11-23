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
});
