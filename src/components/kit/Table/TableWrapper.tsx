import React from 'react';

import {Table, TableProps} from '@forest-feed/components/kit/Table/Table';
import {EmptyTable} from '@forest-feed/components/kit/Table/EmptyTable';
import {LoadingTable} from '@forest-feed/components/kit/Table/LoadingTable';

export type TableWrapperProps<T extends object> = TableProps<T> & {
  data: T[] | null | undefined;
  loading?: boolean;
};

export function TableWrapper<T extends object>(props: TableWrapperProps<T>) {
  const {loading, data, ...restProps} = props;

  if (loading) {
    return <LoadingTable />;
  }

  if (!loading && data && !data?.length) {
    return <EmptyTable />;
  }

  return <Table<T> data={data} {...restProps} />;
}
