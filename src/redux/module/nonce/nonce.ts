import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';
import {getAccount} from '@wagmi/core';

import type {NonceRes} from '@forest-feed/webServices/nonce/nonce';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';

const Nonce = new ReduxFetchState<NonceRes, null, string>('nonce');

function* watchNonce() {
  try {
    const {address} = yield getAccount();
    const res: FetchResult<NonceRes> = yield sagaFetch(`/nonce/${address}`);
    yield put(Nonce.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(Nonce.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export default function* nonceSagas() {
  yield takeEvery(Nonce.actionTypes.load, watchNonce);
}

export const {reducer: nonceReducer, actions: nonceActions, actionTypes: nonceActionTypes} = Nonce;
