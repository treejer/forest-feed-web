import React from 'react';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {useFetch} from '@forest-feed/hooks/useFetch';
import {ActivationCampaignRes} from '@forest-feed/webServices/campaign/myCampaigns';

export type CampaignActivationProps = {
  campaignId: string;
  checked: boolean;
  value: string;
};

export function CampaignActivation(props: CampaignActivationProps) {
  const {campaignId, value, checked} = props;

  const [activeState, doActive] = useFetch<ActivationCampaignRes>(`/campaign/${campaignId}/activate`);
  const [deActiveState, doDeActive] = useFetch<ActivationCampaignRes>(`/campaign/${campaignId}/deactivate`);

  return <Switch id={campaignId} checked={checked} onChange={() => {}} value={value.toString()} />;
}
