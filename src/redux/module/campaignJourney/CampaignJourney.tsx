import {useCallback} from 'react';

import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCampaignJourney} from '@forest-feed/redux/selectors';

export type CampaignJourney = {
  content: string;
  image: File | null;
  size: number;
  settings: {
    canBeCollected: '0' | '1';
    canBeCollectedOnlyFollowers: '0' | '1';
  };
  reward: {
    minimumFollowerNumber: number;
    onlyFollowers: '0' | '1';
  };
};

export const campaignJourneyInitialState: CampaignJourney = {
  content: '',
  image: null,
  size: 0,
  settings: {
    canBeCollected: '0',
    canBeCollectedOnlyFollowers: '0',
  },
  reward: {
    minimumFollowerNumber: 0,
    onlyFollowers: '0',
  },
};

export type CampaignJourneyAction = {
  approveGeneralInfo: Pick<CampaignJourney, 'content' | 'image'>;
};

export const campaignJourneySlice = createSlice({
  name: 'campaignJourney',
  initialState: campaignJourneyInitialState,
  reducers: {
    approveGeneralInfo: (state, action: PayloadAction<CampaignJourneyAction['approveGeneralInfo']>) => {
      state.content = action.payload.content;
      state.image = action.payload.image;
    },
  },
});

export const {approveGeneralInfo} = campaignJourneySlice.actions;

export const useCampaignJourney = () => {
  const campaignJourney = useAppSelector(selectCampaignJourney);
  const dispatch = useAppDispatch();

  const dispatchApproveGeneralInfo = useCallback(
    (payload: CampaignJourneyAction['approveGeneralInfo']) => {
      dispatch(approveGeneralInfo(payload));
    },
    [dispatch],
  );

  return {
    campaignJourney,
  };
};

export default campaignJourneySlice.reducer;
