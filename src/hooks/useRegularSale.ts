import {useContractRead} from 'wagmi';
import {Abi} from 'viem';
import {BigNumberish} from 'ethers';

import {useRegularSaleContract} from '@forest-feed/redux/module/web3/web3.slice';

export function useRegularSale() {
  const {address, abi} = useRegularSaleContract();

  const {data} = useContractRead<Abi, string, BigNumberish>({
    address,
    abi,
    functionName: 'price',
  });

  return data;
}
