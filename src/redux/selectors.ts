import {AppState} from '@forest-feed/redux/store';

export const selectInit = (state: AppState) => state.init;
export const selectCampaignJourney = (state: AppState) => state.campaignJourney;
export const selectWeb3 = (state: AppState) => state.web3;
export const selectAccessToken = (state: AppState) => state.web3.accessToken;
export const selectConfig = (state: AppState) => state.web3.config;
export const selectRegularSale = (state: AppState) => state.web3.config.contracts.REGULAR_SALE;
export const selectNonce = (state: AppState) => state.nonce;
export const selectSign = (state: AppState) => state.sign;
