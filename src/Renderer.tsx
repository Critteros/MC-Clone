import { Suspense } from 'react';

import { Sky } from '@react-three/drei';
import { PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';

import { Terrain } from './components/Terrain';
import { Player } from './components/Player';

export function Renderer() {
  return (
    <Suspense fallback={null}>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={10} />
      <PointerLockControls />
      <Physics gravity={[0, -10, 0]}>
        <Terrain />
        <Player />
      </Physics>
    </Suspense>
  );
}
