import React from 'react';

import {motion} from 'framer-motion';
import {ArrowLeftIcon} from '@heroicons/react/solid';

import shortenedString from '@forest-feed/utils/string';
import Spacer from '@forest-feed/components/common/Spacer';
import RenderIf from '@forest-feed/components/common/RenderIf';
import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import SwitchNetwork from '@forest-feed/components/SwitchNetwork/SwitchNetwork';
import useCopyToClipboard from '@forest-feed/hooks/useCopyToClipboard';
import cn from '@forest-feed/utils/tailwind';
import {useI18n} from '@forest-feed/locales/client';

export type MenuProps = {
  address: string;
  lensLoggedIn: boolean;
  isSupportedNetwork: boolean;
  onDisconnect: () => void;
};

export default function Menu(props: MenuProps) {
  const {address, lensLoggedIn, isSupportedNetwork, onDisconnect} = props;

  const [copiedValue, copy] = useCopyToClipboard();

  const t = useI18n();

  return (
    <motion.div
      tabIndex={0}
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -10}}
      transition={{duration: 0.2}}
      className={cn('dropdown-content right-0 md:right-auto bg-white z-50 rounded-[5px] w-56')}
    >
      <div className={cn('shadow-lg p-5')}>
        <RenderIf condition={lensLoggedIn && isSupportedNetwork}>
          <div className={cn('flex justify-center')}>
            <button
              className={cn(
                'bg-primaryBg group border-2 w-[150px] h-8 rounded-full border-border flex items-center justify-center text-sm font-semibold cursor-pointer relative overflow-hidden',
              )}
              onClick={() => copy(address)}
            >
              {shortenedString(address || '', 14, 4)}
            </button>
            <RenderIf condition={!!copiedValue}>
              <span className={cn('text-green text-sm absolute top-0')}>{t('copied')}</span>
            </RenderIf>
          </div>
          <Spacer />
        </RenderIf>
        <SwitchNetwork />
        <Spacer />
        <Button
          className={cn('h-auto py-2 text-sm w-full')}
          autoSize={false}
          text={t('disconnect')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          onClick={onDisconnect}
          variant={ButtonVariant.secondary}
        />
      </div>
    </motion.div>
  );
}
