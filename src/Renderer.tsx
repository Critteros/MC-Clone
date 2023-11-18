import { Sky } from '@react-three/drei';
import { PointerLockControls } from '@react-three/drei';

export function Renderer() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <PointerLockControls />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
}
