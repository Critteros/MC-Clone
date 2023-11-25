import { type DependencyList, useCallback, useEffect, useRef } from 'react';

/**
 * Initiate an instance and return a safe getter
 * From: github.com/pmndrs/react-three-rapier/blob/main/packages/react-three-rapier/src/hooks/use-imperative-instance.ts
 */
export const useImperativeInstance = <InstanceType>(
  createFn: () => InstanceType,
  destroyFn: (instance: InstanceType) => void,
  dependencyList: DependencyList,
) => {
  const ref = useRef<InstanceType>();

  const getInstance = useCallback(() => {
    if (!ref.current) {
      ref.current = createFn();
    }

    return ref.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);

  useEffect(() => {
    // Save the destroy function and instance
    const instance = getInstance();
    const destroy = () => destroyFn(instance);

    return () => {
      destroy();
      ref.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInstance]);

  return getInstance;
};
