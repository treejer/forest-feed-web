import {useProfile, useSession} from '@lens-protocol/react-web';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';

export function useLensProfile() {
  const {
    web3: {selectedProfileId},
  } = useWeb3();

  const {data: session, loading} = useSession();

  const profile = useProfile({
    forProfileId: selectedProfileId,
  });

  return session?.authenticated ? profile : {data: undefined, loading, error: true};
}
