import { useRef, useEffect } from 'react';

import { usePlayerData } from '../stores/usePlayerData';

export function usePlayerPositionRef() {
  const setPosition = usePlayerData((state) => state.setPosition);
  const positionRef = useRef(usePlayerData.getState().position);

  useEffect(() => usePlayerData.subscribe(({ position }) => (positionRef.current = position)), []);

  return {
    positionRef,
    setPosition,
  } as const;
}
