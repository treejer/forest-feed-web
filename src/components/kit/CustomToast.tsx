import {useTranslations} from 'use-intl';

import {ToastType} from '@forest-feed/utils/showToast';
import {RenderIf} from '@forest-feed/components/common/RenderIf';

export type CustomToastProps<T = any, V = any> = {
  title: string;
  message?: string;
  type: ToastType;
  translate: boolean;
  variables?: {
    title?: T;
    message?: V;
  };
};

export function CustomToast<T = any, V = any>(props: CustomToastProps<T, V>) {
  const {title, message, type, translate, variables} = props;

  const t = useTranslations();

  return (
    <div>
      <p className="text-md">{translate ? t(title, variables?.title || {}) : title}</p>
      <RenderIf condition={!!message}>
        <p className="text-sm">{translate ? t(message, variables?.message || {}) : message}</p>
      </RenderIf>
    </div>
  );
}
