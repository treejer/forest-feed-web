import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectNonce} from '@forest-feed/redux/selectors';
import {nonceActions} from '@forest-feed/redux/module/nonce/nonce';

export default function useNonce() {
  const {data: nonce, ...nonceState} = useAppSelector(selectNonce);
  const dispatch = useAppDispatch();

  const dispatchGetNonce = useCallback(() => {
    dispatch(nonceActions.load());
  }, [dispatch]);

  const dispatchResetNonce = useCallback(() => {
    dispatch(nonceActions.resetCache());
  }, [dispatch]);

  return {
    nonce,
    ...nonceState,
    dispatchGetNonce,
    dispatchResetNonce,
  };
}
