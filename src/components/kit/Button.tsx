import React from 'react';
import {Circles} from 'react-loader-spinner';

import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {colors} from 'colors';

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  menu = 'menu',
  text = 'text',
}

export type ButtonProps = {
  icon?: React.ReactNode;
  text: React.ReactNode | string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  autoSize?: boolean;
  type?: 'button' | 'reset' | 'submit';
};

type VariantClassNames = {
  [key in ButtonVariant]: string;
};

const classNames: (autoSize: boolean) => VariantClassNames = autoSize => ({
  [ButtonVariant.primary]: `${
    autoSize ? 'h-10 w-[104px] lg:h-14 lg:w-[144px]' : ''
  } bg-white border-primary border-2 text-lg font-medium disabled:bg-white/60`,
  [ButtonVariant.secondary]: `${
    autoSize ? 'h-10 w-[104px] lg:h-14 lg:w-[160px]' : ''
  } bg-primaryGreen text-white text-lg font-medium disabled:bg-primaryGreen/60`,
  [ButtonVariant.menu]: `${
    autoSize ? 'h-10 w-[104px] lg:h-[48px] lg:w-[100%]' : ''
  } bg-activeGray border-activeGray border-2 text-sm font-normal disabled:bg-activeGray/60`,
  [ButtonVariant.text]: `${autoSize ? 'w-[100%] h-10 lg:h-14' : ''} text-sm disabled:bg-opacity/50`,
});

export function Button(props: ButtonProps) {
  const {
    variant = ButtonVariant.primary,
    autoSize = true,
    text,
    loading,
    onClick,
    className,
    disabled,
    icon,
    type = 'button',
  } = props;

  return (
    <button
      className={`rounded-[8px] flex items-center justify-center hover:shadow-lg transition-all text-sm md:text-base ${
        classNames(autoSize)[variant]
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <Circles height="20" width="20" color={colors.white} ariaLabel="circles-loading" visible={true} />
      ) : (
        <>
          <RenderIf condition={!!icon}>
            {icon}
            <Spacer />
          </RenderIf>
          {text}
        </>
      )}
    </button>
  );
}
