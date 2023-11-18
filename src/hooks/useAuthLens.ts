'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

import {useAccount} from 'wagmi';

import {ProfileId, useLazyProfile, useLogin, useLogout} from '@lens-protocol/react-web';
import useWeb3 from '@forest-feed/hooks/useWeb3';

export type LensStatus = {
  isSuccess: boolean;
  isFailure: boolean;
};

export enum LensUnknownErrors {
  NoAccount = 1, // when login return success but profile is null
}

export default function useAuthLens() {
  const [loginStatus, setLoginStatus] = useState<LensStatus | null>(null);
  const [logoutStatus, setLogoutStatus] = useState<LensStatus | null>(null);
  const [unknownError, setUnknownError] = useState<LensUnknownErrors | null>(null);

  const {
    web3: {
      lensLoading,
      config: {chainId},
    },
    dispatchSetLensLoading,
    dispatchSignWithForest,
    dispatchLogoutForest,
    dispatchSetLensProfile,
  } = useWeb3();

  const {address, isConnected} = useAccount();

  const {execute: login, loading: loginLoading} = useLogin();
  const {execute: logout, loading: logoutLoading} = useLogout();

  const {execute: fetchProfile} = useLazyProfile();

  const loading = useMemo(() => loginLoading || logoutLoading, [loginLoading, logoutLoading]);

  useEffect(() => {
    if (lensLoading !== loading) {
      dispatchSetLensLoading({loading: loading});
    }
  }, [loading]);

  useEffect(() => {
    setUnknownError(null);
  }, [address, chainId]);

  const handleLensLogin = useCallback(
    async (profileId: ProfileId) => {
      try {
        setUnknownError(null);
        if (address && isConnected) {
          // dispatchLogoutForest();
          const {isSuccess, isFailure} = await login({
            address,
            profileId,
          });
          const isSuccessValue = isSuccess();
          const isFailureValue = isFailure();
          setLoginStatus({isSuccess: isSuccessValue, isFailure: isFailureValue});
          if (isSuccessValue) {
            setLogoutStatus(null);
            const result = await fetchProfile({
              forProfileId: profileId,
            });
            if (result.isSuccess()) {
              dispatchSetLensProfile({profile: result.value});
              dispatchSignWithForest();
            }
          }
        }
      } catch (e: any) {
        console.log(e, 'error in login with lens');
      }
    },
    [address, isConnected, dispatchLogoutForest, login, fetchProfile, dispatchSetLensProfile, dispatchSignWithForest],
  );

  const handleLensLogout = useCallback(
    async (inSaga?: boolean) => {
      try {
        setUnknownError(null);
        const {isSuccess, isFailure} = await logout();
        const isSuccessValue = isSuccess();
        const isFailureValue = isFailure();
        setLogoutStatus({isSuccess: isSuccessValue, isFailure: isFailureValue});
        if (isSuccessValue) {
          setLoginStatus(null);
          if (!inSaga) {
            dispatchLogoutForest();
          }
        }
      } catch (e: any) {
        console.log(e, 'error in logout lens');
      }
    },
    [logout, dispatchLogoutForest],
  );

  return {
    handleLensLogin,
    handleLensLogout,
    loginStatus,
    logoutStatus,
    loginLoading,
    logoutLoading,
    unknownError,
    lensLoading,
  };
}
