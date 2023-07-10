import React from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import './globals.css';

export type RootLayoutProps = React.PropsWithChildren;

export default function RootLayout(props: RootLayoutProps) {
  const {children} = props;

  return children;
}
