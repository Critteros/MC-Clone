import { worldConstructor } from './worldConstructor';
import { BlockType } from '@/blocks/types';

export const WORLD_RADIUS = 32;
export const WORLD_HEIGHT = 64;

export const initialWorldData = [
  ...worldConstructor({
    type: BlockType.Bedrock,
    y: [0, 0],
  }),
  ...worldConstructor({
    type: BlockType.Dirt,
    y: [1, 5],
  }),
  ...worldConstructor({
    type: BlockType.Grass,
    y: [6, 6],
  }),
];
