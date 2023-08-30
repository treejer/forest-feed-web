import {put, select, takeEvery} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {AppState} from '@forest-feed/redux/store';
import {
  PaginationName,
  setNextPrevPage,
  setPage,
  TPaginationAction,
} from '@forest-feed/redux/module/pagination/pagination.slice';
import {PaginationNameFetcher} from '@forest-feed/config';

export function* selectPaginationForName(name: PaginationName) {
  return yield select((state: AppState) => state.pagination[name]);
}

export function* watchSetNextPrevPage({payload}: PayloadAction<TPaginationAction['setNextPrevPage']>) {
  try {
    const {name, query} = payload || {};
    const action = PaginationNameFetcher[name];
    if (action) {
      // @ts-ignore
      yield put(action(query, true));
    }
  } catch (e) {
    console.log(e, 'e is here watchSetNextPage');
  }
}

export function* watchSetPage({payload}: PayloadAction<TPaginationAction['setPage']>) {
  try {
    const {name, query} = payload || {};
    const action = PaginationNameFetcher[name];
    if (action) {
      // @ts-ignore
      yield put(action(query, true));
    }
  } catch (e) {
    console.log(e, 'e is here watchSetNewPage');
  }
}

export function* paginationSagas() {
  yield takeEvery(setNextPrevPage.type, watchSetNextPrevPage);
  yield takeEvery(setPage.type, watchSetPage);
}
