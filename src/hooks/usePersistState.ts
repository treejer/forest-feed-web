import React, {useEffect, useState} from 'react';

import {useDebounce} from '@forest-feed/hooks/useDebounce';

export const persistKeyGenerator = (key: string) => `FOREST_FEED_PERSIST_${key}`;

export function usePersistState<T>(value: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [state, setState] = useState<T>(value);

  const debouncedState = useDebounce(state);

  useEffect(() => {
    if (window !== undefined) {
      const persistValue = window.localStorage.getItem(persistKeyGenerator(key));
      setState(persistValue ? JSON.parse(persistValue) : state);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(persistKeyGenerator(key), JSON.stringify(state));
  }, [state]);

  return [state, setState, debouncedState];
}
