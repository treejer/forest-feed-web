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
  setMinimumFollowerNumber: number;
  setCampaignSize: number;
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
      state.currentStep = 1;
    },
    approvePledge: (state, action: PayloadAction<CampaignJourneyAction['approvePledge']>) => {
      state.reward = action.payload.reward;
      state.settings = action.payload.settings;
      state.size = action.payload.size;
      state.currentStep = 2;
    },
    setCurrentStep: (state, action: PayloadAction<CampaignJourneyAction['setCurrentStep']>) => {
      state.currentStep = action.payload;
    },
    setCanBeCollected: state => {
      state.settings.canBeCollected = !state.settings.canBeCollected;
    },
    setCanBeCollectedOnlyFollowers: state => {
      state.settings.canBeCollectedOnlyFollowers = !state.settings.canBeCollectedOnlyFollowers;
    },
    setMinimumFollowerNumber: (state, action: PayloadAction<CampaignJourneyAction['setMinimumFollowerNumber']>) => {
      state.reward.minimumFollowerNumber = action.payload;
    },
    setOnlyFollowers: state => {
      state.reward.onlyFollowers = !state.reward.onlyFollowers;
    },
  },
});

export const {
  approveGeneralInfo,
  approvePledge,
  setCurrentStep,
  setCanBeCollectedOnlyFollowers,
  setOnlyFollowers,
  setMinimumFollowerNumber,
  setCanBeCollected,
} = campaignJourneySlice.actions;

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

  const dispatchSetCanBeCollected = useCallback(() => {
    dispatch(setCanBeCollected());
  }, [dispatch]);

  const dispatchSetCanBeCollectedOnlyFollowers = useCallback(() => {
    dispatch(setCanBeCollectedOnlyFollowers());
  }, [dispatch]);

  const dispatchSetOnlyFollowers = useCallback(() => {
    dispatch(setOnlyFollowers());
  }, [dispatch]);

  const dispatchSetMinimumFollowerNumber = useCallback(
    (payload: CampaignJourneyAction['setMinimumFollowerNumber']) => {
      dispatch(setMinimumFollowerNumber(payload));
    },
    [dispatch],
  );

  return {
    campaignJourney,
    dispatchApproveGeneralInfo,
    dispatchApprovePledge,
    dispatchSetCurrentStep,
    dispatchSetCanBeCollected,
    dispatchSetCanBeCollectedOnlyFollowers,
    dispatchSetOnlyFollowers,
    dispatchSetMinimumFollowerNumber,
  };
};

export default campaignJourneySlice.reducer;
