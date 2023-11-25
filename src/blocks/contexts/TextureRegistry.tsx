import * as THREE from 'three';
import { createContext, type ReactNode } from 'react';
import { useTexture } from '@react-three/drei';

import { BlockType } from '../types';

import {
  dirtImage,
  grassImage,
  logImage,
  woodImage,
  sandImage,
  stoneImage,
  bedrockImage,
} from '../textures/paths';

type TextureRegistry = Record<BlockType, THREE.Texture>;

export const TextureContext = createContext<TextureRegistry | null>(null);

export function TextureRegistryProvider({ children }: { children: ReactNode }) {
  const textures = useTexture(
    {
      [BlockType.Dirt]: dirtImage,
      [BlockType.Grass]: grassImage,
      [BlockType.Log]: logImage,
      [BlockType.Wood]: woodImage,
      [BlockType.Sand]: sandImage,
      [BlockType.Stone]: stoneImage,
      [BlockType.Bedrock]: bedrockImage,
    } satisfies Record<BlockType, string>,
    (data) => {
      const setupTexture = (texture: THREE.Texture) => {
        texture.magFilter = THREE.NearestFilter;
      };

      if (Array.isArray(data)) {
        data.forEach(setupTexture);
      } else {
        setupTexture(data);
      }
    },
  );

  return <TextureContext.Provider value={textures}>{children}</TextureContext.Provider>;
}
