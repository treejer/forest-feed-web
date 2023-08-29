import React from 'react';

import {useTranslations} from 'use-intl';

export function EmptyTable() {
  const t = useTranslations();

  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-green text-2xl font-bold">
        {t('emptyTable', {
          value: t('campaign'),
        })}
      </p>
    </div>
  );
}
