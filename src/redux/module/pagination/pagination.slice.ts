import {useCallback} from 'react';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type TAppQueries = {};

export enum PaginationName {
  MyCampaigns,
}

export type TPaginationItem = {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
};

export type TPaginationState = {
  [key in PaginationName]: TPaginationItem;
};

export const defaultPaginationItem: TPaginationItem = {
  page: 0,
  perPage: 7,
  total: 0,
  hasMore: true,
  loading: false,
};

export const paginationInitialState: TPaginationState = {
  [PaginationName.MyCampaigns]: defaultPaginationItem,
};

export const PaginationNameFetcher = {
  [PaginationName.MyCampaigns]: () => {}, //TODO: myCampaigns.load,
};

export type TPaginationAction = {
  setNextPage: {name: PaginationName; query?: TAppQueries};
  setPage: {name: PaginationName; page: number; query?: TAppQueries};
  setPaginationTotal: {name: PaginationName; total: number};
  paginationReachedEnd: {name: PaginationName};
  resetPagination: {name: PaginationName};
  name: PaginationName;
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: paginationInitialState,
  reducers: {
    setNextPage: (state, action: PayloadAction<TPaginationAction['setNextPage']>) => {
      state[action.payload.name].page = state[action.payload.name].page + 1;
      state[action.payload.name].loading = true;
    },
    setPage: (state, action: PayloadAction<TPaginationAction['setPage']>) => {
      state[action.payload.name].page = action.payload.page;
    },
    setPaginationTotal: (state, action: PayloadAction<TPaginationAction['setPaginationTotal']>) => {
      state[action.payload.name].total = action.payload.total;
      state[action.payload.name].loading = false;
    },
    paginationReachedEnd: (state, action: PayloadAction<TPaginationAction['paginationReachedEnd']>) => {
      state[action.payload.name].hasMore = false;
    },
    resetPagination: (state, action: PayloadAction<TPaginationAction['resetPagination']>) => {
      state[action.payload.name] = defaultPaginationItem;
    },
  },
});

export const {setNextPage, setPage, resetPagination, setPaginationTotal, paginationReachedEnd} =
  paginationSlice.actions;

export default paginationSlice.reducer;

export function useReduxPagination(name: PaginationName) {
  const data = useAppSelector(state => state.pagination[name]);

  const dispatch = useAppDispatch();

  const dispatchNextPage = useCallback(
    ({query}: Omit<TPaginationAction['setNextPage'], 'name'>) => {
      dispatch(setNextPage({name, query}));
    },
    [dispatch, name],
  );

  const dispatchSetPage = useCallback(
    ({page, query}: Omit<TPaginationAction['setPage'], 'name'>) => {
      dispatch(setPage({page, name, query}));
    },
    [dispatch, name],
  );

  const dispatchResetPagination = useCallback(() => {
    dispatch(resetPagination({name}));
  }, [dispatch, name]);

  return {
    ...data,
    dispatchSetPage,
    dispatchNextPage,
    dispatchResetPagination,
  };
}
