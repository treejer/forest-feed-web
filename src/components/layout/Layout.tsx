'use client';

import React, {useEffect} from 'react';

import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useInit} from '@forest-feed/redux/module/init/init.slice';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {useAuthLens} from "@forest-feed/hooks/useAuthLens";

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const {dispatchInit} = useInit();

  const {web3} = useWeb3();

  const {address, status, isConnected} = useAccount({
    onConnect: data => {},
  });

  const {lensProfile, handleLensLogin} = useAuthLens({
    wallet: address,
    isConnected,
  });


  useEffect(() => {
    console.log(web3, 'web3');
  }, [web3]);


  useEffect(() => {
    dispatchInit();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-6 gap-20">
        <div className="grid col-span-6">
          <AppHeader
            walletAddress={address}
            isLensLoggedIn={!!lensProfile}
            connectionStatus={status}
            onLensLogin={handleLensLogin}
          />
          <ConnectButton />
        </div>
        <div className="col-span-1">
          <Navbar />
        </div>
        <div className="col-span-5">{children}</div>
      </div>
    </div>
  );
}
