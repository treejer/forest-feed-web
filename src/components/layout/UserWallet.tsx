import React, {useCallback, useMemo, useRef, useState} from 'react';

import {MediaSet, useActiveProfile} from '@lens-protocol/react-web';
import {AnimatePresence} from 'framer-motion';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {shortenedString} from '@forest-feed/utils/string';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {Menu} from '@forest-feed/components/layout/Menu';
import {useTabFocus} from '@forest-feed/hooks/useTabFocus';

export type UserWalletProps = {
  address: string;
  isSupportedNetwork: boolean;
  onDisconnect: () => void;
};

export function UserWallet(props: UserWalletProps) {
  const {address, isSupportedNetwork, onDisconnect} = props;

  const [inHover, setInHover] = useState(false);

  const {data: lensProfile} = useActiveProfile();
  const {
    web3: {lensProfile: persistLensProfile},
  } = useWeb3();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = useCallback(() => {
    setInHover(true);
    dropdownRef?.current?.classList.add('dropdown-open');
  }, []);

  const handleCloseMenu = useCallback(() => {
    setInHover(false);
    dropdownRef?.current?.classList.remove('dropdown-open');
  }, []);

  useTabFocus({
    blur: handleCloseMenu,
  });

  const handle = useMemo(() => (lensProfile || persistLensProfile)?.handle, [lensProfile, persistLensProfile]);
  const avatar = useMemo(
    () => ((lensProfile || persistLensProfile)?.picture as MediaSet)?.original?.url,
    [lensProfile, persistLensProfile],
  );

  return (
    <div className="transition-all flex items-center drop-shadow-lg z-50">
      <div
        ref={dropdownRef}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
        className="flex items-center py-1 dropdown dropdown-hover dropdown-bottom"
      >
        <div className="bg-primaryBg border-2 min-w-[150px] h-8 rounded-full border-white flex items-center justify-start pl-3 -mr-8 text-sm font-semibold cursor-pointer">
          {handle ? <span className="text-green">@{handle}</span> : shortenedString(address, 14, 4)}
        </div>
        <div className="border-2 w-[42px] h-[42px] rounded-full border-white relative bg-primaryBg overflow-hidden mb-30">
          <AssetIcon loggedIn={!!handle} avatar={avatar} />
        </div>
        <AnimatePresence>
          {inHover ? (
            <Menu
              address={address}
              lensLoggedIn={!!lensProfile?.handle}
              isSupportedNetwork={isSupportedNetwork}
              onDisconnect={onDisconnect}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <div className="hidden md:block ml-3 z-10">
        <TreeIcon />
      </div>
    </div>
  );
}
