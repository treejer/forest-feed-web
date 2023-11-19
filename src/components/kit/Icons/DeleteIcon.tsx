import Image from 'next/image';

import {Delete} from 'public/assets/images';

export default function DeleteIcon() {
  return (
    <Image
      src={Delete}
      alt="Delete"
      width={16}
      height={16}
      placeholder="blur"
      blurDataURL={Delete.blurDataURL}
      loading="lazy"
    />
  );
}
