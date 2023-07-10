import {combineReducers} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {reducer as notificationsReducer} from 'reapop';

export const combinedReducers = combineReducers({
  notifications: notificationsReducer(),
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
