import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {
  getAccount,
  getNetwork,
  signMessage,
  switchNetwork as switchNetworkWeb3,
  watchAccount,
  watchNetwork,
} from '@wagmi/core';
import {Profile} from '@lens-protocol/react-web';

import {config as configs, defaultChainId, NetworkConfig, storageKeys} from '@forest-feed/config';
import {selectConfig, selectLensProfile, selectWeb3} from '@forest-feed/redux/selectors';
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
import {resetCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {resetTokens} from '@forest-feed/redux/module/tokens/tokens.slice';
import {reactQueryClient} from '@forest-feed/components/providers/AllTheProviders';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork, userInApp, onSuccess} = payload || {};
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
  const {newNetwork, userInApp, onSuccess, lensLogout, inInit} = payload || {};
  const lensProfile: Profile = yield select(selectLensProfile);
  try {
    if (!userInApp && lensProfile && !inInit) {
      yield lensLogout?.(true);
    }
    yield put(startConfiguration({newNetwork, userInApp, onSuccess}));
  } catch (e: any) {
    console.log(e, 'error in switch network');
  }
}

export function* watchLoginAccount() {
  try {
    yield put(resetCampaignJourney(true));
    yield reactQueryClient.invalidateQueries();
    reactQueryClient.removeQueries();
    reactQueryClient.clear();
    for (let key in storageKeys) {
      window.localStorage.removeItem(storageKeys[key]);
    }
    yield put(nonceActions.load());
    const {payload: nonce} = yield take(nonceActionTypes.loadSuccess);
    if (!nonce.message) return;
    const signature = yield signMessage({message: nonce.message});
    yield put(signActions.load({signature}));
    const {payload: sign} = yield take(signActionTypes.loadSuccess);
    yield put(setAccessToken({token: sign.access_token}));
    yield put(profileActions.load());
  } catch (e: any) {
    console.log(e, 'error in login account');
    yield put(setAccessToken({token: ''}));
    yield handleSagaFetchError(e);
  }
}

export function* watchLogoutAccount() {
  try {
    yield put(setAccessToken({token: ''}));
    yield put(nonceActions.resetCache());
    yield put(signActions.resetCache());
    yield put(profileActions.resetCache());
    yield put(resetCampaignJourney(true));
    yield put(resetTokens());
    yield reactQueryClient.invalidateQueries();
    reactQueryClient.removeQueries();
    reactQueryClient.clear();
    for (let key in storageKeys) {
      window.localStorage.removeItem(storageKeys[key]);
    }
  } catch (e: any) {
    console.log(e, 'error in logout account');
  }
}

export function* watchCheckAccount({payload}: PayloadAction<Web3Action['checkAccount']>) {
  const {account, lensLogout} = payload || {};
  const {address, accessToken}: Web3State = yield select(selectWeb3);
  const lensProfile: Profile = yield select(selectLensProfile);
  try {
    if (!accessToken || address?.toLowerCase() !== account?.address?.toLowerCase()) {
      if (lensProfile) yield lensLogout(true);
      yield put(logoutAccount());
    }
    yield put(connectedWallet({address: account.address}));
  } catch (e: any) {
    console.log(e, 'error in check account');
  }
}

export function* watchWatchWeb3(store: AppStore, {payload}: PayloadAction<Web3Action['watchCurrentWeb3']>) {
  try {
    const {lensLogout} = payload || {};
    const config = yield select(selectConfig);
    const account = yield getAccount();
    const network = yield getNetwork();
    yield put(checkAccount({account, lensLogout}));
    if (typeof network.chain?.unsupported !== 'undefined' && network.chain?.unsupported) {
      yield put(notSupportedNetwork());
      yield put(updateNetwork({newConfig: config}));
    } else {
      yield put(switchNetwork({newNetwork: network?.chain?.id || defaultChainId, lensLogout, inInit: true}));
    }
    watchAccount(account => {
      store.dispatch(checkAccount({account, lensLogout}));
    });
    watchNetwork(async network => {
      if (typeof network.chain?.unsupported !== 'undefined' && network.chain?.unsupported) {
        store.dispatch(notSupportedNetwork());
      } else {
        if (network.chain?.id) {
          store.dispatch(switchNetwork({newNetwork: network?.chain?.id, lensLogout}));
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
