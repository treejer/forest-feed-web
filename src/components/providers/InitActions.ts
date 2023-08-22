import React, {useEffect} from 'react';

import {useInit} from '@forest-feed/redux/module/init/init.slice';

export type InitAppProps = React.PropsWithChildren;
export function InitAppActions(props: InitAppProps) {
  const {children} = props;

  const {dispatchInit} = useInit();

  useEffect(() => {
    dispatchInit();
  }, []);

  return children;
}
