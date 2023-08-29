import {select} from 'redux-saga/effects';

import {selectAccessToken} from '@forest-feed/redux/selectors';

export function* checkUserAuthState() {
  const accessToken = yield select(selectAccessToken);
  if (!accessToken) throw '';
}
