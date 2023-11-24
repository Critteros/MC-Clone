import { useEffect, useRef } from 'react';

import { BlockLayer } from '@/blocks/BlockLayer';
import { BlockType } from '@/blocks/types';
import { initialWorldData } from './constants';
import { useBlockData } from './useBlockData';

export function TerrainRenderer() {
  const { readBlockAggregate, setBlocks } = useBlockData();
  const aggregateData = Object.entries(readBlockAggregate());
  const worldSetupRef = useRef(false);

  useEffect(() => {
    if (worldSetupRef.current) return;
    setBlocks(initialWorldData);
    worldSetupRef.current = true;
  }, [setBlocks]);

  return (
    <>
      {aggregateData.map(([blockType, { blocks }]) => (
        <BlockLayer key={blockType} type={blockType as BlockType} positions={blocks} />
      ))}
    </>
  );
}
