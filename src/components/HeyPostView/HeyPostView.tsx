import React, {useMemo} from 'react';

import Image from 'next/image';
import {Profile, ProfilePictureSet} from '@lens-protocol/react-web';

import {CampaignJourneyState} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import Spacer from '@forest-feed/components/common/Spacer';
import {HeartIcon, SwitchHorizontalIcon, ChatAlt2Icon} from '@heroicons/react/outline';
import {ForestTree, NoPicture, TreeSvg} from 'public/assets/images';
import {useI18n} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';

export type HeyPostViewProps = {
  content: string;
  image: CampaignJourneyState['image'];
  activeProfile: Profile | null | undefined;
};

export default function HeyPostView(props: HeyPostViewProps) {
  const {activeProfile, content, image} = props;

  const t = useI18n();

  const previewImage = useMemo(() => (image ? URL.createObjectURL(image as Blob) : ''), [image]);

  const pQA1 = useMemo(() => cn('p-1.5'), []);

  return (
    <div className={cn('bg-white shadow p-5 rounded-xl')}>
      <div className={cn('flex items-center pb-4')}>
        <Image
          src={(activeProfile?.metadata?.picture as ProfilePictureSet).optimized?.uri || NoPicture}
          alt="profile-picture"
          width={40}
          height={40}
          className={cn('rounded-full border border-tGray-200')}
          loading="lazy"
        />
        <Spacer times={1.5} />
        <div>
          <p>{activeProfile?.metadata?.displayName || activeProfile?.handle?.fullHandle}</p>
          <div className={cn('rounded-full border border-tGray-200')}>
            <p
              className={cn(
                'from-brand-600 dark:from-brand-400 bg-gradient-to-r to-pink-600 bg-clip-text text-transparent dark:to-pink-400 text-sm font-bold',
              )}
            >
              {activeProfile?.handle?.fullHandle}
            </p>
            <div className={cn('w-[3px] h-[3px] rounded-full bg-tGray-500 mx-1.5')} />
            <span className={cn('text-xs text-tGray-500')}>{t('now')}</span>
          </div>
        </div>
      </div>
      <div className={cn('ml-[53px]')}>
        <div className={cn('break-words')}>
          <div className={cn('whitespace-pre-wrap text-[1rem]')}>
            <p>{content}</p>
          </div>
        </div>
        {previewImage && image ? (
          <div className={cn('mt-3 w-2/3 relative')}>
            <Image
              className={cn('rounded-lg')}
              src={previewImage}
              alt="image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </div>
        ) : null}
        <div className={cn('mt-3 flex gap-x-6 gap-y-1 items-center')}>
          <div className={pQA1}>
            <ChatAlt2Icon className={cn('mt-3 flex gap-x-6 gap-y-1 items-center')} />
          </div>
          <div className={pQA1}>
            <SwitchHorizontalIcon className={cn('w-[15px] sm:w-[18px] text-brand-500')} />
          </div>
          <div className={pQA1}>
            <HeartIcon className={cn('w-[15px] sm:w-[18px] text-pink-500')} />
          </div>
          <div className={pQA1}>
            <Image
              alt="tree"
              src={TreeSvg}
              width={20}
              height={20}
              className={cn('w-[15px] sm:w-[18px] select-none')}
              draggable={false}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className={cn('mt-3 bg-[#EBF1E9] p-2 rounded-lg')}>
        <div>
          <p className={cn('text-sm font-bold')}>{t('impact')}</p>
          <div className={cn('flex items-center')}>
            <p className={cn('text-[10px] font-thin  flex items-center')}>
              {t('impactMirror', {
                appName: <span className={cn('text-tBlue-300 ml-1')}> {t('forestFeed')}</span>,
              })}
              <Image
                className={cn('ml-1')}
                src={ForestTree}
                alt="lesnter"
                width={20}
                height={20}
                draggable={false}
                loading="lazy"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
