import {all} from 'redux-saga/effects';

import {SagaStore} from '@forest-feed/redux/store';
import {jsonPlaceholderSagas} from '@forest-feed/redux/module/jsonPlaceholder/jsonPlaceholder';
import {initSagas} from '@forest-feed/redux/module/init/init.saga';
import {web3Sagas} from '@forest-feed/redux/module/web3/web3.saga';
import {nonceSagas} from '@forest-feed/redux/module/nonce/nonce';
import {signSagas} from '@forest-feed/redux/module/sign/sign';
import {profileSagas} from '@forest-feed/redux/module/profile/profile';
import {paginationSagas} from '@forest-feed/redux/module/pagination/pagination.saga';

export function* rootSaga(store: SagaStore) {
  yield all([
    initSagas(),
    jsonPlaceholderSagas(),
    web3Sagas(store),
    nonceSagas(),
    signSagas(),
    profileSagas(),
    paginationSagas,
  ]);
}
