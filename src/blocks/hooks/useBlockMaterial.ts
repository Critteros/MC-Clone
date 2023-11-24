import { useContext } from 'react';

import { BlockType } from '../types';
import { MaterialContext } from '../contexts/MaterialRegistry';

export function useBlockMaterial(type: BlockType) {
  const context = useContext(MaterialContext);

  if (context === null) {
    throw new Error('useBlockMaterial must be used within a MaterialRegistryProvider');
  }

  return context[type];
}
