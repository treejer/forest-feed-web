'use client';

import React, {useEffect} from 'react';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {useInit} from '@forest-feed/redux/module/init/init.slice';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {TabNavigator} from '@forest-feed/components/layout/TabNavigator';
import {SelectLensProfileModal} from '@forest-feed/components/SelectLensProfileModal/SelectLensProfileModal';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {useLensProfile} from '@forest-feed/hooks/useLensProfile';

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const {handleLensLogout} = useAuthLens();
  const {loading} = useLensProfile();
  const {dispatchInit, initState} = useInit();
  const {
    web3: {showSelectProfile},
  } = useWeb3();

  useEffect(() => {
    if (!loading && initState.loading) {
      dispatchInit({lensLogout: handleLensLogout});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
      <SelectLensProfileModal visible={showSelectProfile} />
    </div>
  );
}
