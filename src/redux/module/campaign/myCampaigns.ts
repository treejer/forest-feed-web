import {useCallback} from 'react';

import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {MyCampaignsRes} from '@forest-feed/webServices/campaign/myCampaigns';
import {selectPaginationForName} from '@forest-feed/redux/module/pagination/pagination.saga';
import {
  PaginationName,
  paginationReachedEnd,
  setPaginationTotal,
  TPaginationItem,
  useReduxPagination,
} from '@forest-feed/redux/module/pagination/pagination.slice';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {checkUserAuthState} from '@forest-feed/utils/auth';
import {selectMyCampaign} from '@forest-feed/redux/selectors';
import {paginationPageSize} from '@forest-feed/config';

const MyCampaigns = new ReduxFetchState<MyCampaignsRes, null, string>('myCampaigns');

export function* watchMyCampaigns() {
  try {
    yield checkUserAuthState();
    const {page, perPage}: TPaginationItem = yield selectPaginationForName(PaginationName.MyCampaigns);
    const res: FetchResult<MyCampaignsRes> = yield sagaFetch<MyCampaignsRes>('/campaign/my-campaign', {
      params: {
        skip: page - 1,
        limit: perPage,
        sort: JSON.stringify({createdAt: -1}),
      },
    });
    const totalPageCount = Math.ceil(res.result.count / paginationPageSize);
    yield put(paginationReachedEnd({name: PaginationName.MyCampaigns, end: page === totalPageCount}));
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
  const {data: myCampaigns, ...myCampaignsState} = useAppSelector(selectMyCampaign);
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
