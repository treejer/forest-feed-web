'use client';

import React from 'react';
import {Button, ButtonVariant} from '../kit/Button';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export const links = [
  {
    href: '/new-campaign',
    title: 'NEW CAMPAIGN',
  },
  {
    href: '/my-campaigns',
    title: 'MY CAMPAIGN',
  },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <div>
      {links.map(link => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link className="mb-2 last:mb-0" key={link.href} href={link.href}>
            <Button text={link.title} variant={isActive ? ButtonVariant.menu : ButtonVariant.text} />
          </Link>
        );
      })}
    </div>
  );
}
