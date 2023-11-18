import React from 'react';
import {Hearts} from 'react-loader-spinner';
import colors from 'colors';
import cn from '@forest-feed/utils/tailwind';

export default function InitLoader() {
  return (
    <div className={cn('absolute inset-0 bg-primaryBg flex justify-center items-center z-50')}>
      <Hearts
        height="100"
        width="100"
        color={colors.green}
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
