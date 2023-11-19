import {useAccount, useContractRead} from 'wagmi';

import {Abi} from 'viem';
import {BigNumberish} from 'ethers';
import {useMemo} from 'react';
import useDaiTokenContract from '@forest-feed/hooks/useDaiTokenContract';
import useForestFeedContract from '@forest-feed/hooks/useForestFeedContract';

export type UseAllowanceDaiInForestFeedParams = {
  enabled?: boolean;
  onSuccess?: (data: BigNumberish, value: number) => void;
  onError?: (err: Error) => void;
};

export default function useAllowanceDaiInForestFeed(params: UseAllowanceDaiInForestFeedParams = {}) {
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
