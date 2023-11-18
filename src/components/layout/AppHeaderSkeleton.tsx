import React from 'react';

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import Spacer from '@forest-feed/components/common/Spacer';
import cn from '@forest-feed/utils/tailwind';

export type SkeletonBoxProps = {
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
};

export default function SkeletonBox(props: SkeletonBoxProps) {
  const {wrapperClassName, height = 40, width = 200} = props;

  return (
    <div className={cn(wrapperClassName)}>
      <Skeleton height={height} width={width} />
    </div>
  );
}

export function AppHeaderSkeleton() {
  return (
    <SkeletonTheme>
      <div className={cn('flex items-center -z-10')}>
        <SkeletonBox />
        <Spacer />
        <SkeletonBox wrapperClassName={cn('hidden md:block')} width={160} />
      </div>
    </SkeletonTheme>
  );
}
