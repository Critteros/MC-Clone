export enum BlockType {
  Air = 'air',
  Dirt = 'dirt',
  Glass = 'glass',
  Grass = 'grass',
  Log = 'log',
  Wood = 'wood',
  Sand = 'sand',
  Stone = 'stone',
}

export type SolidBlockType = Exclude<BlockType, BlockType.Air>;
