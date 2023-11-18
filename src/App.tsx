import { Canvas } from '@react-three/fiber';
import { Renderer } from './Renderer';

import { useKeyMap } from './hooks/useKeyMap';

import { KeyboardControls } from '@react-three/drei';

function App() {
  const keyMap = useKeyMap();

  return (
    <main className="w-screen h-screen">
      <Canvas>
        <KeyboardControls map={keyMap}>
          <Renderer />
        </KeyboardControls>
      </Canvas>
    </main>
  );
}

export default App;
