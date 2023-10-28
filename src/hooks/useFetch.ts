import {useEffect, useMemo, useState} from 'react';

import ReduxFetchState from 'redux-fetch-state';
import {AxiosRequestConfig} from 'axios';

import {fetch, handleFetchError} from '@forest-feed/utils/fetch';
import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {useAccessToken} from '@forest-feed/redux/module/web3/web3.slice';

type UseFetchOptions = {
  didMount?: boolean;
  isSilent?: boolean;
  form?: any;
  showErrorAlert?: boolean;
  beforeFetch?: Function;
  beforeSuccess?: Function;
  afterSuccess?: Function;
  beforeFailure?: Function;
  afterFailure?: Function;
  afterFetch?: Function;
  afterDidMount?: Function;
  fetchOptions?: AxiosRequestConfig & {
    headers?: {
      [key: string]: string;
    };
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    params?: Object;
  };
};

export interface UseHttpState<Data> {
  loading: boolean;
  loaded: boolean;
  data: Data;
  error: any;
}

export function useFetch<Data>(
  url: string,
  options: UseFetchOptions = {},
): [UseHttpState<Data>, (options?: UseFetchOptions) => Promise<any>, () => void] {
  const token = useAccessToken();
  const {actions, reducer} = useMemo(() => new ReduxFetchState(url), [url]);

  const initialState = useMemo(() => reducer(undefined, {type: ''}), [reducer]);
  const [state, setState] = useState(initialState);

  const makeApiCall = async (methodOptions: UseFetchOptions = options) => {
    let {
      isSilent = false,
      form,
      showErrorAlert = true,
      afterFailure,
      afterSuccess,
      beforeFailure,
      beforeFetch,
      beforeSuccess,
      afterFetch,
      fetchOptions = {},
    } = methodOptions;

    if (beforeFetch) {
      await beforeFetch();
    }
    setState(reducer(state, actions.load(form, isSilent)));
    try {
      if (token) {
        fetchOptions = {
          ...fetchOptions,
          //@ts-ignore
          headers: {
            Authorization: `Bearer ${token}`,
            ...(fetchOptions?.headers || {}),
          },
        };
      }

      const data = await fetch<Data>(url, {
        data: form,
        ...fetchOptions,
      });
      await beforeSuccess?.(data);
      setState(reducer(state, actions.loadSuccess(data)));
      await afterSuccess?.(data);
    } catch (e: any) {
      const {message, status} = handleFetchError(e);

      await beforeFailure?.(e);
      setState(reducer(state, actions.loadFailure(message)));
      // if (showErrorAlert && message) {
      //   showAlert({
      //     message,
      //     mode: AlertMode.Failure,
      //     title: 'errors.error',
      //   });
      // }
      if (showErrorAlert && message && message?.length) {
        showToast({
          title: status ? `errors.${status}` : undefined,
          message: Array.isArray(message) ? message[0] : message,
          type: ToastType.error,
          translate: true,
        });
      }
      await afterFailure?.(e);
    }
    await afterFetch?.();
  };

  useEffect(() => {
    const {didMount = true, afterDidMount} = options;
    if (didMount) {
      makeApiCall(options).then(r => {
        afterDidMount?.(r);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetState = () => {
    setState(initialState);
  };

  return [state, makeApiCall, resetState];
}
