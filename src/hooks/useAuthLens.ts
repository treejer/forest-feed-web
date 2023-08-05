import {useCallback, useState} from 'react';

import {useAccount} from 'wagmi';

import {useActiveProfile, useWalletLogin, useWalletLogout} from '@lens-protocol/react-web';

export type LensStatus = {
  isSuccess: boolean;
  isFailure: boolean;
};

export function useAuthLens() {
  const {address, isConnected} = useAccount();
  const {execute: login, isPending: loginIsPending} = useWalletLogin();
  const {execute: logout, isPending: logoutIsPending} = useWalletLogout();
  const {data: lensProfile, loading: lensProfileLoading, error: lensProfileError} = useActiveProfile();

  const [loginStatus, setLoginStatus] = useState<LensStatus | null>(null);
  const [logoutStatus, setLogoutStatus] = useState<LensStatus | null>(null);

  console.log({lensProfile, loginIsPending, logoutIsPending}, ' lens data');

  const handleLensLogin = useCallback(async () => {
    try {
      if (address && isConnected) {
        const {isSuccess, isFailure} = await login({
          address,
        });
        setLoginStatus({isSuccess: isSuccess(), isFailure: isFailure()});
      }
    } catch (e: any) {
      console.log(e, 'error in login with lens');
    }
  }, [address, login, isConnected]);

  const handleLensLogout = useCallback(async () => {
    try {
      const {isSuccess, isFailure} = await logout();
      setLogoutStatus({isSuccess: isSuccess(), isFailure: isFailure()});
    } catch (e: any) {
      console.log(e, 'error in logout lens');
    }
  }, [logout]);

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
  };
}
