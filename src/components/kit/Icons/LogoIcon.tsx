import Image from 'next/image';

import {Logo as ForestLogo} from 'public/assets/images/index';
import {cn} from '@forest-feed/utils/tailwind';

export type LogoProps = {
  small?: boolean;
};
export function Logo(props: LogoProps) {
  const {small} = props;

  return (
    <Image
      className={cn('w-12 md:auto h-auto')}
      src={ForestLogo}
      alt="logo"
      width={small ? 36 : 48}
      height={small ? 43 : 54}
      placeholder="blur"
      blurDataURL={ForestLogo.blurDataURL}
    />
  );
}
