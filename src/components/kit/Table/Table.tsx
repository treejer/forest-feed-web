import React, {memo, useMemo} from 'react';

import {TableOptions, useSortBy, useTable} from 'react-table';

import ChevronIcon, {ChevronIconDirection} from '@forest-feed/components/kit/Icons/ChevronIcon';
import Spacer from '@forest-feed/components/common/Spacer';
import Pagination from '@forest-feed/components/kit/Table/Pagination';
import cn from '@forest-feed/utils/tailwind';

export type TableProps<D extends object> = {
  columns: TableOptions<D>['columns'];
  data: D[] | null | undefined;
  initialState?: TableOptions<D>['initialState'];
  pagination?: {
    count?: number;
    loadNextPrevPage: (count: number) => void;
    loadPage?: (page: number) => void;
    page: number;
    loading: boolean;
    refetching?: boolean;
  };
};

function TableComponent<D extends object>(props: TableProps<D>) {
  const {columns: originalColumns, data: originalData, initialState, pagination} = props;

  const columns = useMemo(() => originalColumns, [originalColumns]);
  const data = useMemo(() => originalData, [originalData]);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data: data?.length ? data : [],
      initialState,
    },
    useSortBy,
  );

  return (
    <div className={cn('h-full flex flex-col lg:justify-between')}>
      <div className={cn('w-full border border-tableBorder rounded-[12px] overflow-x-auto')}>
        <table {...getTableProps()} className={cn('w-full')}>
          <thead>
            {headerGroups.map(headerGroup => {
              const {key, ...props} = headerGroup.getHeaderGroupProps();
              return (
                <tr {...props} key={key} className={cn('border-b border-tableBorder bg-khakiDark')}>
                  {headerGroup.headers.map(column => {
                    const {key, ...props} = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th {...props} key={key} className={cn('py-2 px-3 font-normal text-sm')}>
                        <div className={cn('flex justify-center items-center')}>
                          {column.render('Header') as React.ReactNode}
                          {column.isSorted ? (
                            <span className={cn('flex items-center')}>
                              <Spacer />
                              <ChevronIcon
                                direction={column.isSortedDesc ? ChevronIconDirection.up : ChevronIconDirection.down}
                              />
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              const {key, ...props} = row.getRowProps();
              return (
                <tr {...props} key={key} className={cn('border-b last:border-none border-tableBorder flex-1')}>
                  {row.cells.map(cell => {
                    const {key, ...props} = cell.getCellProps();
                    return (
                      <td {...props} key={key} className={cn('py-2 md:py-5 px-3 text-center text-xs md:text-sm')}>
                        <div className={cn('flex justify-center')}>{cell.render('Cell') as React.ReactNode}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <Pagination
          count={pagination.count}
          currentPage={pagination.page}
          onNextPage={() => pagination.loadNextPrevPage(+1)}
          onPrevPage={() => pagination.loadNextPrevPage(-1)}
          onLoadPage={(page: number) => pagination?.loadPage?.(page)}
          disabled={pagination.loading || pagination.refetching}
        />
      ) : null}
    </div>
  );
}

export default memo(TableComponent) as typeof TableComponent;
