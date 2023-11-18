import React from 'react';

import Spacer from '@forest-feed/components/common/Spacer';
import WalletAssets from '@forest-feed/components/WalletAssets/WalletAssets';
import useRegularSale from '@forest-feed/hooks/useRegularSale';
import {useI18n} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';

export type TreeCostProps = {
  treeCount: number;
};

export default function TreeCost(props: TreeCostProps) {
  const {treeCount} = props;

  const {contractValue, salePrice} = useRegularSale();

  const t = useI18n();

  return (
    <div>
      <div className={cn('flex flex-row md:flex-col')}>
        <div className={cn('flex flex-1 flex-col text-base')}>
          <span className={cn('font-bold')}>{t('trees')}</span>
          <div
            className={cn(
              'flex items-center justify-center bg-lightGreen border border-border rounded-md w-full h-[64px] md:h-[71px] font-size text-lg font-normal',
            )}
          >
            {treeCount}
          </div>
        </div>
        <Spacer />
        <div className={cn('flex flex-1 flex-col text-base')}>
          <span className={cn('font-bold')}>{t('cost')}</span>
          <div
            className={cn(
              'flex items-center justify-center bg-yellow border-border rounded-md w-full h-[64px] md:h-[71px] font-size text-lg font-normal',
            )}
          >
            {contractValue
              ? t('dollarSign', {
                  value: treeCount * salePrice,
                })
              : '...'}
          </div>
        </div>
      </div>
      <Spacer times={4} />
      <WalletAssets salePrice={salePrice} />
    </div>
  );
}
