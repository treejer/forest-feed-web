'use client';

import {useTranslations} from 'use-intl';

export default function LocalePage() {
  const t = useTranslations();
  return <div>{t('hello')}</div>;
}
