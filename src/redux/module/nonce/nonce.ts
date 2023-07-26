import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';
import {getAccount} from '@wagmi/core';

import {NonceRes} from '@forest-feed/webServices/nonce/nonce';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectNonce} from '@forest-feed/redux/selectors';

const Nonce = new ReduxFetchState<NonceRes, null, string>('nonce');

export function* watchNonce() {
  try {
    const address = yield getAccount();
    const res: FetchResult<NonceRes> = yield sagaFetch(`/nonce/${address}`);
    yield put(Nonce.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(Nonce.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* nonceSagas() {
  yield takeEvery(Nonce.actionTypes.load, watchNonce);
}

export function useNonce() {
  const {data: nonce, ...nonceState} = useAppSelector(selectNonce);
  const dispatch = useAppDispatch();

  const dispatchGetNonce = useCallback(() => {
    dispatch(Nonce.actions.load());
  }, [dispatch]);

  const dispatchResetNonce = useCallback(() => {
    dispatch(Nonce.actions.resetCache());
  }, [dispatch]);

  return {
    nonce,
    ...nonceState,
    dispatchGetNonce,
    dispatchResetNonce,
  };
}

export const {reducer: nonceReducer, actions: nonceActions, actionTypes: nonceActionTypes} = Nonce;
