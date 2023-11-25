import { useRef, useEffect, useState } from 'react';
import type { PositionTuple } from '@/types';

import { usePlayerData } from '../stores/usePlayerData';
import { useBlockDataStore } from '@/world/stores/useBlockDataStore';

const RADIUS = 3;

function recalculatePhysicsBlock(playerPosition: PositionTuple): PositionTuple[] {
  const [px, py, pz] = playerPosition;

  const physicsBlocks: PositionTuple[] = [];

  for (let x = px - RADIUS; x <= px + RADIUS; x++) {
    for (let y = py - RADIUS; y <= py + RADIUS; y++) {
      for (let z = pz - RADIUS; z <= pz + RADIUS; z++) {
        physicsBlocks.push([x, y, z] as const);
      }
    }
  }

  // Reduce the amout of physics block by removing the ones whuch are surrounded by
  // other physics blocks.
  const blockData = useBlockDataStore.getState().blockData;
  return physicsBlocks.filter(([x, y, z]) => {
    const blockExists = !!blockData.getObject({ position: [x, y, z] });
    if (!blockExists) return false;

    const topPosition = [x, y + 1, z];
    const topBlock = blockData.getObject({ position: topPosition });

    const bottomPosition = [x, y - 1, z];
    const bottomBlock = blockData.getObject({ position: bottomPosition });

    const leftPosition = [x - 1, y, z];
    const leftBlock = blockData.getObject({ position: leftPosition });

    const rightPosition = [x + 1, y, z];
    const rightBlock = blockData.getObject({ position: rightPosition });

    const frontPosition = [x, y, z - 1];
    const frontBlock = blockData.getObject({ position: frontPosition });

    const backPosition = [x, y, z + 1];
    const backBlock = blockData.getObject({ position: backPosition });

    const isSurrounded =
      topBlock && bottomBlock && leftBlock && rightBlock && frontBlock && backBlock;

    return !isSurrounded;
  });
}

export function usePlayerPhysicsBlocks() {
  const lastProcessedPositionRef = useRef<PositionTuple>([0, 0, 0]);
  const [physicsBlocks, setPhysicsBlocks] = useState<PositionTuple[]>([]);
  const blockData = useBlockDataStore((s) => s.blockData);

  useEffect(() => {
    const [x, y, z] = lastProcessedPositionRef.current;
    const physicsBlocks = recalculatePhysicsBlock([x, y, z]);
    setPhysicsBlocks(physicsBlocks);
  }, [blockData]);

  useEffect(
    () =>
      usePlayerData.subscribe(({ position }) => {
        const [x, y, z] = position.map(Math.floor);
        const [lastX, lastY, lastZ] = lastProcessedPositionRef.current;
        if (x === lastX && y === lastY && z === lastZ) return;

        const physicsBlocks = recalculatePhysicsBlock([x, y, z]);
        lastProcessedPositionRef.current = [x, y, z];
        setPhysicsBlocks(physicsBlocks);
      }),
    [],
  );

  return physicsBlocks;
}
