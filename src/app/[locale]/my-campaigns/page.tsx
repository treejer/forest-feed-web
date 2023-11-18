'use client';

import React, {useMemo} from 'react';

import Link from 'next/link';
import moment from 'moment';

import {TableWrapper} from '@forest-feed/components/kit/Table/TableWrapper';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {Campaign, CampaignStatus} from '@forest-feed/types/campaigns';
import {CampaignActivation} from '@forest-feed/components/CampaignActivation/CampaignActivation';
import {useMediaQuery} from '@forest-feed/hooks/useMediaQuery';
import {MyCampaignsRes} from '@forest-feed/webServices/campaign/myCampaigns';
import {useQueryFetch} from '@forest-feed/hooks/useQueryFetch';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {useScopedI18n} from '@forest-feed/locales/client';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';
import {cn} from '@forest-feed/utils/tailwind';

function MyCampaigns() {
  const {
    data: myCampaigns,
    isLoading,
    page,
    isFetching,
    handleSetPage,
    handleNextPrevPage,
  } = useQueryFetch<MyCampaignsRes>({
    queryKey: 'myCampaigns',
    endpoint: '/users/me/campaigns',
    params: {
      sort: JSON.stringify({createdAt: -1}),
    },
  });

  const {heyPublicationUrl} = useConfig();

  const t = useScopedI18n('myCampaigns');

  const matches = useMediaQuery('(max-width: 768px)');

  const columns: any = useMemo(
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
              value={value}
            />
          );
        },
        disableSortBy: true,
      },
      {
        Header: t('postId'),
        accessor: 'publicationId',
        disableSortBy: true,
        Cell: ({value}) => (
          <Link href={`${heyPublicationUrl}/${value}`} target="_blank" className={cn('font-bold underline')}>
            {value}
          </Link>
        ),
      },
      {
        Header: t('title'),
        accessor: 'title',
        disableSortBy: true,
      },
      {
        Header: t('generality'),
        accessor: 'isFollowerOnly',
        Cell: ({_, value}) => (<p>{t(value ? 'followersOnly' : 'public')}</p>) as React.ReactNode,
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
          return moment(value).format(matches ? 'l' : 'MMMM Do YYYY, h:mm:ss a');
        },
        defaultCanSort: true,
      },
    ],
    [t, heyPublicationUrl, matches],
  );

  return (
    <AnimatedPage className={cn('h-full')}>
      <AuthWrapper className={cn('h-full')}>
        <TableWrapper<Campaign>
          initialState={{sortBy: [{id: 'createdAt', desc: true}]}}
          data={myCampaigns?.result.campaignList}
          columns={columns}
          loading={isLoading}
          pagination={{
            page: page,
            loading: isFetching,
            count: myCampaigns?.result.count,
            loadPage: page => handleSetPage(page),
            loadNextPrevPage: count => handleNextPrevPage(count),
            refetching: false,
          }}
        />
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default MyCampaigns;
