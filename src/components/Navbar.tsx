'use client';

import React, {useMemo} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLocale, useTranslations} from 'use-intl';

import {Button, ButtonVariant} from './kit/Button';

export function Navbar() {
  const pathname = usePathname();

  const t = useTranslations('navbar');
  const locale = useLocale();

  const links = useMemo(
    () => [
      {
        href: `/${locale}/new-campaign`,
        name: 'newCampaign',
      },
      {
        href: `/${locale}/my-campaigns`,
        name: 'myCampaigns',
      },
    ],
    [locale],
  );

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
