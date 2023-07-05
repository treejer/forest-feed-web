import React from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

import {languages} from '@forest-feed/languages';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';

export function ChangeLanguage() {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {languages.map(language => {
        const arrayPathname = pathname?.split('/');
        const isActive = arrayPathname.includes(language.locale);
        const currentPath = arrayPathname?.slice(2)?.join('/');

        return (
          <Link
            key={language.locale}
            className="w-12 rounded-none first:rounded-l-[8px] last:rounded-r-[8px] overflow-hidden"
            href={`/${language.locale}/${currentPath || ''}`}
          >
            <Button
              className={`w-full rounded-none ${isActive ? 'bg-primaryGreen text-white' : ''}`}
              text={language.locale}
              variant={ButtonVariant.menu}
            />
          </Link>
        );
      })}
    </div>
  );
}
