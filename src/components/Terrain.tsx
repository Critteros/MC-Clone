import groupBy from 'lodash.groupby';

import { BlockType, textureMap } from '../blocks';

import { Block } from '../blocks';
import { Cubes } from './Cubes';

const TERRAIN_LENGTH = 10;

const terrainPositions: [x: number, y: number, z: number][] = [];

for (let x = -TERRAIN_LENGTH; x < TERRAIN_LENGTH; x++) {
  for (let z = -TERRAIN_LENGTH; z < TERRAIN_LENGTH; z++) {
    terrainPositions.push([x, 0, z]);
  }
}

const layers = {
  [BlockType.GRASS]: 1,
  // [BlockType.DIRT]: 3,
} as const satisfies Partial<Record<BlockType, number>>;

const blockMap = (() => {
  let currentY = 0;
  const blocks = Object.entries(layers).reduce((acc, [blockType, yRange]) => {
    const [minY, maxY] = [currentY, currentY + yRange];
    currentY = maxY;

    return [
      ...acc,
      ...terrainPositions
        .flatMap(([x, , z]) => Array.from({ length: maxY - minY }, (_, i) => [x, i + minY, z]))
        .map(([x, y, z]) => new Block(x, y, z, blockType as BlockType)),
    ];
  }, [] as Block[]);

  return blocks;
})();
const blockLayers = groupBy(blockMap, 'type');

export function Terrain() {
  return (
    <>
      {Object.entries(blockLayers).map(([blockType, blocks]) => (
        <Cubes
          key={blockType}
          texture={textureMap[blockType as BlockType]}
          positions={blocks.map((el) => [...el.position])}
        />
      ))}
    </>
  );
}
