import React from 'react';

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import {Spacer} from '@forest-feed/components/common/Spacer';

export type SkeletonBoxProps = {
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
};

export function SkeletonBox(props: SkeletonBoxProps) {
  const {wrapperClassName, height = 40, width = 200} = props;

  return (
    <div className={wrapperClassName}>
      <Skeleton height={height} width={width} />
    </div>
  );
}

export function AppHeaderSkeleton() {
  return (
    <SkeletonTheme>
      <div className="flex items-center">
        <SkeletonBox />
        <Spacer />
        <SkeletonBox wrapperClassName="hidden md:block" width={160} />
      </div>
    </SkeletonTheme>
  );
}
