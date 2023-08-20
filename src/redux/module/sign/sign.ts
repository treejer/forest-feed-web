import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';
import {getAccount} from '@wagmi/core';

import {SignAction, SignPayload, SignRes} from '@forest-feed/webServices/sign/sign';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectSign} from '@forest-feed/redux/selectors';

const Sign = new ReduxFetchState<SignRes, SignPayload, string>('sign');

export function* watchSign({payload}: SignAction) {
  try {
    const {signature} = payload || {};

    const {address} = yield getAccount();
    const res: FetchResult<SignRes> = yield sagaFetch<SignRes, SignPayload>(`/login/${address}`, {
      data: {
        signature,
      },
      method: 'POST',
    });

    yield put(Sign.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(Sign.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* signSagas() {
  yield takeEvery(Sign.actionTypes.load, watchSign);
}

export function useSign() {
  const {data: sign, ...signState} = useAppSelector(selectSign);
  const dispatch = useAppDispatch();

  const dispatchSign = useCallback(
    (form: SignPayload) => {
      dispatch(Sign.actions.load(form));
    },
    [dispatch],
  );

  const dispatchResetSign = useCallback(() => {
    dispatch(Sign.actions.resetCache());
  }, [dispatch]);

  return {sign, ...signState, dispatchSign, dispatchResetSign};
}

export const {reducer: signReducer, actions: signActions, actionTypes: signActionTypes} = Sign;
