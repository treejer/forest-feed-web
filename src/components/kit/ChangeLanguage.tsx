import React, {useCallback, useTransition} from 'react';

import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import {languages, Locale} from '@forest-feed/languages';
import {useChangeLocale, useCurrentLocale} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';

export default function ChangeLanguage() {
  const [isPending, startTransition] = useTransition();

  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  const handleChangeLanguage = useCallback(
    (locale: Locale) => {
      startTransition(() => {
        changeLocale(locale);
      });
    },
    [changeLocale],
  );

  return (
    <div className={cn('flex items-center')}>
      {languages.map(language => {
        return (
          <Button
            key={language.locale}
            className={cn('rounded-none first:rounded-l-[8px] last:rounded-r-[8px] w-[48px]', {
              'bg-primaryGreen text-white': locale === language.locale,
            })}
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
