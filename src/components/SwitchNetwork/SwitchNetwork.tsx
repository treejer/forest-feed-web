import React, {useCallback, useMemo} from 'react';

import {ConnectButton} from '@rainbow-me/rainbowkit';

import {DropDown, DropDownItem} from '@forest-feed/components/kit/DropDown';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {BlockchainNetwork, networks} from '@forest-feed/config';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {useI18n} from '@forest-feed/locales/client';
import {cn} from '@forest-feed/utils/tailwind';
import {Color} from 'colors';

export function SwitchNetwork() {
  const {
    web3: {config, switching, isSupportedNetwork},
    dispatchSwitchNetwork,
  } = useWeb3();
  const {handleLensLogout} = useAuthLens();

  const {campaignJourney} = useCampaignJourney();

  const t = useI18n();

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
        text: t(`switchNetwork.${networks[BlockchainNetwork.Polygon].title}` as any, {}),
        image: networks[BlockchainNetwork.Polygon].logo,
      },
      {
        id: networks[BlockchainNetwork.Mumbai].network,
        text: t(`switchNetwork.${networks[BlockchainNetwork.Mumbai].title}` as any, {
          text: <span className={cn('ml-1 text-red')}>{t('switchNetwork.testnet')}</span>,
        }),
        image: networks[BlockchainNetwork.Mumbai].logo,
      },
    ],
    [t],
  );

  const currentNetwork = useMemo(
    () => networksList.find(network => network.id === config.chainId),
    [config.chainId, networksList],
  );

  return isSupportedNetwork ? (
    <DropDown
      className={cn('w-full')}
      bgColor={Color.primaryBg}
      selected={currentNetwork!}
      items={networksList}
      onChange={handleSwitchNetwork}
      disabled={switching || campaignJourney.submissionLoading}
    />
  ) : (
    <ConnectButton />
  );
}
