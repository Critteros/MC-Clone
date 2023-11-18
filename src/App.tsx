import { Canvas } from '@react-three/fiber';
import { Renderer } from './Renderer';

function App() {
  return (
    <main className="w-screen h-screen">
      <Canvas>
        <Renderer />
      </Canvas>
    </main>
  );
}

export default App;
