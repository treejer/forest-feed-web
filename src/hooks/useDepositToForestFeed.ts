import {useEffect, useState} from 'react';

import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi';

import {UseApproveDaiParams, UseApproveDaiReturnType} from '@forest-feed/hooks/useApproveDai';
import {useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';

export type UseDepositToForestFeedParams = UseApproveDaiParams;

export type UseDepositToForestFeedReturnType = UseApproveDaiReturnType;

export default function useDepositToForestFeed(params: UseDepositToForestFeedParams): UseDepositToForestFeedReturnType {
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
    if (data && data?.status === 'success') {
      onTxSuccess?.();
    }
  }, [data]);

  return [write, readyToUse, !!data];
}
