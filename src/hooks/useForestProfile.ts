import {useCallback} from 'react';

import {useDisconnect} from 'wagmi';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import useAuthLens from '@forest-feed/hooks/useAuthLens';
import useWeb3 from '@forest-feed/hooks/useWeb3';
import {profileActions} from '@forest-feed/redux/module/profile/profile';

export default function useForestProfile() {
  const {data: profile, ...profileState} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const {disconnectAsync} = useDisconnect();
  const {handleLensLogout} = useAuthLens();
  const {dispatchLogoutForest} = useWeb3();

  const dispatchProfile = useCallback(() => {
    dispatch(profileActions.load());
  }, [dispatch]);

  const dispatchResetProfile = useCallback(() => {
    dispatch(profileActions.resetCache());
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
