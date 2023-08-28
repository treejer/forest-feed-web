import {useMemo, useState} from 'react';

import {useContractWrite, usePrepareContractWrite} from 'wagmi';
import {PrepareWriteContractResult, WriteContractResult} from '@wagmi/core';

import {useDaiTokenContract, useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';

export type UseApproveDaiParams = {
  onSuccess?: (data: WriteContractResult) => void;
  onError?: (error: Error) => void;
  onPrepareSuccess?: (data: PrepareWriteContractResult<any, 'approve', number>) => void;
  onPrepareError?: (error: Error) => void;
  enabled?: boolean;
  amount: number;
};

export type UseApproveDaiReturnType = [(() => void) | undefined, boolean];

export function useApproveDai(params: UseApproveDaiParams): UseApproveDaiReturnType {
  const {amount, enabled = true, onSuccess, onError, onPrepareSuccess, onPrepareError} = params;

  const [readyToUse, setReadyToUse] = useState(false);

  const {address, abi} = useDaiTokenContract();
  const {address: forestFeedAddress} = useForestFeedContract();

  const {config} = usePrepareContractWrite({
    address,
    abi,
    args: [forestFeedAddress, amount],
    onSuccess: data => {
      onPrepareSuccess?.(data);
      setReadyToUse(true);
      console.log(data, 'success in approve config');
    },
    onError: err => {
      onPrepareError?.(err);
      console.log(err, 'error in approve config');
    },
    functionName: 'approve',
    enabled,
  });
  const {write} = useContractWrite({
    ...config,
    onSuccess: data => {
      onSuccess?.(data);
      console.log(data, 'data in write approve');
    },
    onError: err => {
      onError?.(err);
      console.log(err, 'error in write approve');
    },
  });

  const canUse = useMemo(() => readyToUse && !!write, [readyToUse, write]);

  return [write, canUse];
}
