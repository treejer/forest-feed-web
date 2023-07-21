import {AppState} from '@forest-feed/redux/store';

export const selectInit = (state: AppState) => state.init;
export const selectCampaignJourney = (state: AppState) => state.campaignJourney;
export const selectConfig = (state: AppState) => state.web3.config;
export const selectWeb3 = (state: AppState) => state.web3;
