import {ToastType} from '@forest-feed/utils/showToast';
import {useI18n} from '@forest-feed/locales/client';

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

  const t = useI18n();

  return (
    <div>
      {title ? (
        <p className={`text-md text-${type}`}>{translate ? t(title as any, variables?.title || {}) : title}</p>
      ) : null}
      <p className={`text-sm ${!title ? `text-${type}` : ''}`}>
        {translate ? t(message as any, variables?.message || {}) : message}
      </p>
    </div>
  );
}
