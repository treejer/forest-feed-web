import React, {useMemo} from 'react';

import {useTranslations} from 'use-intl';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {WalletAssets} from '@forest-feed/components/WalletAssets/WalletAssets';
import {useRegularSale} from '@forest-feed/hooks/useRegularSale';

export type TreeCostProps = {
  treeCount: number;
};

export function TreeCost(props: TreeCostProps) {
  const {treeCount} = props;

  const salePriceBigNum = useRegularSale();

  const salePrice = useMemo(() => Number(salePriceBigNum?.toString()) / 1e18, [salePriceBigNum]);

  const t = useTranslations();

  return (
    <div>
      <div className="flex flex-row md:flex-col">
        <div className="flex flex-1 flex-col text-base">
          <span className="font-bold">{t('trees')}</span>
          <div className="flex items-center justify-center bg-lightGreen border border-border rounded-md w-full h-[64px] md:h-[71px] font-size text-lg font-normal">
            {treeCount}
          </div>
        </div>
        <Spacer />
        <div className="flex flex-1 flex-col text-base">
          <span className="font-bold">{t('cost')}</span>
          <div className="flex items-center justify-center bg-yellow border-border rounded-md w-full h-[64px] md:h-[71px] font-size text-lg font-normal">
            {salePriceBigNum
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
