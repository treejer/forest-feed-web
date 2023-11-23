import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectInit} from '@forest-feed/redux/selectors';
import {InitAction, initApp, initAppCompleted} from '@forest-feed/redux/module/init/init.slice';

export default function useInit() {
  const initState = useAppSelector(selectInit);
  const dispatch = useAppDispatch();

  const dispatchInit = useCallback(
    (payload: InitAction['init']) => {
      dispatch(initApp(payload));
    },
    [dispatch],
  );

  const dispatchInitCompleted = useCallback(() => {
    dispatch(initAppCompleted());
  }, [dispatch]);

  return {
    initState,
    dispatchInit,
    dispatchInitCompleted,
  };
}
