import * as Yup from 'yup';

export const validator = {
  string: (required: boolean = false, message: string = 'errors.required') =>
    required ? Yup.string().required(message) : Yup.string(),
  bool: (message?: string) =>
    Yup.bool()
      .test('true', message || 'errors.required', value => {
        return !!value;
      })
      .required(message || 'errors.required'),
  attachment: () =>
    Yup.mixed()
      .required('errors.required')
      .test('fileSize', 'tooLarge', value => {
        return value[0]?.size <= 2000000;
      }),
};
