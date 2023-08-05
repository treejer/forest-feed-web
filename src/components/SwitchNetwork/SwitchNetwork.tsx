import React, {useCallback, useMemo} from 'react';

import {useTranslations} from 'use-intl';
import {ConnectButton} from '@rainbow-me/rainbowkit';

import {DropDown, DropDownItem} from '@forest-feed/components/kit/DropDown';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {BlockchainNetwork, networks} from '@forest-feed/config';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';

export function SwitchNetwork() {
  const {
    web3: {config, switching, isSupportedNetwork},
    dispatchSwitchNetwork,
  } = useWeb3();
  const {handleLensLogout} = useAuthLens();

  const t = useTranslations();

  const handleSwitchNetwork = useCallback(
    async (network: DropDownItem) => {
      dispatchSwitchNetwork({
        newNetwork: network.id as BlockchainNetwork,
        userInApp: true,
        onSuccess: handleLensLogout,
      });
    },
    [dispatchSwitchNetwork, handleLensLogout],
  );

  const networksList: DropDownItem[] = useMemo(
    () => [
      {
        id: networks[BlockchainNetwork.Polygon].network,
        text: t.rich(`switchNetwork.${networks[BlockchainNetwork.Polygon].title}`, {
          red: chunk => <span className="text-red">{chunk}</span>,
        }),
        image: networks[BlockchainNetwork.Polygon].logo,
      },
      {
        id: networks[BlockchainNetwork.Mumbai].network,
        text: t.rich(`switchNetwork.${networks[BlockchainNetwork.Mumbai].title}`, {
          red: chunk => <span className="ml-1 text-red">{chunk}</span>,
        }),
        image: networks[BlockchainNetwork.Mumbai].logo,
      },
    ],
    [t],
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
