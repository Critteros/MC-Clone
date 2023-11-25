import { worldConstructor } from './worldConstructor';
import { BlockType } from '@/blocks/types';

export const WORLD_RADIUS = 16;
export const WORLD_HEIGHT = 64;

export const initialWorldData = [
  ...worldConstructor({
    type: BlockType.Bedrock,
    y: [0, 0],
  }),
  ...worldConstructor({
    type: BlockType.Stone,
    y: [1, 50],
  }),
  ...worldConstructor({
    type: BlockType.Dirt,
    y: [51, 59],
  }),
  ...worldConstructor({
    type: BlockType.Grass,
    y: [60, 60],
  }),
];
