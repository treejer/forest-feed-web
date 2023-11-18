import Image from 'next/image';
import {LensTree as LensTreeImage} from 'public/assets/images/index';

export default function LensTree() {
  return (
    <Image
      src={LensTreeImage}
      alt="logo"
      width={122}
      height={23}
      placeholder="blur"
      blurDataURL={LensTreeImage.blurDataURL}
    />
  );
}
