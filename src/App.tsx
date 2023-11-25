import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import { BlockRegistryProvider } from './blocks/contexts/BlockRegistryProvider';
import { BlockSelector } from './blocks/BlockSelector';
import { useKeyMap } from './hooks/useKeyMap';

import { Renderer } from './Renderer';

import { Cursor } from './Cursor';

function App() {
  const keyMap = useKeyMap();

  return (
    <main className="h-screen w-screen">
      <Canvas>
        <BlockRegistryProvider>
          <KeyboardControls map={keyMap}>
            <Suspense fallback={null}>
              <Physics gravity={[0, -9.81, 0]}>
                <Renderer />
              </Physics>
            </Suspense>
          </KeyboardControls>
        </BlockRegistryProvider>
        <Stats />
      </Canvas>
      <Cursor />
      <BlockSelector />
    </main>
  );
}

export default App;
