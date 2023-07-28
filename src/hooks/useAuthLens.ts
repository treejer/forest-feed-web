import {useCallback} from 'react';

import {useActiveProfile, useWalletLogin, useWalletLogout} from '@lens-protocol/react-web';

export type UseLensParams = {
  wallet: string | undefined;
  isConnected: boolean;
};
export function useAuthLens(params: UseLensParams) {
  const {wallet, isConnected} = params;

  const {execute: login} = useWalletLogin();
  const {execute: logout} = useWalletLogout();
  const {data: lensProfile, loading: lensProfileLoading, error: lensProfileError} = useActiveProfile();

  const handleLensLogin = useCallback(async () => {
    try {
      if (wallet && isConnected) {
        await login({
          address: wallet,
        });
      }
    } catch (e: any) {
      console.log(e, 'error in login with lens');
    }
  }, [wallet, login, isConnected]);

  const handleLensLogout = useCallback(async () => {
    try {
      await logout();
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
  };
}
