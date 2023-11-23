import {toast} from 'react-toastify';

import CustomToast from '@forest-feed/components/kit/CustomToast';

export enum ToastType {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
  default = 'default',
}

export type ShowToastArgs<T = any, V = any> = {
  title?: string;
  message: string;
  type: ToastType;
  translate: boolean;
  variables?: {
    title?: T;
    message?: V;
  };
};
export function showToast<T = any, V = any>({title, message, type, translate = true, variables}: ShowToastArgs<T, V>) {
  toast(<CustomToast<T, V> title={title} message={message} type={type} translate={translate} variables={variables} />, {
    type,
  });
}

export function* showSagaToast<T = any, V = any>(toast: ShowToastArgs<T, V>) {
  return showToast(toast);
}
