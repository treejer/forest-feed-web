import React, {useCallback, useMemo, useState} from 'react';

import {ActivationCampaignRes} from '@forest-feed/webServices/campaign/myCampaigns';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {useFetch} from '@forest-feed/hooks/useFetch';

export type CampaignActivationProps = {
  campaignId: string;
  checked: boolean;
  value: string;
  disabled: boolean;
};

export function CampaignActivation(props: CampaignActivationProps) {
  const {campaignId, checked, value, disabled} = props;

  const [isActive, setIsActive] = useState(checked);

  const config = useConfig();

  const [activeState, doActive] = useFetch<ActivationCampaignRes>(`/campaign/${campaignId}/activate`, {
    didMount: false,
    afterSuccess: () => {
      setIsActive(true);
    },
    fetchOptions: {
      method: 'PATCH',
      baseURL: config.forestFeedApiUrl,
    },
  });
  const [deActiveState, doDeActive] = useFetch<ActivationCampaignRes>(`/campaign/${campaignId}/deactivate`, {
    didMount: false,
    afterSuccess: () => {
      setIsActive(false);
    },
    fetchOptions: {
      method: 'PATCH',
      baseURL: config.forestFeedApiUrl,
    },
  });

  const handleChangeActiveState = useCallback(async () => {
    if (isActive) await doDeActive();
    else await doActive();
  }, [isActive, doActive, doDeActive]);

  const loading = useMemo(
    () => activeState.loading || deActiveState.loading,
    [activeState.loading, deActiveState.loading],
  );

  return (
    <Switch
      id={campaignId}
      checked={isActive}
      onChange={handleChangeActiveState}
      value={value}
      loading={loading}
      disabled={disabled}
    />
  );
}
