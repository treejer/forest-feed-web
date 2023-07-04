import React, {Children} from 'react';
import {Logo} from './Icons/Checkbox/LogoIcon';
import {AssetIcon} from './Icons/AssetIcon';
import {Spacer} from './Spacer';
import {TreeIcon} from './Icons/TreeIcon';

export type RootLayoutProps = {
  text: string;
};

export function AppHeader(props: RootLayoutProps) {
  const {text} = props;
  return (
    <div className="flex items-center justify-between px-10">
      <Logo />
      <div className="flex items-center">
        <div className="border-2 w-36 h-8 rounded-full border-white flex items-end justify-end -mr-10 pr-20">
          {text}
        </div>
        <div className="border-2 w-[42px] h-[42px] rounded-full border-white flex items-end justify-end bg-red mb-30">
          <AssetIcon />
        </div>
        <TreeIcon />
      </div>
    </div>
  );
}
