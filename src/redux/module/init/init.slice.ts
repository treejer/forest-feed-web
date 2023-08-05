import {useCallback} from 'react';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {selectInit} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type InitState = {
  loading: boolean;
};

export type InitAction = {
  init: {lensLogout: () => void};
};
export const initInitialState: InitState = {
  loading: true,
};

export const initSlice = createSlice({
  name: 'init',
  initialState: initInitialState,
  reducers: {
    initApp: (state, _action: PayloadAction<InitAction['init']>) => {
      state.loading = true;
    },
    initAppCompleted: state => {
      state.loading = false;
    },
  },
});

export const {initApp, initAppCompleted} = initSlice.actions;
export default initSlice.reducer;

export function useInit() {
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
