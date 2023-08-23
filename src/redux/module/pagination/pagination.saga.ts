import {put, select, takeEvery} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {AppState} from '@forest-feed/redux/store';
import {
  PaginationName,
  setNextPage,
  setPage,
  TPaginationAction,
  TPaginationItem,
} from '@forest-feed/redux/module/pagination/pagination.slice';

export const PaginationNameFetcher = {
  [PaginationName.MyCampaigns]: () => {}, //TODO: myCampaigns.load,
};

export function* selectPaginationForName(name: PaginationName) {
  return yield select((state: AppState) => state.pagination[name]);
}

export function* watchSetNextPage({payload}: PayloadAction<TPaginationAction['setPage']>) {
  try {
    const {name, query} = payload;
    const {hasMore}: TPaginationItem = yield selectPaginationForName(name);
    if (!hasMore) {
      const action = PaginationNameFetcher[name];
      if (action) {
        // @ts-ignore
        yield put(action(query));
      }
    }
  } catch (e) {
    console.log(e, 'e is here watchSetNextPage');
  }
}

export function* watchSetPage({payload}: PayloadAction<TPaginationAction['setPage']>) {
  try {
    const {name} = payload;
    yield selectPaginationForName(name);
    const action = PaginationNameFetcher[name];
    if (action) {
      // @ts-ignore
      yield put(action(query));
    }
    // }
  } catch (e) {
    console.log(e, 'e is here watchSetNewPage');
  }
}

export function* paginationSagas() {
  yield takeEvery(setNextPage.type, watchSetNextPage);
  yield takeEvery(setPage.type, watchSetPage);
}
