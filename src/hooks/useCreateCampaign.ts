import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectCreateCampaign} from '@forest-feed/redux/selectors';
import {CreateCampaignPayload} from '@forest-feed/webServices/campaign/createCampaign';
import {createCampaignActions} from '@forest-feed/redux/module/campaign/createCampaign';

export default function useCreateCampaign() {
  const {data: createCampaign, ...createCampaignState} = useAppSelector(selectCreateCampaign);
  const dispatch = useAppDispatch();

  const dispatchCreateCampaign = useCallback(
    (payload: CreateCampaignPayload) => {
      dispatch(createCampaignActions.load(payload));
    },
    [dispatch],
  );

  const dispatchResetCreateCampaign = useCallback(() => {
    dispatch(createCampaignActions.resetCache());
  }, [dispatch]);

  return {
    createCampaign,
    ...createCampaignState,
    dispatchCreateCampaign,
    dispatchResetCreateCampaign,
  };
}
