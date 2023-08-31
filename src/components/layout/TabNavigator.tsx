import React from 'react';

import {usePathname} from 'next-intl/client';

import {links} from '@forest-feed/components/layout/Navbar';
import {Link} from '@forest-feed/lib/router-events';

export function TabNavigator() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 lef-0 right-0 rounded-t-2xl h-16 w-full flex md:sr-only bg-white shadow-lg">
      {links.map(link => {
        const isActive = pathname.startsWith(link.href);

        return (
          <div key={link.href} className="flex-1 flex items-center justify-center">
            <Link className={`p-2 ${isActive ? 'text-green' : 'text-black'}`} href={link.href}>
              {link.icon}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
