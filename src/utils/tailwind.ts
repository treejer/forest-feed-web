import clsx from 'clsx';
import {twMerge, ClassNameValue} from 'tailwind-merge';

export function cn(...className: ClassNameValue[]) {
  return twMerge(clsx(className));
}
