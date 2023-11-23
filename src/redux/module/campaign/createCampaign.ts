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
import {resetCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {showSagaToast, ToastType} from '@forest-feed/utils/showToast';
import {storageKeys} from '@forest-feed/config';

const CreateCampaign = new ReduxFetchState<CreateCampaignRes, CreateCampaignPayload, string>('createCampaign');

function* watchCreateCampaign({payload}: CreateCampaignAction) {
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
    yield put(resetCampaignJourney());
    window.localStorage.removeItem(storageKeys.CAMPAIGN_SIZE);
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

export default function* createCampaignSagas() {
  yield takeEvery(CreateCampaign.actionTypes.load, watchCreateCampaign);
}

export const {
  reducer: createCampaignReducer,
  actions: createCampaignActions,
  actionTypes: createCampaignActionTypes,
} = CreateCampaign;
