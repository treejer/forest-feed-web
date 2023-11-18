'use client';

import React, {memo} from 'react';

import {useI18n} from '@forest-feed/locales/client';
import {cn} from '@forest-feed/utils/tailwind';

export type ErrorMessageProps = {
  name: string;
  error: string | undefined;
  touched: boolean;
  isSubmitted: boolean;
};

export const ErrorMessage = memo(function ErrorMessage(props: ErrorMessageProps) {
  const {name, touched, error, isSubmitted} = props;

  const t = useI18n();

  return (isSubmitted || touched) && error && name ? (
    <p className={cn('text-red text-xs md:text-sm')}>
      {t(error as any, {
        value: t(`labels.${name}` as any, {}),
      })}
    </p>
  ) : null;
});
