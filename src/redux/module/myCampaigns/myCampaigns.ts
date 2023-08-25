import {useCallback} from 'react';

import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {MyCampaignsRes} from '@forest-feed/webServices/myCampaigns/myCampaigns';
import {selectPaginationForName} from '@forest-feed/redux/module/pagination/pagination.saga';
import {
  PaginationName,
  setPaginationTotal,
  TPaginationItem,
  useReduxPagination,
} from '@forest-feed/redux/module/pagination/pagination.slice';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

const MyCampaigns = new ReduxFetchState<MyCampaignsRes, null, string>('myCampaigns');

export function* watchMyCampaigns() {
  try {
    const {page, perPage}: TPaginationItem = yield selectPaginationForName(PaginationName.MyCampaigns);
    const res: FetchResult<MyCampaignsRes> = yield sagaFetch<MyCampaignsRes>('/campaign/my-campaign', {
      params: {
        skip: page - 1,
        limit: perPage,
      },
    });
    yield put(setPaginationTotal({name: PaginationName.MyCampaigns, total: res.result.count}));
    yield put(MyCampaigns.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield handleSagaFetchError(e);
    yield put(MyCampaigns.actions.loadFailure(message));
  }
}

export function* myCampaignsSagas() {
  yield takeEvery(MyCampaigns.actionTypes.load, watchMyCampaigns);
}

export function useMyCampaigns() {
  const {data: myCampaigns, ...myCampaignsState} = useAppSelector(state => state.myCampaigns);
  const dispatch = useAppDispatch();

  const pagination = useReduxPagination(PaginationName.MyCampaigns);

  const dispatchFetchMyCampaigns = useCallback(() => {
    dispatch(MyCampaigns.actions.load());
  }, [dispatch]);

  const dispatchResetMyCampaigns = useCallback(() => {
    dispatch(MyCampaigns.actions.resetCache());
    pagination.dispatchResetPagination();
  }, [dispatch, pagination]);

  return {
    myCampaigns,
    ...myCampaignsState,
    pagination,
    dispatchFetchMyCampaigns,
    dispatchResetMyCampaigns,
  };
}

export const {
  reducer: myCampaignsReducer,
  actions: myCampaignsActions,
  actionTypes: myCampaignsActionTypes,
} = MyCampaigns;
