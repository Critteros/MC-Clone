import { create } from 'zustand';

const INITIAL_PLAYER_POSITION: PositionTuple = [0, 64, 0];

type PositionTuple = [number, number, number];

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
