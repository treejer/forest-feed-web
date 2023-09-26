import Image from 'next/image';

import {LensLogo} from 'public/assets/images';

export function LensIcon() {
  return (
    <Image
      src={LensLogo}
      alt="lens-logo"
      width={44}
      height={50}
      placeholder="blur"
      blurDataURL={LensLogo.blurDataURL}
    />
  );
}
