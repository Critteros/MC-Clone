import { renderHook, act } from '@testing-library/react';

import { usePlayerPositionRef } from '../usePlayerPositionRef';

import { usePlayerData } from '../../stores/usePlayerData';

describe('usePlayerPositionRef', () => {
  it('should return a ref to the player position', () => {
    const { result } = renderHook(() => usePlayerPositionRef());

    expect(result.current.positionRef).toBeDefined();
  });

  it('can be used to perform transient updates', () => {
    const { result } = renderHook(() => ({
      playerPositionRef: usePlayerPositionRef(),
      playerData: usePlayerData(),
    }));

    act(() => result.current.playerData.setPosition([1, 2, 3]));
    expect(result.current.playerData.position).toEqual([1, 2, 3]);
    expect(result.current.playerPositionRef.positionRef.current).toEqual([1, 2, 3]);
  });

  it('can change the player position', () => {
    const { result } = renderHook(() => ({
      playerPositionRef: usePlayerPositionRef(),
      playerData: usePlayerData(),
    }));

    act(() => result.current.playerPositionRef.setPosition([1, 2, 3]));
    expect(result.current.playerData.position).toEqual([1, 2, 3]);
    expect(result.current.playerPositionRef.positionRef.current).toEqual([1, 2, 3]);
  });
});
