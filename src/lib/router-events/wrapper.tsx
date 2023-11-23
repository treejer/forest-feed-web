'use client';

import {Suspense, useEffect} from 'react';

import {usePathname, useSearchParams} from 'next/navigation';
import {onComplete} from './events';

function HandleOnCompleteChild() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => onComplete(), [pathname, searchParams]);
  return null;
}

export default function HandleOnComplete() {
  return (
    <Suspense>
      <HandleOnCompleteChild />
    </Suspense>
  );
}
