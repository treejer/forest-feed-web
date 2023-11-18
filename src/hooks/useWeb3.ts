import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectWeb3} from '@forest-feed/redux/selectors';
import {
  loginAccount,
  logoutAccount,
  notSupportedNetwork,
  removeSelectedProfileId,
  setAccessToken,
  setLensLoading,
  setLensProfile,
  setSelectedProfileId,
  setShowSelectProfile,
  switchNetwork,
  toggleShowSelectProfile,
  Web3Action,
} from '@forest-feed/redux/module/web3/web3.slice';

export default function useWeb3() {
  const web3 = useAppSelector(selectWeb3);
  const dispatch = useAppDispatch();

  const dispatchSwitchNetwork = useCallback(
    (payload: Web3Action['switchNetwork']) => {
      dispatch(switchNetwork(payload));
    },
    [dispatch],
  );

  const dispatchNotSupportedNetwork = useCallback(() => {
    dispatch(notSupportedNetwork());
  }, [dispatch]);

  const dispatchSetLensLoading = useCallback(
    (payload: Web3Action['setLensLoading']) => {
      dispatch(setLensLoading(payload));
    },
    [dispatch],
  );

  const dispatchRemoveAccessToken = useCallback(() => {
    dispatch(setAccessToken({token: ''}));
  }, [dispatch]);

  const dispatchLogoutForest = useCallback(() => {
    // dispatchRemoveAccessToken();
    // dispatch(profileActions.resetCache());
    // dispatch(nonceActions.resetCache());
    // dispatch(signActions.resetCache());
    dispatch(logoutAccount());
  }, [dispatch]);

  const dispatchSignWithForest = useCallback(() => {
    dispatch(loginAccount());
  }, [dispatch]);

  const dispatchSetLensProfile = useCallback(
    (payload: Web3Action['setLensProfile']) => {
      dispatch(setLensProfile(payload));
    },
    [dispatch],
  );

  const dispatchSetSelectedProfileId = useCallback(
    (payload: Web3Action['setSelectedProfileId']) => {
      dispatch(setSelectedProfileId(payload));
    },
    [dispatch],
  );

  const dispatchRemoveSelectedProfileId = useCallback(() => {
    dispatch(removeSelectedProfileId());
  }, [dispatch]);

  const dispatchSetShowSelectProfile = useCallback(
    (payload: Web3Action['setShowSelectProfile']) => {
      dispatch(setShowSelectProfile(payload));
    },
    [dispatch],
  );

  const dispatchToggleShowSelectProfile = useCallback(() => {
    dispatch(toggleShowSelectProfile());
  }, [dispatch]);

  return {
    web3,
    dispatchSwitchNetwork,
    dispatchNotSupportedNetwork,
    dispatchSetLensLoading,
    dispatchRemoveAccessToken,
    dispatchSignWithForest,
    dispatchLogoutForest,
    dispatchSetLensProfile,
    dispatchSetSelectedProfileId,
    dispatchRemoveSelectedProfileId,
    dispatchSetShowSelectProfile,
    dispatchToggleShowSelectProfile,
  };
}
