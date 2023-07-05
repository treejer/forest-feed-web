import React from 'react';

export type RootLayoutProps = React.PropsWithChildren;

export default function RootLayout(props: RootLayoutProps) {
  const {children} = props;

  return children;
}
