import Image from 'next/image';

import {DaiToken} from 'public/assets/images';

export function DaiIcon() {
  return (
    <Image
      className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"
      width={30}
      height={30}
      src={DaiToken}
      alt="Dai"
      placeholder="blur"
      blurDataURL="/assets/images/daiToken.svg"
    />
  );
}
