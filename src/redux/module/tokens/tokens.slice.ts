import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type TokensInitialState = {
  DAI: number | undefined;
  loading: boolean;
};

type TokensActions = {
  updateBalance: {
    DAI: number;
  };
};

const tokensInitialState: TokensInitialState = {
  DAI: undefined,
  loading: false,
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
