import { createContext, type ReactNode, useMemo } from 'react';
import * as THREE from 'three';

import { useTextureRegistry } from '../hooks/useTextureRegistry';
import { BlockType, BlockTypeList } from '../types';

type MaterialRegistry = Record<BlockType, THREE.Material>;

export const MaterialContext = createContext<MaterialRegistry | null>(null);

export function MaterialRegistryProvider({ children }: { children: ReactNode }) {
  const textures = useTextureRegistry();

  const material = useMemo(() => {
    const entries = BlockTypeList.map((blockType) => {
      const texture = textures[blockType];
      const material = new THREE.MeshBasicMaterial({ map: texture });
      return [blockType, material] as const;
    });
    return Object.fromEntries(entries) as unknown as MaterialRegistry;
  }, [textures]);

  return <MaterialContext.Provider value={material}>{children}</MaterialContext.Provider>;
}
