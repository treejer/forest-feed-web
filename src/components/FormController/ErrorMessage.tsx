'use client';

import React, {memo} from 'react';

import {useTranslations} from 'use-intl';

export type ErrorMessageProps = {
  name: string;
  error: string | undefined;
  touched: boolean;
  isSubmitted: boolean;
};

export const ErrorMessage = memo(function ErrorMessage(props: ErrorMessageProps) {
  const {name, touched, error, isSubmitted} = props;

  const t = useTranslations();

  return (isSubmitted || touched) && error && name ? (
    <p className="text-red text-sm">
      {t(error, {
        value: t(`labels.${name}`),
      })}
    </p>
  ) : null;
});
