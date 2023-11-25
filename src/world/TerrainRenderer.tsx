import { useEffect, useRef, useMemo, useState } from 'react';

import { BlockLayer } from '@/blocks/BlockLayer';
import { BlockType } from '@/blocks/types';
import { usePlayerPhysicsBlocks } from '@/player/hooks/usePlayerPhysicsBlocks';
import type { PositionTuple } from '@/types';

import { initialWorldData } from './constants';
import { useBlockData } from './useBlockData';

export function TerrainRenderer() {
  const { readBlockAggregate, setBlocks, getBlock } = useBlockData();
  const [closestSelection, setClosestSelection] = useState<{
    type: BlockType;
    distance: number;
    position: PositionTuple;
  } | null>(null);
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

  const getOnSelection = (blockType: BlockType) => (position: PositionTuple, distance: number) => {
    if (!closestSelection) {
      setClosestSelection({ type: blockType, distance, position });
      return;
    }
    if (closestSelection.type === blockType && distance !== closestSelection.distance) {
      setClosestSelection({ type: blockType, distance, position });
      return;
    }
    const currentDistance = closestSelection.distance;
    if (distance < currentDistance) {
      setClosestSelection({ type: blockType, distance, position });
    }
  };

  const getOnDeselection = (blockType: BlockType) => () => {
    if (!closestSelection) return;
    if (closestSelection.type === blockType) {
      setClosestSelection(null);
    }
  };

  return (
    <>
      {blockData.map(([blockType, { positions, rigidPositions }]) => (
        <BlockLayer
          key={`block-layer-${blockType}`}
          type={blockType}
          positions={positions}
          rigidPositions={rigidPositions}
          onSelection={getOnSelection(blockType)}
          onDeselection={getOnDeselection(blockType)}
          selection={closestSelection?.type === blockType ? closestSelection.position : undefined}
        />
      ))}
    </>
  );
}
