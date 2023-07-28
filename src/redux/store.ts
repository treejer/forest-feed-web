import createSagaMiddleware, {Task} from 'redux-saga';
import {createWrapper} from 'next-redux-wrapper';
import {configureStore, PreloadedState, Store, Middleware} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import logger from 'redux-logger';

import {combinedReducers, reducer} from '@forest-feed/redux/reducer';
import {rootSaga} from '@forest-feed/redux/saga';
import {reduxLogger} from '@forest-feed/config';
import storage from '@forest-feed/lib/persist/storage';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export type AppStore = ReturnType<typeof makeStore>['store'];
export type AppState = ReturnType<typeof combinedReducers>;
export type AppDispatch = AppStore['dispatch'];

const persistConfig = {
  key: 'forestFeedPersist',
  storage,
  whitelist: ['web3'],
};

const persistedReducer = persistReducer(persistConfig, reducer);
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
