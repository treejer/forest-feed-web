import * as Yup from 'yup';

import {yupResolver} from '@hookform/resolvers/yup';

import {validator} from '@forest-feed/validators/yup';

export type GeneralInfoForm = {
  content: string;
  image: Yup.MixedSchema | null;
  termsConditionAgreed: boolean;
};

export const generalInfoFormSchema = Yup.object({
  content: validator.string(true),
  image: validator.attachment(),
  termsConditionAgreed: validator.bool('errors.privacyPolicy'),
});

export const generalInfoYup = yupResolver(generalInfoFormSchema);
