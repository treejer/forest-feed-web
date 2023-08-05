import React, {useMemo} from 'react';

import {useTranslations} from 'use-intl';
import {useContractRead} from 'wagmi';
import {BigNumberish, ethers} from 'ethers';
import {Abi} from 'viem';

import {Spacer} from '@forest-feed/components/common/Spacer';
import {WalletAssets} from '@forest-feed/components/WalletAssets/WalletAssets';
import {useRegularSale} from '@forest-feed/redux/module/web3/web3.slice';

export type TreeCostProps = {
  treeCount: number;
};

export function TreeCost(props: TreeCostProps) {
  const {treeCount} = props;

  const {abi, address} = useRegularSale();
  const {data: salePrice} = useContractRead<Abi, string, BigNumberish>({
    address,
    abi,
    functionName: 'price',
  });

  const price = useMemo(() => (salePrice ? ethers.utils.formatEther(salePrice) : null), [salePrice]);

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
          value: treeCount * Number(price),
        })}
      </div>
      <Spacer times={4} />
      <WalletAssets />
    </div>
  );
}
