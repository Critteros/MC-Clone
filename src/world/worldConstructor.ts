import { BlockType } from '@/blocks/types';
import type { ReadWriteBlockInfo } from './useBlockData';

import { WORLD_RADIUS } from './constants';

type BoxSettings = {
  x?: [number, number];
  y: [number, number];
  z?: [number, number];
};

export function worldConstructor({
  type,
  x: [xMin, xMax] = [-WORLD_RADIUS, WORLD_RADIUS],
  y: [yMin, yMax],
  z: [zMin, zMax] = [-WORLD_RADIUS, WORLD_RADIUS],
}: { type: BlockType } & BoxSettings): ReadWriteBlockInfo[] {
  const entries: ReadWriteBlockInfo[] = [];

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        entries.push({ position: [x, y, z], type });
      }
    }
  }

  return entries;
}
