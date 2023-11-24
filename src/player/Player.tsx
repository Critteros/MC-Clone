import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { Controls } from '@/hooks/useKeyMap';

import { usePlayerPositionRef } from './hooks/usePlayerPositionRef';

import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';

import { useKeyboardControls } from '@react-three/drei';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const rigidBodyRef = useRef<RAPIER.RigidBody>(null);
  const rapier = useRapier();
  const [, get] = useKeyboardControls<Controls>();
  const { setPosition } = usePlayerPositionRef();

  useFrame(({ camera }) => {
    if (!rigidBodyRef.current) return;

    const { back, forward, jump, left, right } = get();
    const velocity = rigidBodyRef.current.linvel();

    const translationVector = rigidBodyRef.current.translation();
    const playerPosition = [translationVector.x, translationVector.y, translationVector.z] as const;

    // update camera position
    camera.position.set(...playerPosition);

    // movement
    frontVector.set(0, 0, (back ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED);
    rigidBodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // handle jumping
    const world = rapier.world;
    const ray = world.castRay(new RAPIER.Ray(translationVector, { x: 0, y: -1, z: 0 }), 1, true);
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;

    if (grounded && jump) {
      rigidBodyRef.current.setLinvel({ x: 0, y: 7.5, z: 0 }, true);
    }
    // Update store state
    setPosition(playerPosition);
  });

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        colliders={false}
        mass={1}
        position={[0, 67, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
  );
}
