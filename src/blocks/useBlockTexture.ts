import { useTextureRegistry } from './useTextureRegistry';

import type { SolidBlockType } from './types';

export function useBlockTexture(blockType: SolidBlockType) {
  const textures = useTextureRegistry();
  return textures[blockType];
}
