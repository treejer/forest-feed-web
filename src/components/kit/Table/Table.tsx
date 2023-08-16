import React, {useMemo} from 'react';

import {TableOptions, useSortBy, useTable} from 'react-table';
import {ChevronIcon, ChevronIconDirection} from '@forest-feed/components/kit/Icons/ChevronIcon';
import {Spacer} from '@forest-feed/components/common/Spacer';

export type TableProps<D extends object> = {
  columns: TableOptions<D>['columns'];
  data: D[];
};

export function Table<D extends object>(props: TableProps<D>) {
  const {columns: originalColumns, data: originalData} = props;

  const columns = useMemo(() => originalColumns, [originalColumns]);
  const data = useMemo(() => originalData, [originalData]);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'createdAt',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
  );

  return (
    <div className="w-full border border-tableBorder rounded-[12px] overflow-hidden">
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id}
              className="border-b border-tableBorder bg-khakiDark"
            >
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  className="py-2 px-3 font-normal text-sm"
                >
                  <div className="flex justify-center items-center">
                    {column.render('Header')}
                    {column.isSorted ? (
                      <span className="flex items-center">
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} className="border-b last:border-none  border-tableBorder flex-1">
                {row.cells.map((cell, index) => (
                  <td {...cell.getCellProps()} key={cell.value} className="py-5 px-3 text-center text-sm">
                    <div className="flex justify-center">{cell.render('Cell')}</div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
