import {all} from 'redux-saga/effects';

import {SagaStore} from '@forest-feed/redux/store';
import {jsonPlaceholderSagas} from '@forest-feed/redux/module/jsonPlaceholder/jsonPlaceholder';

export function* rootSaga(store: SagaStore) {
  yield all([jsonPlaceholderSagas()]);
}
