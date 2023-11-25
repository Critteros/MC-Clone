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

import { useFrame } from '@react-three/fiber';

const cameraPostion = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();

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
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const selectionRef = useRef<THREE.Mesh>(null);

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
    mesh.computeBoundingSphere();
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

  useFrame(({ camera }) => {
    if (!selectionRef.current || !meshRef.current) return;
    meshRef.current.computeBoundingSphere();
    camera.getWorldPosition(cameraPostion);
    camera.getWorldDirection(cameraDirection);

    const raycaster = new THREE.Raycaster(cameraPostion, cameraDirection.normalize());
    raycaster.far = 4;

    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length === 0) {
      selectionRef.current.visible = false;
      return;
    }

    const instanceId = intersects[0].instanceId;
    if (!instanceId) return;
    selectionRef.current.visible = true;
    selectionRef.current.position.set(...rigidPositions[instanceId]);
    selectionRef.current.renderOrder = 100;
    selectionRef.current.updateMatrix();
  });

  return (
    <>
      <instancedMesh ref={nonSolidMeshRef} args={[BLOCK_GEOMETRY, material, positions.length]} />

      {rigidPositions.length > 0 && (
        <InstancedRigidBodies ref={rigidBodies} instances={instances} colliders="cuboid">
          <instancedMesh
            args={[BLOCK_GEOMETRY, material, rigidPositions.length]}
            ref={meshRef}
            count={rigidPositions.length}
            frustumCulled={false}
          />
        </InstancedRigidBodies>
      )}
      <mesh ref={selectionRef}>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial color="white" opacity={0.8} depthWrite={false} />
      </mesh>
    </>
  );
}
