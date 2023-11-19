import { useBox } from '@react-three/cannon';
import { Mesh, Texture } from 'three';

export type CubeFaces = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back';

export type CubeProps = {
  texture: Texture;
  position: [number, number, number];
};

export function Cube({ texture, position }: CubeProps) {
  const [ref] = useBox<Mesh>(() => ({
    position,
    type: 'Static',
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
