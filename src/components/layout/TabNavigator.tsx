import React from 'react';

import {usePathname} from 'next/navigation';

import cn from '@forest-feed/utils/tailwind';
import {links} from '@forest-feed/components/layout/Navbar';
import {Link} from '@forest-feed/lib/router-events';
import {Locale} from '@forest-feed/languages';
import {useCurrentLocale} from '@forest-feed/locales/client';

export default function TabNavigator() {
  const pathname = usePathname();
  const locale = useCurrentLocale();

  return (
    <div className={cn('fixed bottom-0 lef-0 right-0 rounded-t-2xl h-16 w-full flex lg:sr-only bg-white shadow-lg')}>
      {links.map(link => {
        const href = locale === Locale.EN ? link.href : `/${locale}${link.href}`;
        const isActive = pathname.startsWith(href);

        return (
          <div key={link.href} className={cn('flex-1 flex items-center justify-center')}>
            <Link
              className={cn('p-2', {
                'text-green': isActive,
                'text-black': !isActive,
              })}
              href={href}
            >
              {link.icon}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
