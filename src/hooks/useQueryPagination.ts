import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';

import {OperationVariables, useQuery} from '@apollo/client';
import {paginationPageSize} from '@forest-feed/config';

export default function useQueryPagination<TQueryData, TVariables extends OperationVariables, TPersistedData>(
  Query: any,
  variables: TVariables,
  dataKey: string,
  storageKey: string,
  keepData?: boolean,
  manualPerPage?: number,
) {
  const [page, setPage] = useState(0);
  const [refetching, setRefetching] = useState(false);

  const [persistedData, setPersistedData] = usePersistedData<TPersistedData>(storageKey);

  const perPage = useMemo(() => manualPerPage || paginationPageSize, [manualPerPage]);

  const paginationProps = useCallback(
    (newPage: number) => ({
      first: perPage,
      skip: newPage * perPage,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }),
    [perPage],
  );

  const query = useQuery<TQueryData, TVariables>(Query, {
    variables: {
      ...variables,
      ...paginationProps(page),
    },
    skip: !variables,
  });

  useEffect(() => {
    (async function () {
      if (query.data?.[dataKey] !== undefined) {
        if (keepData && page !== 0) {
          if (query.data?.[dataKey]?.length > 0) {
            setPersistedData([...(persistedData || []), ...query.data[dataKey]]);
          }
        } else {
          setPersistedData(query.data[dataKey]);
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify(query.data?.[dataKey]));
        } catch (e) {
          console.log(e, 'Error inside ===> usePagination set');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, query.data]);

  const refetchData = useCallback(
    async (newVariables?: TVariables, silent?: boolean) => {
      setPage(0);
      setRefetching(!silent);
      await query.refetch({
        ...(newVariables || variables),
        ...paginationProps(0),
      });
      setRefetching(false);
    },
    [variables, query, setPage, paginationProps],
  );

  const loadNextPrevPage = useCallback(
    async (page: 1 | -1) => {
      const newPage = page + 1;
      try {
        await query.fetchMore({
          variables: {
            ...variables,
            ...paginationProps(newPage),
          },
        });
        setPage(newPage);
      } catch (e) {
        console.log(e, 'e is here nextPage');
      }
    },
    [variables, paginationProps, query],
  );

  const loadPage = useCallback(
    async (page: number) => {
      try {
        await query.fetchMore({
          variables: {
            ...variables,
            ...paginationProps(page),
          },
        });
        setPage(page);
      } catch (e) {
        console.log(e, 'e is here nextPage');
      }
    },
    [variables, paginationProps, query],
  );

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  return {
    persistedData,
    query,
    loading: query.loading,
    refetchData,
    refetching,
    loadNextPrevPage,
    loadPage,
    resetPagination,
    page,
  };
}

export function usePersistedData<TData>(
  storageKey: string,
): [TData[] | null, Dispatch<SetStateAction<TData[] | null>>] {
  const [data, setData] = useState<TData[] | null>(null);

  useEffect(() => {
    (async function () {
      try {
        let storedData = localStorage.getItem(storageKey);
        if (storedData) {
          const _storedData = JSON.parse(storedData);
          setData(_storedData);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> usePersistedData get');
      }
    })();
  }, []);

  return [data, setData];
}
