import React from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import './globals.css';
import {HandleOnComplete} from '@forest-feed/lib/router-events';

export type RootLayoutProps = React.PropsWithChildren;

export default function RootLayout(props: RootLayoutProps) {
  const {children} = props;

  return (
    <>
      {children}
      <HandleOnComplete />
    </>
  );
}
