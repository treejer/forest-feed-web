import React, {useCallback, useMemo, useState} from 'react';

import CheckIcon from '@heroicons/react/24/solid/CheckIcon';

import {ActivationCampaignRes} from '@forest-feed/webServices/campaign/myCampaigns';
import Switch from '@forest-feed/components/kit/Switch/Switch';
import useFetch from '@forest-feed/hooks/useFetch';
import {CampaignStatus} from '@forest-feed/types/campaigns';
import Spacer from '@forest-feed/components/common/Spacer';
import {useI18n} from '@forest-feed/locales/client';
import cn from '@forest-feed/utils/tailwind';
import useConfig from '@forest-feed/hooks/useConfig';

export type CampaignActivationProps = {
  campaignId: string;
  checked: boolean;
  value: string | number;
  disabled: boolean;
};

export default function CampaignActivation(props: CampaignActivationProps) {
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

  const t = useI18n();

  const handleChangeActiveState = useCallback(async () => {
    if (isActive) await doDeActive();
    else await doActive();
  }, [isActive, doActive, doDeActive]);

  const loading = useMemo(
    () => activeState.loading || deActiveState.loading,
    [activeState.loading, deActiveState.loading],
  );

  return value === CampaignStatus.finished ? (
    <span className={cn('text-green font-bold flex items-center')}>
      {t('finished')}
      <Spacer />
      <CheckIcon className={cn('w-5 h-5 text-green')} />
    </span>
  ) : (
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
