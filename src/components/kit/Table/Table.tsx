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
    },
  },
};

export type TColumn<T> = {
  name: string;
  selector: (row: T) => string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export type TableProps<T> = {
  columns: TColumn<T>[];
  data: T[];
};

export function Table<T>(props: TableProps<T>) {
  const {columns, data} = props;

  return (
    <DataTable columns={columns} data={data} customStyles={defaultStyles} pagination paginationComponent={Pagination} />
  );
}
