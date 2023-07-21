'use client';

import {useTranslations} from 'use-intl';

import {Button} from '@forest-feed/components/kit/Button';
import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {BlockchainNetwork} from '@forest-feed/config';

export default function Home() {
  const t = useTranslations();

  const {dispatchSwitchNetwork} = useWeb3();

  return (
    <div>
      <Button text={t('hello')} onClick={() => dispatchSwitchNetwork({newNetwork: BlockchainNetwork.Mumbai})} />
    </div>
  );
}
