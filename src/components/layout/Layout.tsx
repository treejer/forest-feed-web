'use client';

import React, {useEffect, useState} from 'react';

import {useAccount, useNetwork} from 'wagmi';

import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';

export type LayoutProps = React.PropsWithChildren;

export function Layout(props: LayoutProps) {
  const {children} = props;

  const [mounted, setMounted] = useState(false);

  const {handleLensLogout} = useAuthLens();

  const {chain} = useNetwork();
  const {address} = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      (async () => {
        await handleLensLogout();
      })();
    }
  }, [chain, address]);

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
