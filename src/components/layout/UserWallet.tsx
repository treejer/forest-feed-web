import React from 'react';

import {useTranslations} from 'use-intl';

import {shortenedString} from '@forest-feed/utils/string';
import {AssetIcon} from '@forest-feed/components/kit/Icons/AssetIcon';
import {TreeIcon} from '@forest-feed/components/kit/Icons/TreeIcon';
import {useCopyToClipboard} from '@forest-feed/hooks/useCopyToClipboard';

export type UserWalletProps = {
  walletAddress: string;
  onDisconnect: () => void;
};
export function UserWallet(props: UserWalletProps) {
  const {walletAddress, onDisconnect} = props;

  const [copiedText, handleCopy] = useCopyToClipboard();

  const t = useTranslations();

  return (
    <div className="group flex items-center">
      <div className="flex items-center relative py-1">
        <button
          onClick={() => handleCopy(walletAddress)}
          className="absolute bottom-0 inset-x-0 flex justify-center items-center top-0 bottom-0 group-hover:bottom-full transition-all duration-700"
        >
          <span className="text-sm bg-primaryGreen text-white rounded-t px-2">{t(copiedText ? 'copied' : 'copy')}</span>
        </button>
        <div className="bg-primaryBg group border-2 w-[150px] h-8 rounded-full border-white flex items-center justify-start pl-3 -mr-8 text-sm font-semibold cursor-pointer relative overflow-hidden">
          {shortenedString(walletAddress, 14, 4)}
          <button
            onClick={onDisconnect}
            className="inset-x-0 top-full bottom-0 group-hover:top-0 bg-yellow absolute transition-all text-black duration-500"
          >
            {t('disconnect')}
          </button>
        </div>
        <div className="border-2 w-[42px] h-[42px] rounded-full border-white flex items-end justify-end bg-red mb-30 z-10">
          <AssetIcon />
        </div>
      </div>
      <div className="ml-3 z-10">
        <TreeIcon />
      </div>
    </div>
  );
}
