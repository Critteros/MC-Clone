import * as THREE from 'three';
import { useRef, useMemo, useLayoutEffect } from 'react';
import {
  InstancedRigidBodies,
  RapierRigidBody,
  type InstancedRigidBodyProps,
} from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { nanoid } from 'nanoid';

import { useBlockData } from '@/world/useBlockData';

import { BlockType } from './types';
import { useBlockMaterial } from './hooks/useBlockMaterial';
import { BLOCK_GEOMETRY } from './constants';
import { useBlockTexture } from './hooks/useBlockTexture';

type PositionIndicies = [number, number, number];

type BlockLayerProps = {
  type: BlockType;
  positions: PositionIndicies[];
  rigidPositions?: PositionIndicies[];
  onSelection?: (position: PositionIndicies, distance: number) => void;
  onDeselection?: () => void;
  selection?: PositionIndicies;
};

export function BlockLayer({
  type: blockType,
  positions,
  rigidPositions = [],
  onSelection,
  onDeselection,
  selection,
}: BlockLayerProps) {
  const nonSolidMeshRef = useRef<THREE.InstancedMesh>(null);
  const rigidBodies = useRef<RapierRigidBody[]>(null);
  const material = useBlockMaterial(blockType);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const selectionRef = useRef<THREE.Mesh>(null);
  const texture = useBlockTexture(blockType);
  const { removeBlock } = useBlockData();

  const cameraPostion = new THREE.Vector3();
  const cameraDirection = new THREE.Vector3();

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

  useLayoutEffect(() => {
    if (!selectionRef.current) return;
    if (!selection) {
      selectionRef.current.visible = false;
      return;
    }
    selectionRef.current.visible = true;
    selectionRef.current.position.set(...selection);
    selectionRef.current.updateMatrix();
  }, [selection]);

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
  }, [rigidPositions, blockType]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    meshRef.current.computeBoundingSphere();
    camera.getWorldPosition(cameraPostion);
    camera.getWorldDirection(cameraDirection);

    const raycaster = new THREE.Raycaster(cameraPostion, cameraDirection.normalize());
    raycaster.far = 4;

    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length === 0) {
      onDeselection?.();
      return;
    }
    const instance = intersects[0];
    if (!instance) return;

    const instanceId = instance.instanceId;
    if (instanceId == null) return;
    const position = rigidPositions[instanceId];
    if (!position) return;

    onSelection?.(position, Math.round(instance.distance * 100) / 100);
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
            onClick={(e) => {
              e.stopPropagation();
              if (!selectionRef.current?.visible) return;
              const position = e.instanceId && rigidPositions[e.instanceId];
              if (!position) return;
              removeBlock(position);
            }}
          />
        </InstancedRigidBodies>
      )}
      <mesh ref={selectionRef}>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial map={texture} color="white" />
      </mesh>
    </>
  );
}
