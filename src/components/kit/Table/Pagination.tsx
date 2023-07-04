'use client';

import React from 'react';

import {ChevronIcon, ChevronIconDirection} from '../Icons/ChevronIcon';

export type PaginationProps = {
  count: number;
  currentPage: number;
  hideNext?: boolean;
  disabled?: boolean;
  hidePrev?: boolean;
};

export function Pagination(props: PaginationProps) {
  const {count, currentPage, hideNext, hidePrev} = props;

  const itemClassName =
    'border rounded-full w-[36px] h-[36px] border-border flex items-center justify-center mx-2 first:ml-0 last:mr-0';

  return (
    <div className="flex items-end justify-end mt-5">
      {currentPage !== 1 || !hidePrev ? (
        <div className={itemClassName}>
          <ChevronIcon direction={ChevronIconDirection.left} />
        </div>
      ) : null}

      {Array(count)
        .fill('')
        .map((page, index) => (
          <div className={itemClassName}>{index + 1}</div>
        ))}
      {currentPage !== count || !hideNext ? (
        <div className={itemClassName}>
          <ChevronIcon direction={ChevronIconDirection.right} />
        </div>
      ) : null}
    </div>
  );
}
