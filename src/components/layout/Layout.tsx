'use client';

import React, {useEffect} from 'react';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {useInit} from '@forest-feed/redux/module/init/init.slice';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {TabNavigator} from '@forest-feed/components/layout/TabNavigator';

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const {handleLensLogout, lensProfileLoading} = useAuthLens();
  const {dispatchInit, initState} = useInit();
  const {web3} = useWeb3();

  useEffect(() => {
    if (!lensProfileLoading && initState.loading) {
      dispatchInit({lensLogout: handleLensLogout});
    }
  }, [lensProfileLoading]);

  useEffect(() => {
    console.log(web3, 'web3');
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-6 md:gap-x-20 min-h-screen grid-rows-appLayout">
        <div className="grid col-span-6">
          <AppHeader />
          <div className="hidden md:block">
            <Spacer times={10} />
          </div>
        </div>
        <div className="hidden lg:block md:col-span-1">
          <Navbar />
        </div>
        <div className="col-span-6 lg:col-span-5 pb-5">{children}</div>
      </div>
      <TabNavigator />
    </div>
  );
}
