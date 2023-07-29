import React, {useCallback} from 'react';

import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import {RotatingLines} from 'react-loader-spinner';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {colors} from 'colors';

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
    web3: {isSupportedNetwork, switching},
  } = useWeb3();

  const renderLoader = useCallback((loading: boolean) => {
    return (
      <RenderIf condition={loading}>
        <AuthLoader />
      </RenderIf>
    );
  }, []);

  return (
    <div className={`relative ${className}`}>
      {renderLoader(isConnecting || switching)}
      {address && isConnected && isSupportedNetwork ? children : <ConnectButton />}
    </div>
  );
}
