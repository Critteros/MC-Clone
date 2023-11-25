import { useEffect, useRef, useMemo, useState } from 'react';
import { GroupProps } from '@react-three/fiber';

import { BlockLayer } from '@/blocks/BlockLayer';
import { BlockType } from '@/blocks/types';
import { getPlaceBlockPosition } from '@/blocks/utils';
import { usePlayerPhysicsBlocks } from '@/player/hooks/usePlayerPhysicsBlocks';
import type { PositionTuple } from '@/types';
import { useBlockSelection } from '@/blocks/stores/useBlockSelection';

import { initialWorldData } from './constants';
import { useBlockData } from './useBlockData';

export function TerrainRenderer() {
  const { readBlockAggregate, setBlocks, getBlock, removeBlock, setBlock } = useBlockData();
  const [closestSelection, setClosestSelection] = useState<{
    type: BlockType;
    distance: number;
    position: PositionTuple;
    faceIndex: number;
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

  const getOnSelection =
    (blockType: BlockType) => (position: PositionTuple, distance: number, faceIndex: number) => {
      if (!closestSelection) {
        setClosestSelection({ type: blockType, distance, position, faceIndex });
        return;
      }
      if (closestSelection.type === blockType && distance !== closestSelection.distance) {
        setClosestSelection({ type: blockType, distance, position, faceIndex });
        return;
      }
      const currentDistance = closestSelection.distance;
      if (distance < currentDistance) {
        setClosestSelection({ type: blockType, distance, position, faceIndex });
      }
    };

  const getOnDeselection = (blockType: BlockType) => () => {
    if (!closestSelection) return;
    if (closestSelection.type === blockType) {
      setClosestSelection(null);
    }
  };

  const handleMeshClick: GroupProps['onClick'] = (e) => {
    e.stopPropagation();

    if (!closestSelection) return;

    if (e.button === 0) {
      removeBlock(closestSelection.position);
      return;
    }
    if (e.button === 2) {
      const placePosition = getPlaceBlockPosition({
        position: closestSelection.position,
        face: closestSelection.faceIndex,
      });
      const selectedBlock = useBlockSelection.getState().selectedBlock;
      setBlock({ position: placePosition, type: selectedBlock });
      return;
    }
  };

  return (
    <group onClick={handleMeshClick}>
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
    </group>
  );
}
