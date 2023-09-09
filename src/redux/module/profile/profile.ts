'use client';

import {useCallback} from 'react';

import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';
import {useDisconnect} from 'wagmi';

import {ProfileRes} from '@forest-feed/webServices/profile/profile';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from '@forest-feed/utils/fetch';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

const Profile = new ReduxFetchState<ProfileRes, null, string>('profile');

export function* watchProfile() {
  try {
    const res: FetchResult<ProfileRes> = yield sagaFetch<ProfileRes>('/users/me');
    yield put(Profile.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield handleSagaFetchError(e);
    yield put(Profile.actions.loadFailure(message));
  }
}

export function* profileSagas() {
  yield takeEvery(Profile.actionTypes.load, watchProfile);
}

export function useProfile() {
  const {data: profile, ...profileState} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const {disconnectAsync} = useDisconnect();
  const {handleLensLogout} = useAuthLens();
  const {dispatchLogoutForest} = useWeb3();

  const dispatchProfile = useCallback(() => {
    dispatch(Profile.actions.load());
  }, [dispatch]);

  const dispatchResetProfile = useCallback(() => {
    dispatch(Profile.actions.resetCache());
  }, [dispatch]);

  const dispatchLogoutAccount = useCallback(async () => {
    await handleLensLogout();
    await disconnectAsync();
    dispatchLogoutForest();
  }, [handleLensLogout, disconnectAsync, dispatchLogoutForest]);

  return {
    profile,
    ...profileState,
    dispatchProfile,
    dispatchResetProfile,
    dispatchLogoutAccount,
  };
}

export const {reducer: profileReducer, actions: profileActions, actionTypes: profileActionTypes} = Profile;
