import {useProfile} from '@lens-protocol/react-web';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

export function useLensProfile() {
  const {
    web3: {selectedProfileId},
  } = useWeb3();

  return useProfile({
    forProfileId: selectedProfileId,
  });
}

//TODO: check authenticated
