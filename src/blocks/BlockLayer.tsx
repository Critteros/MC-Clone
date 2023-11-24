import * as THREE from 'three';
import { useRef, useMemo, useLayoutEffect } from 'react';
import {
  InstancedRigidBodies,
  RapierRigidBody,
  type InstancedRigidBodyProps,
} from '@react-three/rapier';
import { nanoid } from 'nanoid';

import { BlockType } from './types';
import { useBlockMaterial } from './hooks/useBlockMaterial';
import { BLOCK_GEOMETRY } from './constants';

type PositionIndicies = [number, number, number];

type BlockLayerProps = {
  type: BlockType;
  positions: PositionIndicies[];
  rigidPositions?: PositionIndicies[];
};

export function BlockLayer({ type: blockType, positions, rigidPositions = [] }: BlockLayerProps) {
  const nonSolidMeshRef = useRef<THREE.InstancedMesh>(null);
  const rigidBodies = useRef<RapierRigidBody[]>(null);
  const material = useBlockMaterial(blockType);

  useLayoutEffect(() => {
    if (!nonSolidMeshRef.current) return;

    const mesh = nonSolidMeshRef.current;

    const matrixHelper = new THREE.Object3D();
    positions.forEach(([x, y, z], index) => {
      matrixHelper.position.set(x, y, z);
      matrixHelper.updateMatrix();
      mesh.setMatrixAt(index, matrixHelper.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

  const instances = useMemo(() => {
    if (rigidPositions.length === 0) return [];

    const elements: InstancedRigidBodyProps[] = rigidPositions.map(([x, y, z]) => {
      return {
        key: `rigid_${blockType}_${nanoid()}`,
        position: [x, y, z],
        type: 'fixed',
      };
    });

    return elements;
  }, [blockType, rigidPositions]);

  return (
    <>
      {rigidPositions.length > 0 && (
        <InstancedRigidBodies ref={rigidBodies} instances={instances} colliders="cuboid">
          <instancedMesh
            args={[BLOCK_GEOMETRY, material, rigidPositions.length]}
            count={rigidPositions.length}
            frustumCulled={false}
          />
        </InstancedRigidBodies>
      )}
      <instancedMesh ref={nonSolidMeshRef} args={[BLOCK_GEOMETRY, material, positions.length]} />
    </>
  );
}
