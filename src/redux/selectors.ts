import {AppState} from '@forest-feed/redux/store';

export const selectInit = (state: AppState) => state.init;
export const selectCampaignJourney = (state: AppState) => state.campaignJourney;
export const selectWeb3 = (state: AppState) => state.web3;
export const selectConfig = (state: AppState) => state.web3.config;
export const selectNonce = (state: AppState) => state.nonce;
export const selectSign = (state: AppState) => state.sign;
