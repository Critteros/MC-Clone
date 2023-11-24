import { useCallback } from 'react';

import { useBlockDataStore } from './stores/useBlockDataStore';

import { BlockType, BlockTypeList } from '@/blocks/types';

type PositionTuple = [number, number, number];
type StoredBlockData = { type: BlockType };
export type ReadWriteBlockInfo = { position: PositionTuple } & StoredBlockData;

export function useBlockData() {
  const { blockData, updateBlockData } = useBlockDataStore();

  const setBlock = useCallback(
    ({ position, ...storedData }: ReadWriteBlockInfo) => {
      updateBlockData(blockData.setObject({ position, object: storedData }));
    },
    [blockData, updateBlockData],
  );

  const getBlock = useCallback(
    (position: PositionTuple) => {
      const entry = blockData.getObject({ position });
      if (!entry) {
        return undefined;
      }
      return { ...entry, position };
    },
    [blockData],
  );

  const setBlocks = useCallback(
    (blocks: ReadWriteBlockInfo[]) => {
      updateBlockData(
        blockData.setMultipleObjects(
          blocks.map(({ position, ...storedData }) => ({ position, object: storedData })),
        ),
      );
    },
    [blockData, updateBlockData],
  );

  const getBlocks = useCallback(
    (positions: PositionTuple[]) => {
      return positions
        .map((position) => {
          const entry = blockData.getObject({ position });
          if (!entry) {
            return undefined;
          }
          return { ...entry, position };
        })
        .filter(Boolean);
    },
    [blockData],
  );

  const readBlockAggregate = useCallback(() => {
    const entries = blockData.entries();
    const aggregateInitialEntires = BlockTypeList.map((type) => [type, { blocks: [] }] as const);
    const aggregate = Object.fromEntries(aggregateInitialEntires) as unknown as Record<
      BlockType,
      { blocks: Array<PositionTuple> }
    >;

    entries.forEach(({ position, type }) => {
      aggregate[type].blocks.push(position as PositionTuple);
    });

    return aggregate;
  }, [blockData]);

  return {
    setBlock,
    getBlock,
    setBlocks,
    getBlocks,
    readBlockAggregate,
  } as const;
}
