import {userAgent} from 'next/server';

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  menu = 'menu',
  text = 'text',
}

export type ButtonProps = {
  text: string;
  variant?: ButtonVariant;
  onClick?: () => void;
};

type VariantClassNames = {
  [key in ButtonVariant]: string;
};

const classNames: VariantClassNames = {
  [ButtonVariant.primary]: 'h-[56px] w-[144px] bg-white border-primary border-2 text-lg font-medium',
  [ButtonVariant.secondary]: 'h-[56px] w-[160px] bg-primaryGreen text-white text-lg font-medium',
  [ButtonVariant.menu]: 'h-[48px] w-[100%] bg-activeGray border-activeGray border-2 text-sm font-normal',
  [ButtonVariant.text]: 'w-[100%] bg-white ',
};

export function Button(props: ButtonProps) {
  const {variant = ButtonVariant.primary, text, onClick} = props;

  return (
    <div className={`rounded-[8px] flex items-center justify-center ${classNames[variant]}`} onClick={onClick}>
      {text}
    </div>
  );
}
