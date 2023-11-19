import {put, select, takeEvery} from 'redux-saga/effects';
import {fetchBalance, FetchBalanceResult, getAccount} from '@wagmi/core';

import {NetworkConfig} from '@forest-feed/config';
import {checkBalance, updateBalance} from '@forest-feed/redux/module/tokens/tokens.slice';
import {selectDaiTokenContract} from '@forest-feed/redux/selectors';

function* watchCheckBalance() {
  try {
    const {address: daiAddress}: NetworkConfig['contracts']['DAI'] = yield select(selectDaiTokenContract);
    const {address} = yield getAccount();
    const dai: FetchBalanceResult = yield fetchBalance({
      address,
      token: daiAddress,
    });
    yield put(updateBalance({DAI: +dai.formatted}));
  } catch (e: any) {
    console.log(e, 'error in watch check balance');
  }
}

export default function* tokensSagas() {
  yield takeEvery(checkBalance.type, watchCheckBalance);
}
