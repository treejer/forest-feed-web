import {useTranslations} from 'use-intl';

import {ToastType} from '@forest-feed/utils/showToast';

export type CustomToastProps<T = any, V = any> = {
  title?: string;
  message: string;
  type: ToastType;
  translate: boolean;
  variables?: {
    title?: T;
    message?: V;
  };
};

const possibleColors = ['text-error', 'text-success'];

export function CustomToast<T = any, V = any>(props: CustomToastProps<T, V>) {
  const {title, message, type, translate, variables} = props;

  console.log(title, message);

  const t = useTranslations();

  return (
    <div>
      {title ? <p className={`text-md text-${type}`}>{translate ? t(title, variables?.title || {}) : title}</p> : null}
      <p className={`text-sm ${!title ? `text-${type}` : ''}`}>
        {translate ? t(message, variables?.message || {}) : message}
      </p>
    </div>
  );
}
