import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useBlockData, type ReadWriteBlockInfo } from '../useBlockData';
import { BlockType } from '@/blocks/types';

describe('useBlockData', () => {
  it('should set and get a block', () => {
    const { result } = renderHook(() => useBlockData());

    const position: [number, number, number] = [0, 0, 0];
    const block: ReadWriteBlockInfo = { position, type: BlockType.Stone };

    act(() => {
      result.current.setBlock(block);
    });

    expect(result.current.getBlock(position)).toEqual(block);
  });

  it('should set and get multiple blocks', () => {
    const { result } = renderHook(() => useBlockData());

    const positions: [number, number, number][] = [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ];
    const blocks: ReadWriteBlockInfo[] = positions.map((position) => ({
      position,
      type: BlockType.Stone,
    }));

    act(() => {
      result.current.setBlocks(blocks);
    });

    expect(result.current.getBlocks(positions)).toEqual(blocks);
  });

  it('should perform block type aggregation', () => {
    const { result } = renderHook(() => useBlockData());

    const data: ReadWriteBlockInfo[] = [
      { position: [0, 0, 0], type: BlockType.Stone },
      { position: [1, 1, 1], type: BlockType.Stone },
      { position: [2, 2, 2], type: BlockType.Dirt },
      { position: [3, 3, 3], type: BlockType.Dirt },
      { position: [4, 4, 4], type: BlockType.Dirt },
      { position: [5, 5, 5], type: BlockType.Dirt },
      { position: [6, 6, 6], type: BlockType.Grass },
      { position: [7, 7, 7], type: BlockType.Grass },
      { position: [8, 8, 8], type: BlockType.Grass },
      { position: [9, 9, 9], type: BlockType.Grass },
    ];

    act(() => {
      result.current.setBlocks(data);
    });

    expect(result.current.readBlockAggregate()).toMatchObject({
      [BlockType.Stone]: {
        blocks: data.filter(({ type }) => type === BlockType.Stone).map(({ position }) => position),
      },
      [BlockType.Dirt]: {
        blocks: data.filter(({ type }) => type === BlockType.Dirt).map(({ position }) => position),
      },
      [BlockType.Grass]: {
        blocks: data.filter(({ type }) => type === BlockType.Grass).map(({ position }) => position),
      },
      [BlockType.Sand]: {
        blocks: data.filter(({ type }) => type === BlockType.Sand).map(({ position }) => position),
      },
      [BlockType.Log]: {
        blocks: data.filter(({ type }) => type === BlockType.Log).map(({ position }) => position),
      },
      [BlockType.Wood]: {
        blocks: data.filter(({ type }) => type === BlockType.Wood).map(({ position }) => position),
      },
    });
  });
});
