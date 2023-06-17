import {SagaStore} from '@forest-feed/redux/store';
import {all} from 'redux-saga/effects';

export function* rootSaga(store: SagaStore) {
  yield all([]);
}
