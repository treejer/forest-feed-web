'use client';

import React from 'react';
import Link from 'next/link';
import {useTranslations} from 'use-intl';
import {usePathname} from 'next-intl/client';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';

const links = [
  {
    href: `/new-campaign`,
    name: 'newCampaign',
  },
  {
    href: `/my-campaigns`,
    name: 'myCampaigns',
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
          <Link className="mb-2 last:mb-0" key={link.href} href={link.href}>
            <Button text={t(link.name)} variant={isActive ? ButtonVariant.menu : ButtonVariant.text} />
          </Link>
        );
      })}
    </div>
  );
}
