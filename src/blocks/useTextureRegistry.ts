import { useContext } from 'react';

import { TextureContext } from './TextureRegistry';

export function useTextureRegistry() {
  const textures = useContext(TextureContext);

  if (textures === null) {
    throw new Error('useTextureRegistry must be used within a TextureRegistryProvider');
  }

  return textures;
}
