import React, {useCallback} from 'react';

import {ConnectButton} from '@rainbow-me/rainbowkit';

import {DropDown, DropDownItem} from '@forest-feed/components/kit/DropDown';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {BlockchainNetwork, networks} from '@forest-feed/config';

export const networksList: DropDownItem[] = [
  {
    id: networks[BlockchainNetwork.Polygon].network,
    text: networks[BlockchainNetwork.Polygon].title,
    image: networks[BlockchainNetwork.Polygon].logo,
  },
  {
    id: networks[BlockchainNetwork.Mumbai].network,
    text: networks[BlockchainNetwork.Mumbai].title,
    image: networks[BlockchainNetwork.Mumbai].logo,
  },
];
export function SwitchNetwork() {
  const {
    web3: {config, switching, isSupportedNetwork},
    dispatchSwitchNetwork,
  } = useWeb3();

  const handleSwitchNetwork = useCallback(
    (network: DropDownItem) => {
      dispatchSwitchNetwork({newNetwork: network.id as BlockchainNetwork, userInApp: true});
    },
    [dispatchSwitchNetwork],
  );

  return isSupportedNetwork ? (
    <DropDown
      selected={networksList.find(network => network.id === config.chainId)!}
      items={networksList}
      onChange={handleSwitchNetwork}
      disabled={switching}
    />
  ) : (
    <ConnectButton />
  );
}
