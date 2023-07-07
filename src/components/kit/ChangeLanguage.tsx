import React, {useCallback, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {usePathname} from 'next-intl/client';
import {useLocale} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {languages} from '@forest-feed/languages';

export function ChangeLanguage() {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLanguage = useCallback(
    (locale: string) => {
      startTransition(() => {
        router.replace(`/${locale}${pathname}`);
      });
    },
    [pathname, router],
  );

  return (
    <div className="flex items-center">
      {languages.map(language => {
        return (
          <Button
            key={language.locale}
            className={`rounded-none first:rounded-l-[8px] last:rounded-r-[8px] w-[48px] ${
              locale === language.locale ? 'bg-primaryGreen text-white' : ''
            }`}
            disabled={isPending}
            text={language.locale}
            variant={ButtonVariant.menu}
            onClick={() => handleChangeLanguage(language.locale)}
          />
        );
      })}
    </div>
  );
}
