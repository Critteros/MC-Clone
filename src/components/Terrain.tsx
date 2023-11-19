import { InstancedMesh, NearestFilter, RepeatWrapping, TextureLoader, Matrix4 } from 'three';

import { useBox } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';

import { grassTexture } from '../textures/images';
import { useEffect, useMemo, useRef } from 'react';

export function Terrain() {
  const groundTexture = useLoader(TextureLoader, grassTexture);

  const gridPositions = useMemo(() => {
    const positions = [];

    for (let x = -5; x < 5; x++) {
      for (let z = -5; z < 5; z++) {
        positions.push([x, 0, z]);
      }
    }

    return positions as [number, number, number][];
  }, []);

  const [ref] = useBox(
    (i) => ({
      type: 'Dynamic',
      position: gridPositions[i],
    }),
    useRef<InstancedMesh>(null),
  );

  useEffect(() => {
    gridPositions.forEach((position, index) => {
      const [x, y, z] = position;

      ref.current?.setMatrixAt(index, new Matrix4().makeTranslation(x, y, z));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [gridPositions, ref]);

  groundTexture.magFilter = NearestFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;

  return (
    <instancedMesh
      ref={ref}
      key={gridPositions.length}
      args={[undefined, undefined, gridPositions.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </instancedMesh>
  );
}
