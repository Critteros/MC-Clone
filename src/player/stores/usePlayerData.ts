import { create } from 'zustand';

import type { PositionTuple } from '@/types';

export const INITIAL_PLAYER_POSITION: PositionTuple = [0, 67, 0];

export type PlayerData = {
  position: PositionTuple;
};

type PlayerActions = {
  setPosition: (position: PositionTuple) => void;
};

export const usePlayerData = create<PlayerData & PlayerActions>()((set) => ({
  position: INITIAL_PLAYER_POSITION,
  setPosition: (position: PositionTuple) => set({ position }),
}));
