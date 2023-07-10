import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {
  JsonPlaceholderRes,
  JsonPlaceholderPayload,
  JsonPlaceholderAction,
} from '@forest-feed/webServices/jsonPlaceholder/jsonPlaceholder';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

const JsonPlaceholder = new ReduxFetchState<JsonPlaceholderRes, JsonPlaceholderPayload, string>('jsonPlaceholder');

export function* watchJsonPlaceholder({payload}: JsonPlaceholderAction) {
  try {
    console.log(payload, 'payload is here');
    const res: FetchResult<JsonPlaceholderRes> = yield sagaFetch<JsonPlaceholderRes>('/todos', {
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });
    yield put(JsonPlaceholder.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(JsonPlaceholder.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* jsonPlaceholderSagas() {
  yield takeEvery(JsonPlaceholder.actionTypes.load, watchJsonPlaceholder);
}

export function useJsonPlaceholder() {
  const {data: jsonPlaceholder, ...jsonPlaceholderState} = useAppSelector(state => state.jsonPlaceholderReducer);
  const dispatch = useAppDispatch();

  const dispatchGetJsonPlaceholder = useCallback(
    (payload?: JsonPlaceholderPayload) => {
      dispatch(JsonPlaceholder.actions.load(payload));
    },
    [dispatch],
  );

  return {
    jsonPlaceholder,
    ...jsonPlaceholderState,
    dispatchGetJsonPlaceholder,
  };
}

export const {
  reducer: jsonPlaceholderReducer,
  actions: jsonPlaceholderActions,
  actionTypes: jsonPlaceholderActionTypes,
} = JsonPlaceholder;
