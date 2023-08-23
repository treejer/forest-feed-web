import React, {useCallback} from 'react';

import {useAccount} from 'wagmi';
import {RotatingLines} from 'react-loader-spinner';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {colors} from 'colors';

import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {ConnectToUse} from '@forest-feed/components/AuthWrapper/ConnectToUse';
import {useProfile} from '@forest-feed/redux/module/profile/profile';
import './AuthWrapper.scss';

export function AuthLoader() {
  return (
    <div className="loader absolute inset-0 z-20">
      <div className="w-full h-full flex items-center justify-center">
        <RotatingLines
          strokeColor={colors.lightGreen}
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    </div>
  );
}

export type AuthWrapperProps = React.PropsWithChildren<{
  className?: string;
}>;

export function AuthWrapper(props: AuthWrapperProps) {
  const {className, children} = props;

  const {address, isConnected, isConnecting} = useAccount();
  const {
    web3: {isSupportedNetwork, switching, forestLoading},
  } = useWeb3();

  const {profile: forestProfile} = useProfile();

  const {lensProfile, lensProfileLoading} = useAuthLens();

  const renderLoader = useCallback((loading: boolean) => {
    return (
      <RenderIf condition={loading}>
        <AuthLoader />
      </RenderIf>
    );
  }, []);

  return (
    <div className={`relative ${className}`}>
      {renderLoader(isConnecting || switching || lensProfileLoading || forestLoading)}
      {address && lensProfile && isConnected && isSupportedNetwork && forestProfile ? children : <ConnectToUse />}
    </div>
  );
}
