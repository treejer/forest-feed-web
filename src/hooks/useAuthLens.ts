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
    if (wallet && isConnected) {
      await login({
        address: wallet,
      });
    }
  }, [wallet, login, isConnected]);

  const handleLensLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    lensProfile,
    lensProfileLoading,
    lensProfileError,
    handleLensLogin,
    handleLensLogout,
  };
}
