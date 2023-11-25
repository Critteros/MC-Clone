import { create } from 'zustand';

import { BlockType } from '@/blocks/types';
import { SpatialObjectStorage } from '@/containers/SpatialObjectStorage';

type BlockObjectEntry = { type: BlockType };

type BlockDataState = {
  blockData: SpatialObjectStorage<BlockObjectEntry>;
};

type BlockObjectActions = {
  updateBlockData: (blockData: SpatialObjectStorage<BlockObjectEntry>) => void;
};

export const useBlockDataStore = create<BlockDataState & BlockObjectActions>()((set) => ({
  blockData: new SpatialObjectStorage<BlockObjectEntry>(3),
  updateBlockData: (blockData) => set({ blockData }),
}));
