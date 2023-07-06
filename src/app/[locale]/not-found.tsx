'use client';

import {useTranslations} from 'use-intl';

export default function NotFound() {
  const t = useTranslations('notFound');

  return <div>{t('desc')}</div>;
}
