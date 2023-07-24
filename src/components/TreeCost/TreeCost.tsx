import React from 'react';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {WalletAssets} from '@forest-feed/components/WalletAssets/WalletAssets';
import {useTranslations} from 'use-intl';

export type TreeCostProps = {
  treeCount: number;
  costValue: number;
};

export function TreeCost(props: TreeCostProps) {
  const {treeCount, costValue} = props;

  const t = useTranslations();

  return (
    <div>
      <span className="font-bold">{t('trees')}</span>
      <div className="flex items-center justify-center bg-lightGreen border border-border rounded-md w-full h-[71px] font-size text-lg font-normal">
        {treeCount}
      </div>
      <Spacer />
      <span className="font-bold">{t('cost')}</span>
      <div className="flex items-center justify-center bg-yellow border-border rounded-md w-full h-[71px] font-size text-lg font-normal">
        {t('dollarSign', {
          value: costValue,
        })}
      </div>
      <Spacer times={4} />
      <WalletAssets />
    </div>
  );
}
