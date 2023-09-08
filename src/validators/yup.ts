import * as Yup from 'yup';

export const validator = {
  string: (required: boolean = false, message: string = 'errors.required') =>
    required ? Yup.string().trim().required(message) : Yup.string().trim(),
  bool: (message?: string) =>
    Yup.bool()
      .test('true', message || 'errors.required', value => {
        return !!value;
      })
      .required(message || 'errors.required'),
  attachment: (required: boolean = false) =>
    required
      ? Yup.mixed()
          .required('errors.required')
          .test('fileSize', 'errors.tooLarge', value => {
            return value[0]?.size <= 2000000;
          })
      : Yup.mixed()
          .test('fileSize', 'errors.tooLarge', value => {
            return !value || value?.[0]?.size <= 2000000;
          })
          .nullable(),
};
