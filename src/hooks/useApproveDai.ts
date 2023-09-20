import {useEffect, useState} from 'react';

import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi';
import {PrepareWriteContractResult, WriteContractResult} from '@wagmi/core';

import {useDaiTokenContract, useForestFeedContract} from '@forest-feed/redux/module/web3/web3.slice';

export type UseApproveDaiParams = {
  onTxSuccess?: () => void;
  onContractWriteSuccess?: (data: WriteContractResult) => void;
  onContractWriteError?: (error: Error) => void;
  onPrepareSuccess?: (data: PrepareWriteContractResult<any, 'approve', number>) => void;
  onPrepareError?: (error: Error) => void;
  enabled?: boolean;
  amount: number;
};

export type UseApproveDaiReturnType = [(() => void) | undefined, boolean, boolean];

export function useApproveDai(params: UseApproveDaiParams): UseApproveDaiReturnType {
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
      onContractWriteSuccess?.(data);
      setTxHash(data.hash);
      console.log(data, 'data in write approve');
    },
    onError: err => {
      onContractWriteError?.(err);
      console.log(err, 'error in write approve');
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
