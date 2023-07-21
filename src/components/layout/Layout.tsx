'use client';

import React, {useEffect} from 'react';

import {useAccount} from 'wagmi';
import {ConnectButton} from '@rainbow-me/rainbowkit';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useInit} from '@forest-feed/redux/module/init/init.slice';

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const {dispatchInit} = useInit();

  const {address, status} = useAccount({
    onConnect: data => {},
  });

  useEffect(() => {
    console.log('how are you doing?');
    dispatchInit();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-6 gap-20">
        <div className="grid col-span-6">
          <AppHeader walletAddress={address} connectionStatus={status} />
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
