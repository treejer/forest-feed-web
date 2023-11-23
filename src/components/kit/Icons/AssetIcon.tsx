import {useMemo} from 'react';

import Image from 'next/image';

import {NoPicture, Asset} from 'public/assets/images';

export type AssetIconProps = {
  loggedIn?: boolean;
  avatar?: string;
};

export default function AssetIcon(props: AssetIconProps) {
  const {loggedIn, avatar} = props;

  const src = useMemo(() => (loggedIn ? avatar || NoPicture : Asset), [avatar, loggedIn]);
  const blurDataUrl = useMemo(
    () => (loggedIn ? avatar || NoPicture.blurDataURL : Asset.blurDataURL),
    [avatar, loggedIn],
  );
  const size = useMemo(() => (!loggedIn ? 42 : undefined), [loggedIn]);

  return (
    <Image
      src={src}
      alt="avatar"
      width={size}
      height={size}
      loading="lazy"
      placeholder="blur"
      layout={loggedIn ? 'fill' : undefined}
      objectFit={loggedIn ? 'contain' : undefined}
      blurDataURL={blurDataUrl}
    />
  );
}
