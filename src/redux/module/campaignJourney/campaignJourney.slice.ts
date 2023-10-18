import {useCallback} from 'react';

import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCampaignJourney} from '@forest-feed/redux/selectors';
import {SubmitCampaignSteps} from '@forest-feed/config';

export type CampaignJourneyState = {
  disableForm: boolean;
  content: string;
  image: File | null;
  imageBase64: string | null;
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
  submissionLoading: boolean;
  submissionError: boolean;
  submissionActiveStep: number;
};

export type CampaignJourneyAction = {
  approveGeneralInfo: Pick<CampaignJourneyState, 'content' | 'image' | 'termsConditionAgreed'> & {
    silent?: boolean;
  };
  approvePledge: Pick<CampaignJourneyState, 'size' | 'reward' | 'settings'>;
  setMinimumFollowerNumber: number;
  setCampaignSize: number;
  setCurrentStep: number;
  setDisableForm: boolean;
  setImageBase64: string | null;
  setImageFile: File | null;
  setSubmissionState: {
    loading?: boolean;
    error?: boolean;
    activeStep?: number;
  };
  removeTermsAndConditions?: boolean;
};

export const campaignJourneyInitialState: CampaignJourneyState = {
  disableForm: false,
  content: '',
  image: null,
  imageBase64: null,
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
  submissionLoading: false,
  submissionActiveStep: SubmitCampaignSteps.CreatePost,
  submissionError: false,
};

export const campaignJourneySlice = createSlice({
  name: 'campaignJourney',
  initialState: campaignJourneyInitialState,
  reducers: {
    mergeJourneyData: state => {
      return {
        ...state,
        image: null,
        submissionLoading: false,
        disableForm: false,
      };
    },
    setDisableForm: (state, action: PayloadAction<CampaignJourneyAction['setDisableForm']>) => {
      return {
        ...state,
        disableForm: action.payload,
      };
    },
    setImageBase64: (state, action: PayloadAction<CampaignJourneyAction['setImageBase64']>) => {
      state.imageBase64 = action.payload;
    },
    checkBase64Exist: state => state,
    setImageFile: (state, action: PayloadAction<CampaignJourneyAction['setImageFile']>) => {
      return {
        ...state,
        image: action.payload,
      };
    },
    setCurrentStep: (state, action: PayloadAction<CampaignJourneyAction['setCurrentStep']>) => {
      state.currentStep = action.payload;
    },
    approveGeneralInfo: (state, action: PayloadAction<CampaignJourneyAction['approveGeneralInfo']>) => {
      state.content = action.payload.content;
      state.image = action.payload.image;
      state.termsConditionAgreed = action.payload.termsConditionAgreed;
      state.currentStep = action.payload.silent ? state.currentStep : 1;
    },
    approveReview: state => {
      state.submissionLoading = campaignJourneyInitialState.submissionLoading;
      state.submissionActiveStep = campaignJourneyInitialState.submissionActiveStep;
      state.submissionError = campaignJourneyInitialState.submissionError;
      state.currentStep = 3;
    },
    setCampaignSize: (state, action: PayloadAction<CampaignJourneyAction['setCampaignSize']>) => {
      state.size = action.payload;
    },
    setCanBeCollected: state => {
      state.settings.canBeCollected = !state.settings.canBeCollected;
      state.settings.canBeCollectedOnlyFollowers = !state.settings.canBeCollected
        ? false
        : state.settings.canBeCollectedOnlyFollowers;
    },
    setCanBeCollectedOnlyFollowers: state => {
      state.settings.canBeCollected = !state.settings.canBeCollectedOnlyFollowers
        ? true
        : state.settings.canBeCollected;
      state.settings.canBeCollectedOnlyFollowers = !state.settings.canBeCollectedOnlyFollowers;
    },
    setMinimumFollowerNumber: (state, action: PayloadAction<CampaignJourneyAction['setMinimumFollowerNumber']>) => {
      state.reward.minimumFollowerNumber = action.payload;
    },
    setOnlyFollowers: state => {
      state.reward.onlyFollowers = !state.reward.onlyFollowers;
    },
    setSubmissionState: (state, action: PayloadAction<CampaignJourneyAction['setSubmissionState']>) => {
      state.submissionLoading = action.payload.loading !== undefined ? action.payload.loading : state.submissionLoading;
      state.submissionError = action.payload.error !== undefined ? action.payload.error : state.submissionError;
      state.submissionActiveStep =
        action.payload.activeStep !== undefined ? action.payload.activeStep : state.submissionActiveStep;
    },
    resetCampaignJourney: (state, action: PayloadAction<CampaignJourneyAction['removeTermsAndConditions']>) => {
      return {
        ...campaignJourneyInitialState,
        termsConditionAgreed: action.payload ? false : state.termsConditionAgreed,
      };
    },
  },
});

export const {
  mergeJourneyData,
  approveGeneralInfo,
  setCurrentStep,
  setCanBeCollectedOnlyFollowers,
  setOnlyFollowers,
  setMinimumFollowerNumber,
  setCanBeCollected,
  resetCampaignJourney,
  setDisableForm,
  setImageBase64,
  setImageFile,
  checkBase64Exist,
  setCampaignSize,
  setSubmissionState,
  approveReview,
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

  const dispatchApprovePledge = useCallback(() => {
    dispatch(setCurrentStep(2));
  }, [dispatch]);

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

  const dispatchResetCampaignJourney = useCallback(
    (payload?: CampaignJourneyAction['removeTermsAndConditions']) => {
      dispatch(resetCampaignJourney(payload));
    },
    [dispatch],
  );

  const dispatchSetDisableForm = useCallback(
    (payload: CampaignJourneyAction['setDisableForm']) => {
      dispatch(setDisableForm(payload));
    },
    [dispatch],
  );

  const dispatchSetCampaignSize = useCallback(
    (payload: CampaignJourneyAction['setCampaignSize']) => {
      dispatch(setCampaignSize(payload));
    },
    [dispatch],
  );

  const dispatchSetSubmissionState = useCallback(
    (payload: CampaignJourneyAction['setSubmissionState']) => {
      dispatch(setSubmissionState(payload));
    },
    [dispatch],
  );

  const dispatchApproveReview = useCallback(() => {
    dispatch(approveReview());
  }, [dispatch]);

  const dispatchCancelCampaignCreation = useCallback(() => {
    dispatchSetCurrentStep(0);
    dispatchSetSubmissionState({
      error: false,
      loading: false,
      activeStep: SubmitCampaignSteps.CreatePost,
    });
  }, [dispatchSetCurrentStep, dispatchSetSubmissionState]);

  return {
    campaignJourney,
    dispatchApproveGeneralInfo,
    dispatchApprovePledge,
    dispatchSetCurrentStep,
    dispatchSetCanBeCollected,
    dispatchSetCanBeCollectedOnlyFollowers,
    dispatchSetOnlyFollowers,
    dispatchSetMinimumFollowerNumber,
    dispatchResetCampaignJourney,
    dispatchSetDisableForm,
    dispatchSetCampaignSize,
    dispatchSetSubmissionState,
    dispatchApproveReview,
    dispatchCancelCampaignCreation,
  };
};

export default campaignJourneySlice.reducer;
