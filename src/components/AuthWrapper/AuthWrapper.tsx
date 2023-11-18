import React, {useCallback, useMemo} from 'react';

import {useAccount} from 'wagmi';
import {RotatingLines} from 'react-loader-spinner';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {colors} from 'colors';

import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {ConnectToUse} from '@forest-feed/components/AuthWrapper/ConnectToUse';
import {useProfile} from '@forest-feed/redux/module/profile/profile';
import {useInit} from '@forest-feed/redux/module/init/init.slice';
import {useLensProfile} from '@forest-feed/hooks/useLensProfile';
import './AuthWrapper.scss';
import {cn} from '@forest-feed/utils/tailwind';

export type AuthLoaderProps = {
  hideLoader: boolean;
};
export function AuthLoader(props: AuthLoaderProps) {
  const {hideLoader = false} = props;

  return (
    <div className={cn('loader absolute inset-0 z-20')}>
      <div className={cn('w-full h-full flex items-center justify-center')}>
        <RotatingLines
          strokeColor={colors.lightGreen}
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={!hideLoader}
        />
      </div>
    </div>
  );
}

export type AuthWrapperProps = React.PropsWithChildren<{
  className?: string;
  disabled?: boolean;
}>;

export function AuthWrapper(props: AuthWrapperProps) {
  const {className, children, disabled} = props;

  const {address, isConnected, isConnecting} = useAccount();
  const {
    web3: {isSupportedNetwork, switching, forestLoading},
  } = useWeb3();

  const {profile: forestProfile} = useProfile();

  const {loginLoading} = useAuthLens();
  const {data: lensProfile} = useLensProfile();

  const {initState} = useInit();

  const renderLoader = useCallback((loading: boolean, disable?: boolean) => {
    return (
      <RenderIf condition={loading || !!disable}>
        <AuthLoader hideLoader={!loading && !!disable} />
      </RenderIf>
    );
  }, []);

  const loading = useMemo(
    () => initState.loading || isConnecting || switching || loginLoading || forestLoading,
    [forestLoading, initState.loading, isConnecting, loginLoading, switching],
  );

  console.log(
    {
      initStateLoading: !initState.loading,
      address,
      lensProfile,
      isConnected,
      isSupportedNetwork,
      forestProfile,
    },
    'I am here DUDE!',
  );
  // TODO: CHECK LOADING

  const canAccessToApp = useMemo(
    () => !initState.loading && address && lensProfile && isConnected && isSupportedNetwork && forestProfile,
    [address, forestProfile, initState.loading, isConnected, isSupportedNetwork, lensProfile],
  );

  return (
    <div className={cn('relative', className)}>
      {renderLoader(loading, !!canAccessToApp && disabled)}
      {canAccessToApp ? children : <ConnectToUse />}
    </div>
  );
}
