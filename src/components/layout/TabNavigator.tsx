import React from 'react';

import {usePathname} from 'next/navigation';

import {links} from '@forest-feed/components/layout/Navbar';
import {Link} from '@forest-feed/lib/router-events';
import {Locale} from '@forest-feed/languages';
import {useCurrentLocale} from '@forest-feed/locales/client';

export function TabNavigator() {
  const pathname = usePathname();
  const locale = useCurrentLocale();

  return (
    <div className="fixed bottom-0 lef-0 right-0 rounded-t-2xl h-16 w-full flex lg:sr-only bg-white shadow-lg">
      {links.map(link => {
        const href = locale === Locale.EN ? link.href : `/${locale}${link.href}`;
        const isActive = pathname.startsWith(href);

        return (
          <div key={link.href} className="flex-1 flex items-center justify-center">
            <Link className={`p-2 ${isActive ? 'text-green' : 'text-black'}`} href={href}>
              {link.icon}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
