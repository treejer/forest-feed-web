import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {signMessage, switchNetwork as switchNetworkWeb3, watchAccount, watchNetwork, disconnect} from '@wagmi/core';

import {config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig, selectWeb3} from '@forest-feed/redux/selectors';
import {
  Web3State,
  Web3Action,
  startConfiguration,
  switchNetwork,
  updateNetwork,
  watchCurrentWeb3,
  notSupportedNetwork,
  cancelSwitchNetwork,
  connectedWallet,
  setAccessToken,
  checkAccount,
  loginAccount,
  logoutAccount,
} from '@forest-feed/redux/module/web3/web3.slice';
import {AppStore} from '@forest-feed/redux/store';
import {nonceActions, nonceActionTypes} from '@forest-feed/redux/module/nonce/nonce';
import {signActions, signActionTypes} from '@forest-feed/redux/module/sign/sign';
import {profileActions} from '@forest-feed/redux/module/profile/profile';
import {handleSagaFetchError} from '@forest-feed/utils/fetch';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork, userInApp, onSuccess} = payload || {};
    console.log(newNetwork, 'newNetwork');
    let config: NetworkConfig = yield select(selectConfig);
    if (newNetwork) {
      if (config.chainId !== newNetwork && userInApp) {
        yield switchNetworkWeb3({
          chainId: configs[newNetwork].chainId,
        });
      }
      config = configs[newNetwork];
      yield onSuccess?.();
    }
    yield put(updateNetwork({newConfig: config}));
  } catch (e: any) {
    console.log(e, 'error is start configuration');
    yield put(cancelSwitchNetwork());
  }
}

export function* watchSwitchNetwork({payload}: PayloadAction<Web3Action['switchNetwork']>) {
  try {
    const {newNetwork, userInApp, onSuccess} = payload;
    yield put(startConfiguration({newNetwork, userInApp, onSuccess}));
  } catch (e: any) {
    console.log(e, 'error in switch network');
  }
}

export function* watchLoginAccount() {
  try {
    yield put(nonceActions.load());
    const {payload: nonce} = yield take(nonceActionTypes.loadSuccess);
    const signature = yield signMessage({message: nonce.message});
    yield put(signActions.load({signature}));
    const {payload: sign} = yield take(signActionTypes.loadSuccess);
    yield put(setAccessToken({token: sign.access_token}));
    yield put(profileActions.load());
  } catch (e: any) {
    console.log(e, 'error in login account');
    yield handleSagaFetchError(e);
    yield;
    yield disconnect();
  }
}

export function* watchLogoutAccount() {
  try {
    yield put(nonceActions.resetCache());
    yield put(signActions.resetCache());
    yield put(profileActions.resetCache());
    yield put(setAccessToken({token: ''}));
  } catch (e: any) {
    console.log(e, 'error in logout account');
  }
}

export function* watchCheckAccount({payload}: PayloadAction<Web3Action['checkAccount']>) {
  try {
    const {account} = payload || {};
    const {address, accessToken}: Web3State = yield select(selectWeb3);
    if (!accessToken || address !== account.address) {
      yield put(logoutAccount());
    }
    yield put(connectedWallet({address: account.address}));
  } catch (e: any) {
    console.log(e, 'error in check account');
  }
}

export function* watchWatchWeb3(store: AppStore) {
  try {
    watchAccount(account => {
      store.dispatch(checkAccount({account}));
    });
    watchNetwork(async network => {
      if (typeof network.chain?.unsupported !== 'undefined' && network.chain?.unsupported) {
        store.dispatch(notSupportedNetwork());
      } else {
        if (network.chain?.id) {
          store.dispatch(switchNetwork({newNetwork: network?.chain?.id}));
          store.dispatch(logoutAccount());
        }
      }
    });
  } catch (e: any) {
    console.log(e, 'error in watch network');
  }
}

export function* web3Sagas(store: AppStore) {
  yield takeEvery(startConfiguration.type, watchStartConfiguration);
  yield takeEvery(switchNetwork.type, watchSwitchNetwork);
  yield takeEvery(checkAccount.type, watchCheckAccount);
  yield takeEvery(loginAccount.type, watchLoginAccount);
  yield takeEvery(logoutAccount.type, watchLogoutAccount);
  yield takeEvery(watchCurrentWeb3.type, watchWatchWeb3, store);
}
