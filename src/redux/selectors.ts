import {AppState} from '@forest-feed/redux/store';

export const selectInit = (state: AppState) => state.init;
export const selectCampaignJourney = (state: AppState) => state.campaignJourney;
export const selectWeb3 = (state: AppState) => state.web3;
export const selectAccessToken = (state: AppState) => state.web3.accessToken;
export const selectConfig = (state: AppState) => state.web3.config;
export const selectLensProfile = (state: AppState) => state.web3.lensProfile;
export const selectRegularSaleContract = (state: AppState) => state.web3.config.contracts.REGULAR_SALE;
export const selectForestFeedContract = (state: AppState) => state.web3.config.contracts.FOREST_FEED;
export const selectDaiTokenContract = (state: AppState) => state.web3.config.contracts.DAI;
export const selectNonce = (state: AppState) => state.nonce;
export const selectSign = (state: AppState) => state.sign;
export const selectMyCampaign = (state: AppState) => state.myCampaigns;
export const selectCreateCampaign = (state: AppState) => state.createCampaign;
