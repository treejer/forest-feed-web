import React from 'react';

import {motion} from 'framer-motion';
import {useTranslations} from 'use-intl';
import {ArrowLeftOnRectangleIcon} from '@heroicons/react/24/solid';

import {shortenedString} from '@forest-feed/utils/string';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {SwitchNetwork} from '@forest-feed/components/SwitchNetwork/SwitchNetwork';
import {SwitchProfile} from '@forest-feed/components/SwitchProfile/SwitchProfile';
import {useCopyToClipboard} from '@forest-feed/hooks/useCopyToClipboard';

export type MenuProps = {
  address: string;
  lensLoggedIn: boolean;
  isSupportedNetwork: boolean;
  onDisconnect: () => void;
};

export function Menu(props: MenuProps) {
  const {address, lensLoggedIn, isSupportedNetwork, onDisconnect} = props;

  const [copiedValue, copy] = useCopyToClipboard();

  const t = useTranslations();

  return (
    <motion.div
      tabIndex={0}
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      transition={{duration: 0.2}}
      className="dropdown-content bg-white z-50 rounded-[5px] w-56"
    >
      <div className="shadow-lg p-5">
        <RenderIf condition={lensLoggedIn && isSupportedNetwork}>
          <div className="flex justify-center">
            <button
              className="bg-primaryBg group border-2 w-[150px] h-8 rounded-full border-border flex items-center justify-center text-sm font-semibold cursor-pointer relative overflow-hidden"
              onClick={() => copy(address)}
            >
              {shortenedString(address || '', 14, 4)}
            </button>
            <RenderIf condition={!!copiedValue}>
              <span className="text-green text-sm absolute top-0">{t('copied')}</span>
            </RenderIf>
          </div>
          <Spacer />
        </RenderIf>
        <SwitchNetwork />
        <RenderIf condition={lensLoggedIn && isSupportedNetwork}>
          <Spacer />
          <SwitchProfile />
        </RenderIf>
        <Spacer />
        <Button
          className="h-auto py-2 text-sm w-full"
          text={t('disconnect')}
          icon={<ArrowLeftOnRectangleIcon className="w-5 h-5" />}
          onClick={onDisconnect}
          variant={ButtonVariant.secondary}
        />
      </div>
    </motion.div>
  );
}
