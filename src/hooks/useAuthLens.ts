'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

import {useAccount} from 'wagmi';

import {useActiveProfile, useWalletLogin, useWalletLogout} from '@lens-protocol/react-web';
import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

export type LensStatus = {
  isSuccess: boolean;
  isFailure: boolean;
};

export enum LensUnknownErrors {
  NoAccount = 1, // when login return success but profile is null
}

export function useAuthLens() {
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
  const {execute: login, isPending: loginIsPending} = useWalletLogin();
  const {execute: logout, isPending: logoutIsPending} = useWalletLogout();
  const {data: lensProfile, loading: lensProfileLoading, error: lensProfileError} = useActiveProfile();

  useEffect(() => {
    dispatchSetLensProfile({profile: lensProfile});
  }, [lensProfile]);

  const loading = useMemo(
    () => loginIsPending || logoutIsPending || lensProfileLoading,
    [loginIsPending, logoutIsPending, lensProfileLoading],
  );

  useEffect(() => {
    if (lensLoading !== loading) {
      dispatchSetLensLoading({loading: loading});
    }
  }, [loading]);

  useEffect(() => {
    setUnknownError(null);
  }, [address, chainId]);

  useEffect(() => {
    if (!lensProfile && loginStatus?.isSuccess) {
      setUnknownError(LensUnknownErrors.NoAccount);
      showToast({
        message: `lens.errors.${LensUnknownErrors.NoAccount}`,
        translate: true,
        type: ToastType.error,
      });
    }

    return () => {
      setUnknownError(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginStatus]);

  const handleLensLogin = useCallback(async () => {
    try {
      setUnknownError(null);
      if (address && isConnected) {
        dispatchLogoutForest();
        const {isSuccess, isFailure} = await login({
          address,
        });
        const isSuccessValue = isSuccess();
        const isFailureValue = isFailure();
        setLoginStatus({isSuccess: isSuccessValue, isFailure: isFailureValue});
        if (isSuccessValue) {
          setLogoutStatus(null);
          dispatchSignWithForest();
        }
      }
    } catch (e: any) {
      console.log(e, 'error in login with lens');
    }
  }, [address, isConnected, dispatchLogoutForest, login, dispatchSignWithForest]);

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
    lensProfile,
    lensProfileLoading,
    lensProfileError,
    handleLensLogin,
    handleLensLogout,
    loginStatus,
    logoutStatus,
    loginIsPending,
    logoutIsPending,
    unknownError,
    lensLoading,
  };
}
