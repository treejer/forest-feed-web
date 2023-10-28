'use client';

import {useCallback} from 'react';

import Image from 'next/image';

import {useI18n} from '@forest-feed/locales/client';
import {NotFoundSvg} from 'public/assets/images';
import {useRouter} from '@forest-feed/lib/router-events';

export default function NotFound() {
  const t = useI18n();

  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex justify-center items-center flex-col">
      <Image src={NotFoundSvg} alt="404" width={500} height={300} />
      <h2 className="text-2xl mb-10">{t('notFound.title')}</h2>
      <button className="text-sm text-green underline" onClick={handleBack}>
        {t('notFound.backToApp')}
      </button>
    </div>
  );
}
