import React from 'react';

import Image from 'next/image';

export enum ChevronIconDirection {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type ChevronIconProps = {
  size?: number;
  className?: string;
  direction: ChevronIconDirection;
};

const directionClassNames = {
  [ChevronIconDirection.up]: '-rotate-90',
  [ChevronIconDirection.down]: 'rotate-90',
  [ChevronIconDirection.right]: '',
  [ChevronIconDirection.left]: 'rotate-180',
};

export function ChevronIcon(props: ChevronIconProps) {
  const {size = 16, className, direction} = props;
  return (
    <Image
      src="/assets/images/ChevronRight.png"
      alt="add"
      className={`transition-all inline ${directionClassNames[direction]} ${className}`}
      width={size}
      height={size}
    />
  );
}
