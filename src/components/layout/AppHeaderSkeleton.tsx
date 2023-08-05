import React from 'react';

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import {Spacer} from '@forest-feed/components/common/Spacer';

export function AppHeaderSkeleton() {
  return (
    <SkeletonTheme>
      <div className="flex items-center">
        <div>
          <Skeleton height={40} width={200} />
        </div>
        <Spacer />
        <div>
          <Skeleton height={40} width={160} />
        </div>
        <Spacer />
        <div>
          <Skeleton height={40} width={160} />
        </div>
        <Spacer />
        <div>
          <Skeleton height={40} width={30} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
