import React from 'react';

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import {Spacer} from '@forest-feed/components/common/Spacer';

export type SkeletonBoxProps = {
  width?: number;
  height?: number;
};

export function SkeletonBox(props: SkeletonBoxProps) {
  const {height = 40, width = 200} = props;

  return (
    <div>
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
        <SkeletonBox width={160} />
        <Spacer />
        <SkeletonBox width={160} />
        <Spacer />
        <SkeletonBox width={30} />
      </div>
    </SkeletonTheme>
  );
}
