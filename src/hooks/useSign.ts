import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectSign} from '@forest-feed/redux/selectors';
import {SignPayload} from '@forest-feed/webServices/sign/sign';
import {signActions} from '@forest-feed/redux/module/sign/sign';

export default function useSign() {
  const {data: sign, ...signState} = useAppSelector(selectSign);
  const dispatch = useAppDispatch();

  const dispatchSign = useCallback(
    (form: SignPayload) => {
      dispatch(signActions.load(form));
    },
    [dispatch],
  );

  const dispatchResetSign = useCallback(() => {
    dispatch(signActions.resetCache());
  }, [dispatch]);

  return {sign, ...signState, dispatchSign, dispatchResetSign};
}
