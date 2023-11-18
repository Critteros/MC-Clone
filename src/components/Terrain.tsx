import { BufferGeometry, Mesh, TextureLoader } from 'three';

import { usePlane } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';

import { grassTexture } from '../textures/images';
import { RefObject } from 'react';

export function Terrain() {
  const groundTexture = useLoader(TextureLoader, grassTexture);
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));

  groundTexture.repeat.set(100, 100);

  return (
    <mesh ref={ref as RefObject<Mesh<BufferGeometry>>}>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" color="green" map={groundTexture} />
    </mesh>
  );
}
