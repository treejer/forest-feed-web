import {all} from 'redux-saga/effects';

import {SagaStore} from '@forest-feed/redux/store';
import {initSagas} from '@forest-feed/redux/module/init/init.saga';
import {web3Sagas} from '@forest-feed/redux/module/web3/web3.saga';
import {nonceSagas} from '@forest-feed/redux/module/nonce/nonce';
import {signSagas} from '@forest-feed/redux/module/sign/sign';
import {profileSagas} from '@forest-feed/redux/module/profile/profile';
import {paginationSagas} from '@forest-feed/redux/module/pagination/pagination.saga';
import {myCampaignsSagas} from '@forest-feed/redux/module/campaign/myCampaigns';
import {createCampaignSagas} from '@forest-feed/redux/module/campaign/createCampaign';
import {tokensSagas} from '@forest-feed/redux/module/tokens/tokens.saga';
import {campaignJourneySagas} from '@forest-feed/redux/module/campaignJourney/campaignJourney.saga';

export function* rootSaga(store: SagaStore) {
  yield all([
    initSagas(),
    web3Sagas(store),
    nonceSagas(),
    signSagas(),
    profileSagas(),
    paginationSagas(),
    myCampaignsSagas(),
    createCampaignSagas(),
    tokensSagas(),
    campaignJourneySagas(),
  ]);
}
