import { BlockLayer } from '@/blocks/BlockLayer';
import { BlockType } from '@/blocks/types';
import { useBlockData } from './useBlockData';

export function TerrainRenderer() {
  const { readBlockAggregate } = useBlockData();
  const aggregateData = Object.entries(readBlockAggregate());

  return (
    <>
      {aggregateData.map(([blockType, { blocks }]) => (
        <BlockLayer key={blockType} type={blockType as BlockType} positions={blocks} />
      ))}
    </>
  );
}
