import React from 'react';

export enum RepostsStatus {
  active = 'active',
  stopped = 'stopped',
}

export type RepostsBadgeProps = {
  text: string;
  status: RepostsStatus;
};
type VariantClassNames = {
  [key in RepostsStatus]: string;
};

const className: VariantClassNames = {
  [RepostsStatus.active]: 'bg-green',
  [RepostsStatus.stopped]: 'bg-red',
};

export function RepostsBadge(props: RepostsBadgeProps) {
  const {text, status} = props;

  return (
    <div
      className={`border rounded-md w-[96px] h-[28px] text-lg font-semibold text-white text-center ${className[status]}`}
    >
      {text}
    </div>
  );
}
