export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  menu = 'menu',
  text = 'text',
}

export type ButtonProps = {
  text: string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
};

type VariantClassNames = {
  [key in ButtonVariant]: string;
};

const classNames: VariantClassNames = {
  [ButtonVariant.primary]: `h-14 w-[144px] bg-white border-primary border-2 text-lg font-medium transition-shadow hover:shadow-lg disabled:bg-white/60`,
  [ButtonVariant.secondary]: `h-14 w-[160px] bg-primaryGreen text-white text-lg font-medium transition-shadow hover:shadow-lg disabled:bg-primaryGreen/60`,
  [ButtonVariant.menu]: `h-[48px] w-[100%] bg-activeGray border-activeGray border-2 text-sm font-normal transition-shadow hover:shadow-lg disabled:bg-activeGray/60`,
  [ButtonVariant.text]: `w-[100%] h-14 text-sm transition-shadow hover:shadow-lg disabled:bg-opacity/50`,
};

export function Button(props: ButtonProps) {
  const {variant = ButtonVariant.primary, text, onClick, className, disabled, type = 'button'} = props;

  return (
    <button
      className={`rounded-[8px] flex items-center justify-center ${classNames[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}
