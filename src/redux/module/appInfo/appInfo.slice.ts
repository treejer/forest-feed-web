import {createSlice} from '@reduxjs/toolkit';

const {version} = require('../../../../package.json');

type AppInfoState = {
  version: string;
};

const appInfoInitialState: AppInfoState = {
  version,
};

const appInfoSlice = createSlice({
  name: 'appInfo',
  initialState: appInfoInitialState,
  reducers: {
    checkAppVersion: () => {},
  },
});

export const {checkAppVersion} = appInfoSlice.actions;
export default appInfoSlice.reducer;
