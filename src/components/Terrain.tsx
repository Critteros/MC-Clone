import { Mesh, NearestFilter, RepeatWrapping, TextureLoader } from 'three';

import { usePlane } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';

import { grassTexture } from '../textures/images';

export function Terrain() {
  const groundTexture = useLoader(TextureLoader, grassTexture);
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));

  groundTexture.repeat.set(100, 100);
  groundTexture.magFilter = NearestFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;

  return (
    <mesh ref={ref}>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" color="green" map={groundTexture} />
    </mesh>
  );
}
