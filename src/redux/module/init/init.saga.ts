import {put, take, takeEvery} from 'redux-saga/effects';

import {updateNetwork, watchCurrentWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {initApp, initAppCompleted} from '@forest-feed/redux/module/init/init.slice';

export function* watchInitApp() {
  try {
    console.log('init');
    yield put(watchCurrentWeb3());
    yield take(updateNetwork.type);
    yield put(initAppCompleted());
  } catch (e: any) {
    console.log(e, 'error in init app');
  }
}

export function* initSagas() {
  yield takeEvery(initApp.type, watchInitApp);
}
