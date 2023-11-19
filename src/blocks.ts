import { Texture } from 'three';

import {
  dirtTexture,
  glassTexture,
  grassTexture,
  logTexture,
  sandTexture,
  stoneTexture,
  woodTexture,
} from './textures/textures';

export enum BlockType {
  DIRT = 'dirt',
  GLASS = 'glass',
  GRASS = 'grass',
  LOG = 'log',
  WOOD = 'wood',
  SAND = 'sand',
  STONE = 'stone',
}

export const textureMap = {
  [BlockType.DIRT]: dirtTexture,
  [BlockType.GLASS]: glassTexture,
  [BlockType.GRASS]: grassTexture,
  [BlockType.LOG]: logTexture,
  [BlockType.WOOD]: woodTexture,
  [BlockType.SAND]: sandTexture,
  [BlockType.STONE]: stoneTexture,
} as const satisfies Record<BlockType, Texture>;

export class Block {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public type: BlockType,
  ) {}

  get position() {
    return [this.x, this.y, this.z] as const;
  }

  get texture() {
    return textureMap[this.type];
  }
}
