'use client';

import React, {useMemo} from 'react';
import {useTranslations} from 'use-intl';

import {Table, TColumn} from '@forest-feed/components/kit/Table/Table';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

export type TCampaign = {
  id: string;
  status: string;
  type: string;
  budget: string;
  goal: string;
  reposts: string;
  createdAt: string;
};

function MyCampaigns() {
  const t = useTranslations('myCampaigns');

  const columns: TColumn<TCampaign>[] = useMemo(
    () => [
      {
        name: t('status'),
        cell: (row: TCampaign, index: number) => {
          return (
            <Switch
              value={row.status}
              checked={row.status === 'checked'}
              onChange={e => console.log(e.target.value)}
              id={`swatch-${index}`}
            />
          );
        },
        selector: (row: TCampaign) => row.status,
      },
      {
        name: t('campaignId'),
        selector: (row: TCampaign) => row.id,
      },
      {
        name: t('type'),
        selector: (row: TCampaign) => row.type,
        sortable: true,
      },
      {
        name: t('budget'),
        selector: (row: TCampaign) => row.budget,
      },
      {
        name: t('goal'),
        selector: (row: TCampaign) => row.goal,
        sortable: true,
      },
      {
        name: t('reposts'),
        cell: (row: TCampaign) => <RepostsBadge text={row.reposts} status={RepostsStatus.active} />,
        selector: (row: TCampaign) => row.reposts,
      },
      {
        name: t('creationDate'),
        selector: (row: TCampaign) => row.createdAt,
        sortable: true,
      },
    ],
    [t],
  );

  return (
    <AnimatedPage>
      <AuthWrapper>
        <Table<TCampaign>
          data={Array(200).fill({
            id: 'ff-twit-4',
            status: "It's OK!",
            type: 'Standard',
            budget: 'budget',
            goal: 'goal',
            reposts: '67/100',
            createdAt: 'creationDate',
          })}
          columns={columns}
        />
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default MyCampaigns;
