'use client';

import React from 'react';

import {usePathname} from 'next/navigation';
import {Link} from '@forest-feed/lib/router-events';

import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import {PlusIcon, TableIcon} from '@heroicons/react/solid';
import {useCurrentLocale, useScopedI18n} from '@forest-feed/locales/client';
import {Locale} from '@forest-feed/languages';
import cn from '@forest-feed/utils/tailwind';

export const links = [
  {
    href: `/new-campaign`,
    name: 'newCampaign',
    icon: <PlusIcon className="w-8 h-8" />,
  },
  {
    href: `/my-campaigns`,
    name: 'myCampaigns',
    icon: <TableIcon className="w-8 h-8" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const locale = useCurrentLocale();

  const t = useScopedI18n('navbar');

  return (
    <div>
      {links.map(link => {
        const href = locale === Locale.EN ? link.href : `/${locale}${link.href}`;
        const isActive = pathname.startsWith(href);

        return (
          <Link className={cn('block mb-2 last:mb-0')} key={link.href} href={href}>
            <Button text={t(link.name as any)} variant={isActive ? ButtonVariant.menu : ButtonVariant.text} />
          </Link>
        );
      })}
    </div>
  );
}
