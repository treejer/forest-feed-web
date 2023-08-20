import {combineReducers} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';

import {jsonPlaceholderReducer} from '@forest-feed/redux/module/jsonPlaceholder/jsonPlaceholder';
import campaignJourneyReducer from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import web3Reducer from '@forest-feed/redux/module/web3/web3.slice';
import initReducer from '@forest-feed/redux/module/init/init.slice';
import appInfoReducer from '@forest-feed/redux/module/appInfo/appInfo.slice';
import {nonceReducer} from '@forest-feed/redux/module/nonce/nonce';
import {signReducer} from '@forest-feed/redux/module/sign/sign';
import {profileReducer} from '@forest-feed/redux/module/profile/profile';

export const combinedReducers = combineReducers({
  init: initReducer,
  campaignJourney: campaignJourneyReducer,
  web3: web3Reducer,
  nonce: nonceReducer,
  sign: signReducer,
  appInfo: appInfoReducer,
  profile: profileReducer,
  jsonPlaceholderReducer,
});

export const reducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    return {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
  } else {
    return combinedReducers(state, action);
  }
};
