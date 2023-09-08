import createSagaMiddleware, {Task} from 'redux-saga';
import {createWrapper} from 'next-redux-wrapper';
import {configureStore, PreloadedState, Store, Middleware} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {createBlacklistFilter} from 'redux-persist-transform-filter';
import logger from 'redux-logger';

import {combinedReducers, reducer} from '@forest-feed/redux/reducer';
import {rootSaga} from '@forest-feed/redux/saga';
import {checkAppVersion} from '@forest-feed/redux/module/appInfo/appInfo.slice';
import {reduxLogger} from '@forest-feed/config';
import storage from '@forest-feed/lib/persist/storage';
import {checkUserVersion} from '@forest-feed/utils/version';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export type AppStore = ReturnType<typeof makeStore>['store'];
export type AppState = ReturnType<typeof combinedReducers>;
export type AppDispatch = AppStore['dispatch'];

const saveSubsetBlacklistFilter = createBlacklistFilter('campaignJourney', [
  'image',
  'disableForm',
  'submissionLoading',
]);

const persistConfig = {
  key: 'forestFeedPersist',
  storage,
  whitelist: ['web3', 'appInfo', 'profile', 'campaignJourney'],
  transforms: [saveSubsetBlacklistFilter],
};

const persistedReducer = persistReducer(persistConfig, (state: any, action: {type: string; payload: any}) => {
  if (action.type === 'persist/REHYDRATE') {
    return reducer({...state, appInfo: {version: action?.payload?.appInfo?.version || ''}}, action);
  }
  if (action.type === checkAppVersion.type) {
    if (!state.appInfo.version || checkUserVersion(state.appInfo.version)) {
      return reducer(undefined, action);
    }
  }
  return reducer(state, action);
});
export const makeStore = (preloadedState?: PreloadedState<AppState>) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares: Middleware[] = [sagaMiddleware];
  if (reduxLogger) {
    middlewares.push(logger);
  }
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({thunk: false, serializableCheck: false}).prepend(...middlewares),
    preloadedState,
  }) as SagaStore;

  store.sagaTask = sagaMiddleware.run(rootSaga, store);

  const persistor = persistStore(store);

  return {store, persistor};
};

export const wrapper = createWrapper(() => makeStore().store, {
  debug: true,
  serializeState: state => JSON.stringify(state),
  deserializeState: state => JSON.parse(state),
});

export const {store, persistor} = makeStore();
