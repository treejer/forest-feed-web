'use client';

import React, {useEffect, useMemo} from 'react';
import {useTranslations} from 'use-intl';
import {TableOptions} from 'react-table';
import moment from 'moment';

import {TableWrapper} from '@forest-feed/components/kit/Table/TableWrapper';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

import {useMyCampaigns} from '@forest-feed/redux/module/campaign/myCampaigns';
import {Campaign, CampaignStatus} from '@forest-feed/types/campaigns';
import {useProfile} from '@forest-feed/redux/module/profile/profile';
import {CampaignActivation} from '@forest-feed/components/CampaignActivation/CampaignActivation';

function MyCampaigns() {
  const {myCampaigns, loading, pagination, dispatchFetchMyCampaigns} = useMyCampaigns();
  const {profile} = useProfile();

  const t = useTranslations('myCampaigns');

  useEffect(() => {
    dispatchFetchMyCampaigns();
  }, [profile]);

  const columns: TableOptions<Campaign>['columns'] = useMemo(
    () => [
      {
        Header: t('status'),
        accessor: 'status',
        Cell: ({cell, value}) => {
          return (
            <CampaignActivation
              campaignId={cell.row.original._id}
              checked={value === CampaignStatus.active}
              disabled={value === CampaignStatus.finished}
              value={value.toString()}
            />
          );
        },
        disableSortBy: true,
      },
      {
        Header: t('campaignId'),
        accessor: 'publicationId',
        disableSortBy: true,
      },
      {
        Header: t('title'),
        accessor: 'title',
        disableSortBy: true,
      },
      {
        Header: t('goal'),
        accessor: 'campaignSize',
        disableSortBy: true,
      },
      {
        Header: t('reposts'),
        accessor: 'awardedCount',
        Cell: ({cell, value}) => (
          <RepostsBadge
            min={value}
            max={cell.row.original.campaignSize}
            status={cell.row.original.campaignSize === value ? RepostsStatus.active : RepostsStatus.stopped}
          />
        ),
        disableSortBy: true,
      },
      {
        Header: t('creationDate'),
        accessor: 'createdAt',
        Cell: ({value}) => {
          console.log(value, 'value is here');
          return moment(moment(value).valueOf()).format('MMMM Do YYYY, h:mm:ss a');
        },
        defaultCanSort: true,
      },
    ],
    [t],
  );

  return (
    <AnimatedPage className="h-full">
      <AuthWrapper className="h-full">
        <TableWrapper<Campaign>
          initialState={{sortBy: [{id: 'createdAt', desc: true}]}}
          data={myCampaigns?.campaignList}
          columns={columns}
          loading={loading}
          pagination={{
            page: pagination.page,
            loading: pagination.loading,
            count: pagination.total,
            loadPage: page => pagination.dispatchSetPage({page}),
            loadNextPrevPage: count => pagination.dispatchNextPrevPage({count}),
            refetching: false,
          }}
        />
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default MyCampaigns;
