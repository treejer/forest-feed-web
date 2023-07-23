import {useCallback} from 'react';

import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCampaignJourney} from '@forest-feed/redux/selectors';

export type CampaignJourneySlice = {
  content: string;
  image: File | null;
  size: number;
  settings: {
    canBeCollected: boolean;
    canBeCollectedOnlyFollowers: boolean;
  };
  reward: {
    minimumFollowerNumber: number;
    onlyFollowers: boolean;
  };
  termsConditionAgreed: boolean;
  currentStep: number;
};

export type CampaignJourneyAction = {
  approveGeneralInfo: Pick<CampaignJourneySlice, 'content' | 'image' | 'termsConditionAgreed'>;
  approvePledge: Pick<CampaignJourneySlice, 'size' | 'reward' | 'settings'>;
  setCurrentStep: number;
};

export const campaignJourneyInitialState: CampaignJourneySlice = {
  content: '',
  image: null,
  size: 1,
  settings: {
    canBeCollected: false,
    canBeCollectedOnlyFollowers: false,
  },
  reward: {
    minimumFollowerNumber: 0,
    onlyFollowers: false,
  },
  termsConditionAgreed: false,
  currentStep: 0,
};

export const campaignJourneySlice = createSlice({
  name: 'campaignJourney',
  initialState: campaignJourneyInitialState,
  reducers: {
    approveGeneralInfo: (state, action: PayloadAction<CampaignJourneyAction['approveGeneralInfo']>) => {
      state.content = action.payload.content;
      state.image = action.payload.image;
      state.termsConditionAgreed = action.payload.termsConditionAgreed;
    },
    approvePledge: (state, action: PayloadAction<CampaignJourneyAction['approvePledge']>) => {
      state.reward = action.payload.reward;
      state.settings = action.payload.settings;
      state.size = action.payload.size;
    },
    setCurrentStep: (state, action: PayloadAction<CampaignJourneyAction['setCurrentStep']>) => {
      state.currentStep = action.payload;
    },
  },
});

export const {approveGeneralInfo, approvePledge, setCurrentStep} = campaignJourneySlice.actions;

export const useCampaignJourney = () => {
  const campaignJourney = useAppSelector(selectCampaignJourney);
  const dispatch = useAppDispatch();

  const dispatchApproveGeneralInfo = useCallback(
    (payload: CampaignJourneyAction['approveGeneralInfo']) => {
      dispatch(approveGeneralInfo(payload));
    },
    [dispatch],
  );

  const dispatchApprovePledge = useCallback(
    (payload: CampaignJourneyAction['approvePledge']) => {
      dispatch(approvePledge(payload));
    },
    [dispatch],
  );

  const dispatchSetCurrentStep = useCallback(
    (payload: CampaignJourneyAction['setCurrentStep']) => {
      dispatch(setCurrentStep(payload));
    },
    [dispatch],
  );

  return {
    campaignJourney,
    dispatchApproveGeneralInfo,
    dispatchApprovePledge,
    dispatchSetCurrentStep,
  };
};

export default campaignJourneySlice.reducer;
