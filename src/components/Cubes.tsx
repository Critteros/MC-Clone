import { useRef, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { InstancedMesh, Texture, Matrix4 } from 'three';

// export type CubeFaces = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back';

export type CubesProps = {
  texture: Texture;
  positions: [x: number, y: number, z: number][];
};

export function Cubes({ texture, positions }: CubesProps) {
  // const ref = useRef<InstancedMesh>(null);
  const [ref] = useBox(
    (i) => ({
      position: positions[i],
      type: 'Static',
      mass: 0,
    }),
    useRef<InstancedMesh>(null),
  );

  useEffect(() => {
    const mesh = ref.current!;
    // positions.forEach((position, index) => {
    //   const [x, y, z] = position;
    //   mesh.setMatrixAt(index, new Matrix4().makeTranslation(x, y, z));
    // });
    // mesh.instanceMatrix.needsUpdate = true;
  }, [ref, positions]);

  return (
    <instancedMesh ref={ref} key={positions.length} args={[undefined, undefined, positions.length]}>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </instancedMesh>
  );
}
