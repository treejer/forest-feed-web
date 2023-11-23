import {put, select, takeEvery} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {
  approveGeneralInfo,
  CampaignJourneyAction,
  CampaignJourneyState,
  checkBase64Exist,
  setImageBase64,
  setImageFile,
} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import photoToBase64 from '@forest-feed/utils/photoToBase64';
import getCroppedImg from '@forest-feed/utils/cropImage';
import {selectCampaignJourney} from '@forest-feed/redux/selectors';

function* watchApproveGeneralInfo({payload}: PayloadAction<CampaignJourneyAction['approveGeneralInfo']>) {
  try {
    const {image} = payload || {};
    if (image) {
      const imageBase64 = yield photoToBase64(image);
      yield put(setImageBase64(imageBase64));
    } else {
      yield put(setImageBase64(null));
    }
  } catch (e: any) {
    console.log(e, 'error in watch approve general info');
  }
}

function* watchCheckBase64Exist() {
  try {
    const {imageBase64}: CampaignJourneyState = yield select(selectCampaignJourney);
    if (imageBase64) {
      const file: File = yield getCroppedImg(imageBase64, 'file');
      yield put(setImageFile(file));
    } else {
      yield put(setImageFile(null));
    }
  } catch (e: any) {
    console.log(e, 'error in watch base 64 to file');
  }
}

export default function* campaignJourneySagas() {
  yield takeEvery(approveGeneralInfo.type, watchApproveGeneralInfo);
  yield takeEvery(checkBase64Exist.type, watchCheckBase64Exist);
}
