import {polygon, polygonMumbai} from 'wagmi/chains';

export function isSupportedNetwork(chainId: number | string) {
  return ([polygon.id, polygonMumbai.id] as number[]).includes(+chainId);
}
