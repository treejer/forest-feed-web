import React from 'react';
import {Table, TableProps} from '@forest-feed/components/kit/Table/Table';

export type TableWrapperProps<T extends object> = TableProps<T> & {
  data: T[] | null | undefined;
  loading?: boolean;
};
export function TableWrapper<T extends object>(props: TableWrapperProps<T>) {
  const {loading, data, ...restProps} = props;

  if (loading || !data) {
    return <p>loading is here</p>;
  }

  if (!data?.length) {
    return <div>there is no data</div>;
  }

  return <Table<T> data={data} {...restProps} />;
}
