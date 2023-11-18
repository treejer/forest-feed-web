import {useCallback, useEffect, useMemo, useState} from 'react';

import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'next/navigation';
import {Method} from 'axios';

import {FetchResult, queryFetch} from '@forest-feed/utils/fetch';
import {paginationPageSize} from '@forest-feed/config';
import {useAccessToken, useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import useForestProfile from '@forest-feed/hooks/useForestProfile';
import {useRouter} from '@forest-feed/lib/router-events';

export type UseQueryFetchParams<Form = any, Params = any> = {
  queryKey: string;
  endpoint: string;
  method?: Method;
  limit?: number;
  data?: Form;
  params?: Params;
};

export type QueryFnParams<Form = any, Params = any> = {
  endpoint: string;
  accessToken: string;
  baseURL: string;
  method: Method;
  page: number;
  limit: number;
  data?: Form;
  params?: Params;
};

export function queryFn<Data, Form = any>({
  endpoint,
  accessToken,
  baseURL,
  method,
  page,
  limit,
  data,
  params,
}: QueryFnParams) {
  return queryFetch<Data, Form>(endpoint, accessToken, {
    baseURL,
    method,
    params: {
      skip: page - 1,
      limit,
      ...params,
    },
    data,
  });
}

export default function useQueryFetch<Data, Form = any, Params = any>(params: UseQueryFetchParams<Form, Params>) {
  const {queryKey, limit = paginationPageSize, endpoint, method = 'get', params: fetchParams, data: fetchData} = params;

  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const urlParamPage = useMemo(() => (searchParams.get('page') ? Number(searchParams.get('page')) : 1), [searchParams]);

  const {profile} = useForestProfile();
  const {forestFeedApiUrl} = useConfig();
  const accessToken = useAccessToken();

  const [page, setPage] = useState(urlParamPage || 1);

  useEffect(() => {
    if (urlParamPage !== page) {
      setPage(urlParamPage);
    }
  }, [urlParamPage]);

  const {data, ...query} = useQuery<FetchResult<Data>>({
    queryKey: [queryKey, page],
    queryFn: () =>
      queryFn<Data, Form>({
        endpoint,
        accessToken,
        baseURL: forestFeedApiUrl,
        method,
        page,
        limit,
        data: fetchData,
        params: fetchParams,
      }),
    keepPreviousData: true,
    enabled: !!accessToken && !!profile?.walletAddress,
  });

  useEffect(() => {
    if (!accessToken) {
      query.remove();
    }
  }, [accessToken]);

  useEffect(() => {
    if (profile?.walletAddress && accessToken) {
      (async () => await query.refetch())();
    }
  }, [profile?.walletAddress]);

  useEffect(() => {
    if (mounted) {
      const href = `/my-campaigns?${page !== 1 ? `page=${page}` : ''}`;
      router.push(href, {
        scroll: false,
      });
    }

    setMounted(true);
  }, [page]);

  const handleSetPage = useCallback((page: number) => {
    setPage(page);
  }, []);

  const handleNextPrevPage = useCallback((count: number) => {
    setPage(prevState => prevState + count);
  }, []);

  return {
    data,
    page,
    ...query,
    handleSetPage,
    handleNextPrevPage,
  };
}
