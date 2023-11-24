import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    if (!nonSolidMeshRef.current) return;

    const mesh = nonSolidMeshRef.current;

    const matrixHelper = new THREE.Object3D();
    positions.forEach(([x, y, z], index) => {
      matrixHelper.position.set(x, y, z);
      matrixHelper.updateMatrix();
      mesh.setMatrixAt(index, matrixHelper.matrix);
    });

    return () => {
      mesh.clear();
    };
  }, [positions]);

  const instances = useMemo(() => {
    if (rigidPositions.length === 0) return [];

    const elements: InstancedRigidBodyProps[] = rigidPositions.map(([x, y, z]) => {
      return {
        key: `rigid_${blockType}_${nanoid()}`,
        position: [x, y, z],
      };
    });

    return elements;
  }, [blockType, rigidPositions]);

  return (
    <>
      <instancedMesh
        ref={nonSolidMeshRef}
        key={`non-solid-${blockType}-${positions.length}`}
        args={[BLOCK_GEOMETRY, material, positions.length]}
      />
      {rigidPositions.length > 0 && (
        <InstancedRigidBodies ref={rigidBodies} instances={instances} colliders="cuboid">
          <instancedMesh
            args={[BLOCK_GEOMETRY, material, rigidPositions.length]}
            key={`rigid-${blockType}-${rigidPositions.length}`}
            count={rigidPositions.length}
          />
        </InstancedRigidBodies>
      )}
    </>
  );
}
