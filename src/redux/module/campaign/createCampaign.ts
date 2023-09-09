import {useCallback} from 'react';

import ReduxFetchState from 'redux-fetch-state';
import {put, take, takeEvery} from 'redux-saga/effects';

import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {
  CreateCampaignAction,
  CreateCampaignForm,
  CreateCampaignPayload,
  CreateCampaignRes,
} from '@forest-feed/webServices/campaign/createCampaign';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCreateCampaign} from '@forest-feed/redux/selectors';
import {myCampaignsActions, myCampaignsActionTypes} from '@forest-feed/redux/module/campaign/myCampaigns';
import {resetCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {showSagaToast, ToastType} from '@forest-feed/utils/showToast';

const CreateCampaign = new ReduxFetchState<CreateCampaignRes, CreateCampaignPayload, string>('createCampaign');

export function* watchCreateCampaign({payload}: CreateCampaignAction) {
  try {
    const {campaignSize, title, isFollowerOnly, minFollower, publicationId, onSuccess} = payload || {};
    const res: FetchResult<CreateCampaignRes> = yield sagaFetch<CreateCampaignRes, CreateCampaignForm>('/campaign', {
      method: 'POST',
      data: {
        campaignSize,
        isFollowerOnly,
        minFollower,
        title,
        publicationId,
      },
    });
    yield showSagaToast({
      title: 'newCampaign.goodJob',
      message: 'newCampaign.succeed',
      type: ToastType.success,
      translate: true,
    });
    yield put(myCampaignsActions.load());
    yield take([myCampaignsActionTypes.loadSuccess, myCampaignsActionTypes.loadFailure]);
    yield put(resetCampaignJourney());
    onSuccess?.();
    yield put(CreateCampaign.actions.loadSuccess(res.result));
  } catch (e: any) {
    console.log(e, 'error in create campaign module');
    const {message} = handleFetchError(e);
    yield handleSagaFetchError(e);
    yield put(CreateCampaign.actions.loadFailure(message));
    payload?.onFailure?.();
  }
}

export function* createCampaignSagas() {
  yield takeEvery(CreateCampaign.actionTypes.load, watchCreateCampaign);
}

export function useCreateCampaign() {
  const {data: createCampaign, ...createCampaignState} = useAppSelector(selectCreateCampaign);
  const dispatch = useAppDispatch();

  const dispatchCreateCampaign = useCallback(
    (payload: CreateCampaignPayload) => {
      dispatch(CreateCampaign.actions.load(payload));
    },
    [dispatch],
  );

  const dispatchResetCreateCampaign = useCallback(() => {
    dispatch(CreateCampaign.actions.resetCache());
  }, [dispatch]);

  return {
    createCampaign,
    ...createCampaignState,
    dispatchCreateCampaign,
    dispatchResetCreateCampaign,
  };
}

export const {
  reducer: createCampaignReducer,
  actions: createCampaignActions,
  actionTypes: createCampaignActionTypes,
} = CreateCampaign;
