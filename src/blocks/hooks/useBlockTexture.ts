import { useContext } from 'react';

import { TextureContext } from '../contexts/TextureRegistry';

import type { BlockType } from '../types';

export function useBlockTexture(type: BlockType) {
  const context = useContext(TextureContext);

  if (context === null) {
    throw new Error('useBlockTexture must be used within a TextureRegistryProvider');
  }

  return context[type];
}
