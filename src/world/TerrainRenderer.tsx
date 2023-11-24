import { useEffect, useRef, useMemo } from 'react';

import { BlockLayer } from '@/blocks/BlockLayer';
import { BlockType } from '@/blocks/types';
import { usePlayerPhysicsBlocks } from '@/player/hooks/usePlayerPhysicsBlocks';

import { initialWorldData } from './constants';
import { useBlockData } from './useBlockData';

export function TerrainRenderer() {
  const { readBlockAggregate, setBlocks, getBlock } = useBlockData();
  const physicsBlocks = usePlayerPhysicsBlocks();

  const worldSetupRef = useRef(false);

  useEffect(() => {
    if (worldSetupRef.current) return;
    setBlocks(initialWorldData);
    worldSetupRef.current = true;
  }, [setBlocks]);

  const aggregateData = useMemo(() => Object.entries(readBlockAggregate()), [readBlockAggregate]);

  const existingPhysicsBlocks = useMemo(
    () => physicsBlocks.map((position) => getBlock(position)).filter(Boolean),
    [getBlock, physicsBlocks],
  );

  const blockData = useMemo(() => {
    const entries = aggregateData.map(([blockType, { blocks }]) => {
      const physicsToRender = existingPhysicsBlocks
        .filter((block) => block.type === blockType)
        .map((block) => block.position);

      return [
        blockType as BlockType,
        { positions: blocks, rigidPositions: physicsToRender },
      ] as const;
    });

    return entries;
  }, [aggregateData, existingPhysicsBlocks]);

  return (
    <>
      {blockData.map(([blockType, { positions, rigidPositions }]) => (
        <BlockLayer
          key={`block-layer-${blockType}`}
          type={blockType}
          positions={positions}
          rigidPositions={rigidPositions}
        />
      ))}
    </>
  );
}
