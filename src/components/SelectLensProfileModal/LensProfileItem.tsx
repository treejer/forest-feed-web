import {Profile, ProfilePictureSet} from '@lens-protocol/react-web';
import Image from 'next/image';

import {NoPicture} from '../../../public/assets/images';
import {cn} from '@forest-feed/utils/tailwind';

export type LensProfileItemProps = {
  profile: Profile;
  disabled: boolean;
  onClick: () => void;
  loading: boolean;
};
export function LensProfileItem(props: LensProfileItemProps) {
  const {profile, disabled, loading, onClick} = props;

  return (
    <li className={cn('border border-border rounded-[4px] px-3 py-1 flex justify-between items-center mb-1 last:mb-0')}>
      <div className={cn('flex items-center')}>
        <Image
          className={cn('rounded-full')}
          src={(profile.metadata?.picture as ProfilePictureSet).optimized?.uri || NoPicture}
          width={50}
          height={50}
          alt={`${profile.id}-profile-picture`}
        />
        <span className={cn('font-bold ml-2 text-secondary')}>@{profile.handle?.fullHandle}</span>
      </div>
      <button
        disabled={disabled}
        className={cn(
          'border border-border rounded-[4px] border-l-border border-r-border animate-none transition-all duration-1000 w-11 h-11',
          {
            'rounded-[25px] border-l-green border-r-green animate-spin': loading,
          },
        )}
        onClick={onClick}
      ></button>
    </li>
  );
}
