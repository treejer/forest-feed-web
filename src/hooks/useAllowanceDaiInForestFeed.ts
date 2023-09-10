import {useAccount, useContractRead} from 'wagmi';

import {useDaiTokenContract, useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';
import {Abi} from 'viem';
import {BigNumberish} from 'ethers';
import {useMemo} from 'react';

export type UseAllowanceDaiInForestFeedParams = {
  enabled?: boolean;
  onSuccess?: (data: BigNumberish, value: number) => void;
  onError?: (err: Error) => void;
};

export function useAllowanceDaiInForestFeed(params: UseAllowanceDaiInForestFeedParams = {}) {
  const {enabled = true, onError, onSuccess} = params;

  const {address: walletAddress} = useAccount();
  const {abi, address} = useDaiTokenContract();
  const {address: forestFeedAddress} = useForestFeedContract();

  const {data: contractValue, ...contractData} = useContractRead<Abi, string, BigNumberish>({
    abi,
    address,
    args: [walletAddress, forestFeedAddress],
    enabled,
    functionName: 'allowance',
    onSuccess: data => {
      onSuccess?.(data, Number(data?.toString()) / 1e18);
      console.log(data, 'data in allowance read');
    },
    onError: err => {
      onError?.(err);
      console.log(err, 'error in allowance read');
    },
  });

  const allowance = useMemo(
    () => (contractValue !== undefined ? Number(contractValue?.toString()) / 1e18 : undefined),
    [contractValue],
  );

  return {
    contractValue,
    allowance,
    ...contractData,
  };
}
