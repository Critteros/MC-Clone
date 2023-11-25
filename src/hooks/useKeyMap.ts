import { KeyboardControlsEntry } from '@react-three/drei';
import { useMemo } from 'react';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  jump = 'jump',
  leftClick = 'leftClick',
  rightClick = 'rightClick',
}

export function useKeyMap() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
      { name: Controls.leftClick, keys: ['Mouse0'] },
      { name: Controls.rightClick, keys: ['Mouse2'] },
    ],
    [],
  );

  return map;
}
