import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';

import { Controls } from '@/hooks/useKeyMap';
import type { PositionTuple } from '@/types';

import { usePlayerPositionRef } from './hooks/usePlayerPositionRef';
import { INITIAL_PLAYER_POSITION } from './stores/usePlayerData';

const SPEED = 5;

export function Player() {
  const rigidBodyRef = useRef<RAPIER.RigidBody>(null);
  const rapier = useRapier();
  const [, get] = useKeyboardControls<Controls>();
  const { setPosition } = usePlayerPositionRef();

  useFrame(({ camera }) => {
    if (!rigidBodyRef.current) return;

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    const { back, forward, jump, left, right } = get();
    const velocity = rigidBodyRef.current.linvel();

    const translationVector = rigidBodyRef.current.translation();
    const playerPosition = [
      translationVector.x,
      translationVector.y,
      translationVector.z,
    ] as PositionTuple;

    // update camera position
    camera.position.set(...playerPosition);

    // Calculate movement direction
    frontVector.set(0, 0, (back ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .applyEuler(camera.rotation)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize()
      .normalize()
      .multiplyScalar(SPEED);

    const world = rapier.world;

    const terainCollisionRay = world.castRay(
      new RAPIER.Ray(
        { x: playerPosition[0], y: playerPosition[1] - 0.5, z: playerPosition[2] },
        { x: direction.x, y: 0, z: direction.z },
      ),
      2,
      false,
      undefined,
      undefined,
      rigidBodyRef.current.collider(0),
    );
    const shouldNotApplyMovement =
      terainCollisionRay && terainCollisionRay.collider && terainCollisionRay.toi <= 0.101;

    if (!shouldNotApplyMovement) {
      rigidBodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
    }

    // handle jumping
    const ray = world.castRay(
      new RAPIER.Ray(
        { x: playerPosition[0], y: playerPosition[1], z: playerPosition[2] },
        { x: 0, y: -1, z: 0 },
      ),
      2,
      false,
      undefined,
      undefined,
      rigidBodyRef.current.collider(0),
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;

    if (jump && grounded) {
      rigidBodyRef.current.setLinvel(new THREE.Vector3(0, 5, 0), true);
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
        ccd
        position={INITIAL_PLAYER_POSITION}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[1, 0.25]} />
      </RigidBody>
    </>
  );
}
