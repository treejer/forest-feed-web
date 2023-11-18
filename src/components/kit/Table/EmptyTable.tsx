import React from 'react';

import cn from '@forest-feed/utils/tailwind';
import {useI18n} from '@forest-feed/locales/client';

export default function EmptyTable() {
  const t = useI18n();

  return (
    <div className={cn('flex justify-center items-center h-full')}>
      <p className={cn('text-green text-2xl font-bold')}>
        {t('emptyTable', {
          value: t('campaign'),
        })}
      </p>
    </div>
  );
}
