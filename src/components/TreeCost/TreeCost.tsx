import React from 'react';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {WalletAssets} from '@forest-feed/components/WalletAssets/WalletAssets';
import {useTranslations} from 'use-intl';

export type TreeCostProps = {
  treeCount: number;
  onChangeTrees: (e: React.ChangeEvent<HTMLInputElement>) => void;
  costValue: number;
};

export function TreeCost(props: TreeCostProps) {
  const {treeCount, costValue, onChangeTrees} = props;

  const t = useTranslations();

  return (
    <div>
      <span className="font-bold">{t('trees')}</span>
      <input
        className="flex bg-lightGreen border border-border rounded-md w-full h-[71px] font-size text-lg font-normal text-center"
        value={treeCount}
        onChange={onChangeTrees}
      />
      <Spacer />
      <span className="font-bold">{t('cost')}</span>
      <input
        readOnly
        value={t('dollarSign', {
          value: costValue,
        })}
        className="bg-yellow border-border rounded-md w-full h-[71px] font-size text-lg font-normal text-center"
      />
      <Spacer times={4} />
      <WalletAssets />
    </div>
  );
}
