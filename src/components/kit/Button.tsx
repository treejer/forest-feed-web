import React from 'react';

import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  menu = 'menu',
  text = 'text',
}

export type ButtonProps = {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
};

type VariantClassNames = {
  [key in ButtonVariant]: string;
};

const classNames: VariantClassNames = {
  [ButtonVariant.primary]: 'h-14 w-[144px] bg-white border-primary border-2 text-lg font-medium',
  [ButtonVariant.secondary]: 'h-14 w-[160px] bg-primaryGreen text-white text-lg font-medium',
  [ButtonVariant.menu]: 'h-[48px] w-[100%] bg-activeGray border-activeGray border-2 text-sm font-normal',
  [ButtonVariant.text]: 'w-[100%] h-14 text-sm',
};

export function Button(props: ButtonProps) {
  const {variant = ButtonVariant.primary, text, icon, onClick, className, disabled} = props;

  return (
    <button
      className={`rounded-[8px] flex items-center justify-center ${classNames[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <RenderIf condition={!!icon}>
        {icon}
        <Spacer />
      </RenderIf>
      {text}
    </button>
  );
}
