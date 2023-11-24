import { Suspense } from 'react';

import { Sky } from '@react-three/drei';
import { PointerLockControls } from '@react-three/drei';
import { TerrainRenderer } from './world/TerrainRenderer';
import { Player } from './player/Player';

export function Renderer() {
  return (
    <Suspense fallback={null}>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={10} />
      <PointerLockControls />
      <TerrainRenderer />
      <Player />
    </Suspense>
  );
}
