import React, {useCallback, useRef, useState} from 'react';

import {AnimatePresence} from 'framer-motion';

import {shortenedString} from '@forest-feed/utils/string';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {Menu} from '@forest-feed/components/layout/Menu';
import {useTabFocus} from '@forest-feed/hooks/useTabFocus';

export type UserWalletProps = {
  handle?: string;
  address: string;
  isSupportedNetwork: boolean;
  onDisconnect: () => void;
};
export function UserWallet(props: UserWalletProps) {
  const {handle, address, isSupportedNetwork, onDisconnect} = props;

  const [inHover, setInHover] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = useCallback(() => {
    setInHover(prevState => !prevState);
    dropdownRef?.current?.classList.toggle('dropdown-open');
  }, []);

  const handleCloseMenu = useCallback(() => {
    setInHover(false);
    dropdownRef?.current?.classList.remove('dropdown-open');
  }, []);

  useTabFocus({
    blur: handleCloseMenu,
  });

  return (
    <div className="transition-all flex items-center drop-shadow-lg z-50">
      <div
        ref={dropdownRef}
        onMouseEnter={handleToggleMenu}
        onMouseLeave={handleToggleMenu}
        className="flex items-center py-1 dropdown dropdown-hover dropdown-bottom"
      >
        <div className="bg-primaryBg border-2 w-[150px] h-8 rounded-full border-white flex items-center justify-start pl-3 -mr-8 text-sm font-semibold cursor-pointer">
          {handle ? <span className="text-green">@{handle}</span> : shortenedString(address, 14, 4)}
        </div>
        <div className="border-2 w-[42px] h-[42px] rounded-full border-white flex items-end justify-end bg-red mb-30">
          <AssetIcon />
        </div>
        <AnimatePresence>
          {inHover ? (
            <Menu
              address={address}
              lensLoggedIn={!!handle}
              isSupportedNetwork={isSupportedNetwork}
              onDisconnect={onDisconnect}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <div className="ml-3 z-10">
        <TreeIcon />
      </div>
    </div>
  );
}
