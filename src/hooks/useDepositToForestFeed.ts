import {useMemo, useState} from 'react';

import {useContractWrite, usePrepareContractWrite} from 'wagmi';

import {UseApproveDaiParams, UseApproveDaiReturnType} from '@forest-feed/hooks/useApproveDai';
import {useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';

export type UseDepositToForestFeedParams = UseApproveDaiParams;

export type UseDepositToForestFeedReturnType = UseApproveDaiReturnType;

export function useDepositToForestFeed(params: UseDepositToForestFeedParams): UseDepositToForestFeedReturnType {
  const {amount, enabled = true, onSuccess, onError, onPrepareSuccess, onPrepareError} = params;

  const [readyToUse, setReadyToUse] = useState(false);

  const {address, abi} = useForestFeedContract();

  const {config} = usePrepareContractWrite({
    address,
    abi,
    args: [amount],
    functionName: 'deposit',
    onSuccess: data => {
      onPrepareSuccess?.(data);
      setReadyToUse(true);
      console.log(data, 'success in deposit config');
    },
    onError: err => {
      onPrepareError?.(err);
      console.log(err, 'error in deposit config');
    },
    enabled,
  });
  const {write} = useContractWrite({
    ...config,
    onSuccess: data => {
      onSuccess?.(data);
      console.log(data, 'success in write deposit');
    },
    onError: err => {
      onError?.(err);
      console.log(err, 'error in write deposit');
    },
  });

  const canUse = useMemo(() => readyToUse && !!write, [readyToUse, write]);

  return [write, canUse];
}
