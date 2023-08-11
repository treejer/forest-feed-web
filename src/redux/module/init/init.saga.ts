import {put, take, takeEvery} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {updateNetwork, watchCurrentWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {InitAction, initApp, initAppCompleted} from '@forest-feed/redux/module/init/init.slice';
import {checkAppVersion} from '@forest-feed/redux/module/appInfo/appInfo.slice';

export function* watchInitApp({payload}: PayloadAction<InitAction['init']>) {
  try {
    const {lensLogout} = payload || {};

    console.log('init');
    yield put(checkAppVersion());
    yield put(watchCurrentWeb3({lensLogout}));
    yield take(updateNetwork.type);
    yield put(initAppCompleted());
  } catch (e: any) {
    console.log(e, 'error in init app');
  }
}

export function* initSagas() {
  yield takeEvery(initApp.type, watchInitApp);
}
