'use client';

import React from 'react';
import {Link} from '@forest-feed/lib/router-events';
import {useTranslations} from 'use-intl';
import {usePathname} from 'next-intl/client';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {TableCellsIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from '@heroicons/react/24/solid';

export const links = [
  {
    href: `/new-campaign`,
    name: 'newCampaign',
    icon: <PlusIcon className="w-8 h-8" />,
  },
  {
    href: `/my-campaigns`,
    name: 'myCampaigns',
    icon: <TableCellsIcon className="w-8 h-8" />,
  },
];

export function Navbar() {
  const pathname = usePathname();

  const t = useTranslations('navbar');

  return (
    <div>
      {links.map(link => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link className="block mb-2 last:mb-0" key={link.href} href={link.href}>
            <Button text={t(link.name)} variant={isActive ? ButtonVariant.menu : ButtonVariant.text} />
          </Link>
        );
      })}
    </div>
  );
}
