import { useKeyboardControls } from '@react-three/drei';
import { Controls } from '../hooks/useKeyMap';
import { useThree } from '@react-three/fiber';

import { useSphere } from '@react-three/cannon';
import { useEffect, useRef } from 'react';

import { useFrame } from '@react-three/fiber';

import { Mesh, Vector3 } from 'three';

const SPEED = 5;
const JUMP_FORCE = 5;

export function Player() {
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);

  const [, get] = useKeyboardControls<Controls>();
  const { camera } = useThree();

  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 0],
  }));

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => (position.current = p));
  }, [api.velocity, api.position]);

  useFrame(() => {
    const { back, forward, jump, left, right } = get();
    const [cameraX, cameraY, cameraZ] = position.current;
    const [velX, velY, velZ] = velocity.current;

    camera.position.set(cameraX, cameraY, cameraZ);

    const frontVector = new Vector3(0, 0, (back ? 1 : 0) - (forward ? 1 : 0));

    const sideVector = new Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    const direction = new Vector3()
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velY, direction.z);

    if (jump && Math.abs(velY) < 0.05) {
      api.velocity.set(velX, JUMP_FORCE, velZ);
    }
  });

  return <mesh ref={ref}></mesh>;
}
