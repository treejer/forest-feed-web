'use client';

import React, {useMemo} from 'react';

import Link from 'next/link';
import {useTranslations} from 'use-intl';
import {TableOptions} from 'react-table';
import moment from 'moment';

import {TableWrapper} from '@forest-feed/components/kit/Table/TableWrapper';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

import {Campaign, CampaignStatus} from '@forest-feed/types/campaigns';
import {CampaignActivation} from '@forest-feed/components/CampaignActivation/CampaignActivation';
import {useMediaQuery} from '@forest-feed/hooks/useMediaQuery';
import {MyCampaignsRes} from '@forest-feed/webServices/campaign/myCampaigns';
import {useQueryFetch} from '@forest-feed/hooks/useQueryFetch';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';

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
    endpoint: '/campaign/my-campaign',
    params: {
      sort: JSON.stringify({createdAt: -1}),
    },
  });

  const {heyPublicationUrl} = useConfig();

  const t = useTranslations('myCampaigns');

  const matches = useMediaQuery('(max-width: 768px)');

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
          <Link href={`${heyPublicationUrl}/${value}`} target="_blank" className="font-bold underline">
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
        Cell: ({_, value}) => <p>{t(value ? 'followersOnly' : 'public')}</p>,
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
    <AnimatedPage className="h-full">
      <AuthWrapper className="h-full">
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
