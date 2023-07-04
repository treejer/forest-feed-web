'use client';

import React from 'react';

export type RenderIfProps = React.PropsWithChildren<{
  condition: boolean;
}>;

export function RenderIf(props: RenderIfProps) {
  const {condition, children} = props;

  return condition ? children : null;
}
