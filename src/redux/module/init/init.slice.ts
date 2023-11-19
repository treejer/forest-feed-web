import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitState = {
  loading: boolean;
};

export type InitAction = {
  init: {lensLogout: (isSaga?: boolean) => void};
};

const initInitialState: InitState = {
  loading: true,
};

const initSlice = createSlice({
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
