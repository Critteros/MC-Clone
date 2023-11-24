import { useRef, useEffect, useState } from 'react';
import type { PositionTuple } from '@/types';

import { usePlayerData } from '../stores/usePlayerData';

function recalculatePhysicsBlock(playerPosition: PositionTuple): PositionTuple[] {
  const [px, py, pz] = playerPosition;

  const physicsBlocks: PositionTuple[] = [];

  for (let x = px - 1; x <= px + 1; x++) {
    for (let y = py - 2; y <= py + 1; y++) {
      for (let z = pz - 1; z <= pz + 1; z++) {
        physicsBlocks.push([x, y, z] as const);
      }
    }
  }

  return physicsBlocks;
}

export function usePlayerPhysicsBlocks() {
  const lastProcessedPositionRef = useRef<PositionTuple>([0, 0, 0]);
  const [physicsBlocks, setPhysicsBlocks] = useState<PositionTuple[]>([]);

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
