import React from 'react';

import {useI18n} from '@forest-feed/locales/client';

export function EmptyTable() {
  const t = useI18n();

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
