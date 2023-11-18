import Image from 'next/image';

import {TreePng} from 'public/assets/images';

export default function TreeIcon() {
  return <Image src={TreePng} alt="tree" width={28} height={36} placeholder="blur" blurDataURL={TreePng.blurDataURL} />;
}
