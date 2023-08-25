'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'use-intl';
import {TableOptions} from 'react-table';
import moment from 'moment';

import {TableWrapper} from '@forest-feed/components/kit/Table/TableWrapper';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

import {useMyCampaigns} from '@forest-feed/redux/module/myCampaigns/myCampaigns';
import {Campaign} from '@forest-feed/types/campaigns';

function MyCampaigns() {
  const t = useTranslations('myCampaigns');

  const {myCampaigns, pagination, dispatchFetchMyCampaigns} = useMyCampaigns();

  useEffect(() => {
    dispatchFetchMyCampaigns();
  }, []);

  console.log(myCampaigns, 'myCampaigns is ehere');

  const columns: TableOptions<Campaign>['columns'] = useMemo(
    () => [
      {
        Header: t('status'),
        accessor: 'status',
        Cell: ({cell, value}) => (
          <Switch id={cell.row.values.id} checked={!!value} onChange={() => {}} value={value.toString()} />
        ),
      },
      {
        Header: t('campaignId'),
        accessor: 'publicationId',
      },
      // {
      //   Header: t('type'),
      //   accessor: '',
      // },
      // {
      //   Header: t('budget'),
      //   accessor: 'budget',
      // },
      {
        Header: t('goal'),
        accessor: 'campaignSize',
      },
      {
        Header: t('reposts'),
        accessor: 'awardedCount',
        Cell: ({cell, value}) => (
          <RepostsBadge
            min={value}
            max={cell.row.values.goal}
            status={cell.row.values.goal === value ? RepostsStatus.active : RepostsStatus.stopped}
          />
        ),
      },
      {
        Header: t('creationDate'),
        accessor: 'createdAt',
        Cell: ({value}) => moment(value).format('l'),
        sortDescFirst: true,
        defaultCanSort: true,
      },
    ],
    [t],
  );

  return (
    <AnimatedPage>
      <AuthWrapper>
        <TableWrapper<Campaign>
          data={myCampaigns?.campaignList}
          columns={columns}
          pagination={{
            page: pagination.page,
            loading: pagination.loading,
            count: pagination.total,
            loadPage: page => pagination.dispatchSetPage({page}),
            loadNextPrevPage: count => pagination.dispatchNextPrevPage({count}),
          }}
        />
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default MyCampaigns;
