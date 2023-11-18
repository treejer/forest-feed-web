import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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
    resetTokens: () => tokensInitialState,
  },
});

export const {updateBalance, checkBalance, resetTokens} = tokensSlice.actions;
export default tokensSlice.reducer;
