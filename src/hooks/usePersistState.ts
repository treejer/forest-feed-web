import React, {useEffect, useState} from 'react';

import {useDebounce} from '@forest-feed/hooks/useDebounce';

export function usePersistState<T>(
  value: T,
  key: string,
  debounceTimer?: number,
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [state, setState] = useState<T>(value);

  const debouncedState = useDebounce(state, debounceTimer);

  useEffect(() => {
    if (window !== undefined) {
      const persistValue = window.localStorage.getItem(key);
      setState(persistValue ? JSON.parse(persistValue) : state);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState, debouncedState];
}
