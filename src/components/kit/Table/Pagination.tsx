import React, {useMemo} from 'react';

import {ChevronIcon, ChevronIconDirection} from '@forest-feed/components/kit/Icons/ChevronIcon';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {paginationPageSize} from '@forest-feed/config';
import {cn} from '@forest-feed/utils/tailwind';

export type PaginationProps = {
  count?: number;
  currentPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onLoadPage?: (page: number) => void;
  hideNext?: boolean;
  disabled?: boolean;
  hidePrev?: boolean;
  siblingCount?: number;
};

export const DOTS = '...';
function range(start: number, end: number) {
  let length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({length}, (_, idx) => idx + start);
}

export function Pagination(props: PaginationProps) {
  const {count, currentPage, disabled, hidePrev, siblingCount = 1, onPrevPage, onNextPage, onLoadPage} = props;

  const paginationRange = useMemo(() => {
    if (!count) return null;
    const totalPageCount = Math.ceil(count / paginationPageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [count, siblingCount, currentPage]);

  const itemClassName =
    'border rounded-full w-[32px] h-[32px] md:w-[36px] md:h-[36px] border-border flex items-center justify-center mx-2 first:ml-0 last:mr-0 text-sm md:text-lg';

  return (
    <div className={cn('flex items-end justify-end mt-5')}>
      <RenderIf condition={!hidePrev}>
        <RenderIf condition={currentPage !== 1}>
          <button className={cn(itemClassName)} onClick={onPrevPage} disabled={disabled}>
            <ChevronIcon direction={ChevronIconDirection.left} />
          </button>
        </RenderIf>
      </RenderIf>
      {count && paginationRange && onLoadPage ? (
        paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <span key={`${pageNumber}-${index}-dots`}>&#8230;</span>;
          }

          return (
            <button
              className={cn(itemClassName, {
                'bg-green/70 text-white disabled:opacity-100': pageNumber === currentPage,
                'disabled:opacity-50': pageNumber !== currentPage,
              })}
              key={`${pageNumber}-${index}-page`}
              onClick={() => onLoadPage(+pageNumber)}
              disabled={disabled || pageNumber === currentPage}
            >
              {pageNumber}
            </button>
          );
        })
      ) : (
        <div className={itemClassName}>{currentPage}</div>
      )}
      <RenderIf condition={!count ? true : currentPage !== Math.ceil(count / paginationPageSize)}>
        <button disabled={disabled} className={cn(itemClassName)} onClick={onNextPage}>
          <ChevronIcon direction={ChevronIconDirection.right} />
        </button>
      </RenderIf>
    </div>
  );
}
