import React from 'react';
import DataTable, {TableStyles} from 'react-data-table-component';

import {Pagination} from '@forest-feed/components/kit/Table/Pagination';

export const defaultStyles: TableStyles = {
  headRow: {
    style: {
      backgroundColor: '#E5E7DB',
    },
  },
  table: {
    style: {
      border: '1px solid #BDBDBD',
      borderRadius: '10px',
      overflow: 'hidden',
    },
  },
};

export type TColumn<T> = {
  name: string;
  selector: (row: T) => string;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
};

export type TableProps<T> = {
  columns: TColumn<T>[];
  data: T[];
};

export function Table<T>(props: TableProps<T>) {
  const {columns, data} = props;

  return (
    //@ts-ignore TODO
    <DataTable columns={columns} data={data} customStyles={defaultStyles} pagination paginationComponent={Pagination} />
  );
}
