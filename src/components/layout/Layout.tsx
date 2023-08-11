'use client';

import React, {useEffect} from 'react';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useInit} from '@forest-feed/redux/module/init/init.slice';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const {dispatchInit} = useInit();

  const {web3} = useWeb3();
  const {handleLensLogout} = useAuthLens();

  useEffect(() => {
    console.log(web3, 'web3');
  }, [web3]);

  useEffect(() => {
    dispatchInit({lensLogout: handleLensLogout});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-6 gap-20 min-h-screen grid-rows-appLayout">
        <div className="grid col-span-6">
          <AppHeader />
        </div>
        <div className="col-span-1">
          <Navbar />
        </div>
        <div className="col-span-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
