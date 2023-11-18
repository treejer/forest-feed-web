import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCampaignJourney} from '@forest-feed/redux/selectors';
import {SubmitCampaignSteps} from '@forest-feed/config';
import {
  approveGeneralInfo,
  approveReview,
  CampaignJourneyAction,
  resetCampaignJourney,
  setCampaignSize,
  setCanBeCollected,
  setCanBeCollectedOnlyFollowers,
  setCurrentStep,
  setDisableForm,
  setMinimumFollowerNumber,
  setOnlyFollowers,
  setSubmissionState,
} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

export default function useCampaignJourney() {
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
}
