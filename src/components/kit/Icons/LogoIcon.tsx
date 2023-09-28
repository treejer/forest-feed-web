import Image from 'next/image';

import {Logo as ForestLogo} from 'public/assets/images/index';

export function Logo() {
  return (
    <Image
      className="w-12 md:auto h-auto"
      src={ForestLogo}
      alt="logo"
      width={48}
      height={54}
      placeholder="blur"
      blurDataURL={ForestLogo.blurDataURL}
    />
  );
}
