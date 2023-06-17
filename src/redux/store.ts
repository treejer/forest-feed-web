import createSagaMiddleware, {Task} from 'redux-saga';
import {createWrapper} from 'next-redux-wrapper';
import {combinedReducers, reducer} from '@forest-feed/redux/reducer';
import {rootSaga} from '@forest-feed/redux/saga';
import {configureStore, PreloadedState, Store} from '@reduxjs/toolkit';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<typeof combinedReducers>;
export type AppDispatch = AppStore['dispatch'];

export const makeStore = (preloadedState?: PreloadedState<AppState>) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer,
    middleware: [sagaMiddleware],
    preloadedState,
  }) as SagaStore;

  store.sagaTask = sagaMiddleware.run(rootSaga, store);

  return store;
};

export const wrapper = createWrapper(() => makeStore(), {
  debug: true,
  serializeState: state => JSON.stringify(state),
  deserializeState: state => JSON.parse(state),
});
