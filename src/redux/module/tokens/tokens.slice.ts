import {useCallback, useEffect} from 'react';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {selectTokens} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type TokensInitialState = {
  DAI: number | undefined;
  loading: boolean;
};

export const tokensInitialState: TokensInitialState = {
  DAI: undefined,
  loading: false,
};

export type TokensActions = {
  updateBalance: {
    DAI: number;
  };
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState: tokensInitialState,
  reducers: {
    checkBalance: state => {
      state.loading = true;
    },
    updateBalance: (state, action: PayloadAction<TokensActions['updateBalance']>) => {
      state.DAI = action.payload.DAI;
      state.loading = false;
    },
  },
});

export const {updateBalance, checkBalance} = tokensSlice.actions;
export default tokensSlice.reducer;

export type UseTokenParams = {
  didMount: boolean;
};
export function useTokens({didMount}: UseTokenParams = {didMount: true}) {
  const tokens = useAppSelector(selectTokens);
  const dispatch = useAppDispatch();

  const dispatchCheckBalance = useCallback(() => {
    dispatch(checkBalance());
  }, [dispatch]);

  useEffect(() => {
    if (didMount) {
      dispatchCheckBalance();
    }
  }, []);

  return {
    tokens,
    dispatchCheckBalance,
  };
}
