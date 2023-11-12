import React from 'react';

import {SkeletonTheme} from 'react-loading-skeleton';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {SkeletonBox} from '@forest-feed/components/layout/AppHeaderSkeleton';

export function LensProfileItemSkeleton() {
  return (
    <SkeletonTheme>
      <div className="border border-border rounded-[4px] px-3 py-1 flex justify-between items-center -z-10 mb-1 last:mb-0">
        <div className="flex items-center">
          <SkeletonBox width={40} height={40} wrapperClassName="rounded-full" />
          <Spacer />
          <SkeletonBox width={60} />
        </div>
        <SkeletonBox width={44} height={44} />
      </div>
    </SkeletonTheme>
  );
}
