import {put, select, take, takeEvery} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {updateNetwork, watchCurrentWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {InitAction, initApp, initAppCompleted} from '@forest-feed/redux/module/init/init.slice';
import {checkAppVersion} from '@forest-feed/redux/module/appInfo/appInfo.slice';
import {selectAccessToken} from '@forest-feed/redux/selectors';
import {profileActions, profileActionTypes} from '@forest-feed/redux/module/profile/profile';

export function* watchInitApp({payload}: PayloadAction<InitAction['init']>) {
  try {
    console.log('init');
    const {lensLogout} = payload || {};

    const accessToken = yield select(selectAccessToken);
    yield put(checkAppVersion());
    yield put(watchCurrentWeb3({lensLogout}));
    yield take(updateNetwork.type);

    if (accessToken) {
      yield put(profileActions.load());
      yield take([profileActionTypes.loadSuccess, profileActionTypes.loadFailure]);
    }

    yield put(initAppCompleted());
  } catch (e: any) {
    console.log(e, 'error in init app');
  }
}

export function* initSagas() {
  yield takeEvery(initApp.type, watchInitApp);
}
