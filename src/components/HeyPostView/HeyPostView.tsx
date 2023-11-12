import React, {useMemo} from 'react';

import Image from 'next/image';
import {Profile, ProfilePictureSet} from '@lens-protocol/react-web';

import {CampaignJourneyState} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {HeartIcon, SwitchHorizontalIcon, ChatAlt2Icon} from '@heroicons/react/outline';
import {ForestTree, NoPicture, TreeSvg} from 'public/assets/images';
import {useI18n} from '@forest-feed/locales/client';

export type HeyPostViewProps = {
  content: string;
  image: CampaignJourneyState['image'];
  activeProfile: Profile | null | undefined;
};

export function HeyPostView(props: HeyPostViewProps) {
  const {activeProfile, content, image} = props;

  const t = useI18n();

  const previewImage = useMemo(() => (image ? URL.createObjectURL(image as Blob) : ''), [image]);

  return (
    <div className="bg-white shadow p-5 rounded-xl">
      <div className="flex items-center pb-4">
        <Image
          src={(activeProfile?.metadata?.picture as ProfilePictureSet).optimized?.uri || NoPicture}
          alt="profile-picture"
          width={40}
          height={40}
          className="rounded-full border border-tGray-200"
        />
        <Spacer times={1.5} />
        <div>
          <p>{activeProfile?.metadata?.displayName || activeProfile?.handle?.fullHandle}</p>
          <div className="flex items-center">
            <p className="from-brand-600 dark:from-brand-400 bg-gradient-to-r to-pink-600 bg-clip-text text-transparent dark:to-pink-400 text-sm font-bold">
              {activeProfile?.handle?.fullHandle}
            </p>
            <div className="w-[3px] h-[3px] rounded-full bg-tGray-500 mx-1.5" />
            <span className="text-xs text-tGray-500">{t('now')}</span>
          </div>
        </div>
      </div>
      <div className="ml-[53px]">
        <div className="break-words">
          <div className="whitespace-pre-wrap text-[1rem]">
            <p>{content}</p>
          </div>
        </div>
        {previewImage && image ? (
          <div className="mt-3 w-2/3 relative">
            <Image className="rounded-lg" src={previewImage} alt="image" width={1000} height={1000} />
          </div>
        ) : null}
        <div className="mt-3 flex gap-x-6 gap-y-1 items-center">
          <div className="p-1.5">
            <ChatAlt2Icon className="w-[15px] sm:w-[18px] text-tBlue-500" />
          </div>
          <div className="p-1.5">
            <SwitchHorizontalIcon className="w-[15px] sm:w-[18px] text-brand-500" />
          </div>
          <div className="p-1.5">
            <HeartIcon className="w-[15px] sm:w-[18px] text-pink-500" />
          </div>
          <div className="p-1.5">
            <Image
              alt="tree"
              src={TreeSvg}
              width={20}
              height={20}
              className="w-[15px] sm:w-[18px] select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 bg-[#EBF1E9] p-2 rounded-lg">
        <div>
          <p className="text-sm font-bold">{t('impact')}</p>
          <div className="flex items-center">
            <p className="text-[10px] font-thin  flex items-center">
              {t('impactMirror', {
                appName: <span className="text-tBlue-300 ml-1"> {t('forestFeed')}</span>,
              })}
              <Image className="ml-1" src={ForestTree} alt="lesnter" width={20} height={20} draggable={false} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
