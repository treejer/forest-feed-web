import {useCallback, useEffect} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectTokens} from '@forest-feed/redux/selectors';
import {checkBalance} from '@forest-feed/redux/module/tokens/tokens.slice';

export type UseTokenParams = {
  didMount: boolean;
};
export default function useTokens({didMount}: UseTokenParams = {didMount: true}) {
  const tokens = useAppSelector(selectTokens);
  const dispatch = useAppDispatch();

  const dispatchCheckBalance = useCallback(() => {
    dispatch(checkBalance());
  }, [dispatch]);

  useEffect(() => {
    if (didMount) {
      dispatchCheckBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tokens,
    dispatchCheckBalance,
  };
}
