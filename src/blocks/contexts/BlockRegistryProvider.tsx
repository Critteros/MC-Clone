import type { ReactNode } from 'react';

import { MaterialRegistryProvider } from './MaterialRegistry';
import { TextureRegistryProvider } from './TextureRegistry';

export function BlockRegistryProvider({ children }: { children: ReactNode }) {
  return (
    <TextureRegistryProvider>
      <MaterialRegistryProvider>{children}</MaterialRegistryProvider>
    </TextureRegistryProvider>
  );
}
