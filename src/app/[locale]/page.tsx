'use client';

import {useTranslations} from 'use-intl';

export default function Home() {
  const t = useTranslations();
  return <div>{t('hello')}</div>;
}
