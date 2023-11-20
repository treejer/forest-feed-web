import React, {useCallback, useMemo} from 'react';

import dynamic from 'next/dynamic';
import {useAccount} from 'wagmi';
import {RotatingLines} from 'react-loader-spinner';
import {Hearts} from 'react-loader-spinner';

import useWeb3 from '@forest-feed/hooks/useWeb3';
import RenderIf from '@forest-feed/components/common/RenderIf';
import useAuthLens from '@forest-feed/hooks/useAuthLens';
const ConnectToUse = dynamic(() => import('@forest-feed/components/AuthWrapper/ConnectToUse'), {
  loading: () => <Hearts />,
  ssr: true,
});
import useLensProfile from '@forest-feed/hooks/useLensProfile';
import useInit from '@forest-feed/hooks/useInit';
import useForestProfile from '@forest-feed/hooks/useForestProfile';
import cn from '@forest-feed/utils/tailwind';
import colors from 'colors';
import './AuthWrapper.scss';

export type AuthLoaderProps = {
  hideLoader: boolean;
};
function AuthLoader(props: AuthLoaderProps) {
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

export default function AuthWrapper(props: AuthWrapperProps) {
  const {className, children, disabled} = props;

  const {address, isConnected, isConnecting} = useAccount();
  const {
    web3: {isSupportedNetwork, switching, forestLoading},
  } = useWeb3();

  const {profile: forestProfile} = useForestProfile();

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
