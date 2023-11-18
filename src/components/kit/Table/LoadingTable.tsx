import React from 'react';

import {Circles} from 'react-loader-spinner';

import {colors} from 'colors';
import {cn} from '@forest-feed/utils/tailwind';

export function LoadingTable() {
  return (
    <div className={cn('flex justify-center items-center h-full')}>
      <Circles
        height="100"
        width="100"
        color={colors.green}
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
