import {createSlice} from '@reduxjs/toolkit';

import {version} from 'package.json';

export type AppInfoState = {
  version: string;
};

export const appInfoInitialState: AppInfoState = {
  version,
};

export const appInfoSlice = createSlice({
  name: 'appInfo',
  initialState: appInfoInitialState,
  reducers: {
    checkAppVersion: () => {},
  },
});

export const {checkAppVersion} = appInfoSlice.actions;
export default appInfoSlice.reducer;
