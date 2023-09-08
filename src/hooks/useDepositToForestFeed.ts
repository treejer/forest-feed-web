import {useEffect, useMemo, useState} from 'react';

import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi';

import {UseApproveDaiParams, UseApproveDaiReturnType} from '@forest-feed/hooks/useApproveDai';
import {useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';

export type UseDepositToForestFeedParams = UseApproveDaiParams;

export type UseDepositToForestFeedReturnType = UseApproveDaiReturnType;

export function useDepositToForestFeed(params: UseDepositToForestFeedParams): UseDepositToForestFeedReturnType {
  const {
    amount,
    enabled = true,
    onTxSuccess,
    onContractWriteSuccess,
    onContractWriteError,
    onPrepareSuccess,
    onPrepareError,
  } = params;

  const [readyToUse, setReadyToUse] = useState(false);
  const [txHash, setTxHash] = useState('');

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
      onContractWriteSuccess?.(data);
      setTxHash(data.hash);
      console.log(data, 'success in write deposit');
    },
    onError: err => {
      onContractWriteError?.(err);
      console.log(err, 'error in write deposit');
    },
  });

  const {data} = useWaitForTransaction({
    hash: txHash as `0x${string}`,
    enabled: !!txHash,
  });

  useEffect(() => {
    if (data) {
      onTxSuccess?.();
    }
  }, [data]);

  const canUse = useMemo(() => readyToUse && !!write, [readyToUse, write]);

  return [write, canUse, !!data];
}
