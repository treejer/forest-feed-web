import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {call, select} from 'redux-saga/effects';

import {showSagaToast, ToastType} from '@forest-feed/utils/showToast';
import {debugFetch, NetworkConfig} from '@forest-feed/config';
import {selectAccessToken, selectConfig} from '@forest-feed/redux/selectors';

export type FetchResult<Data> = {
  result: Data;
  status: number;
};

export function fetch<Data, Form = any>(
  url: string,
  options: AxiosRequestConfig<Form> = {},
): Promise<FetchResult<Data>> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios(url, {...options, timeout: 10000});
      if (debugFetch) {
        console.log(url, res.data, 'res is here', res.status);
      }
      if (res.status) {
        if (res.status.toString().split('')[0] === '2') {
          return resolve({
            result: res.data.data,
            status: res.status,
          });
        } else {
          return reject(res);
        }
      } else {
        return reject({
          message: 'errors.INTERNET',
          translate: true,
        });
      }
    } catch (e: any) {
      if (debugFetch) {
        console.log(JSON.parse(JSON.stringify(e)), e, 'error inside fetch');
      }
      reject(e);
    }
  });
}

export type SagaFetchOptions = {
  baseUrl?: string;
};

export function* sagaFetch<Data, Form = any>(url: string, options: SagaFetchOptions & AxiosRequestConfig<Form> = {}) {
  const {forestFeedApiUrl}: NetworkConfig = yield select(selectConfig);
  const accessToken = yield select(selectAccessToken);

  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    };
  }

  // TODO: read from config
  const requestUrl = (options.baseUrl ? options.baseUrl : forestFeedApiUrl) + url;

  return yield call(fetch, requestUrl, options);
}

type ClientError = {
  status?: number;
  message?: string;
};

export const handleFetchError = (e: AxiosError<ClientError>): ClientError => {
  const {message, response} = e;
  const {status, data} = response || {};

  const _message = data?.message ?? message;

  return {
    status,
    message: _message,
  };
};

export type HandleSagaFetchErrorOptions = {
  showToastError?: boolean;
  logoutUnauthorized?: boolean;
};

export function* handleSagaFetchError(e: AxiosError<ClientError>, options: HandleSagaFetchErrorOptions = {}) {
  const {showToastError = true, logoutUnauthorized = true} = options;
  const {message, status} = handleFetchError(e);

  if ((status === 401 || status === 403) && logoutUnauthorized) {
    // TODO: @logout
    // yield put(logoutAccount());
  }
  if (showToastError && message && message?.length) {
    yield showSagaToast({
      title: status ? `errors.${status}` : undefined,
      message: Array.isArray(message) ? message[0] : message,
      type: ToastType.error,
      translate: true,
    });
  }
}
