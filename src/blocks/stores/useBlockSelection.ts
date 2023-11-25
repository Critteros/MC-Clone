import { create } from 'zustand';
import { BlockType } from '../types';

type BlockSelectionState = {
  selectedBlock: BlockType;
};

type BlockSelectionStateActions = {
  setSelectedBlock: (block: BlockType) => void;
};

export const useBlockSelection = create<BlockSelectionState & BlockSelectionStateActions>()(
  (set) => ({
    selectedBlock: BlockType.Dirt,
    setSelectedBlock: (block) => set({ selectedBlock: block }),
  }),
);
