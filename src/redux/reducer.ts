import {combineReducers} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';

import {jsonPlaceholderReducer} from '@forest-feed/redux/module/jsonPlaceholder/jsonPlaceholder';
import campaignJourneyReducer from '@forest-feed/redux/module/campaignJourney/campaignJourney';

export const combinedReducers = combineReducers({
  jsonPlaceholderReducer,
  campaignJourney: campaignJourneyReducer,
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
