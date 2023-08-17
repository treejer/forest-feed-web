'use client';

import React, {useMemo, useState} from 'react';
import {useTranslations} from 'use-intl';
import {TableOptions} from 'react-table';
import moment from 'moment';

import {Table} from '@forest-feed/components/kit/Table/Table';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {AnimatedPage} from '@forest-feed/components/kit/Animated/AnimatedPage';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';
import {AuthWrapper} from '@forest-feed/components/AuthWrapper/AuthWrapper';

import mockCampaigns from '@forest-feed/db/mockCampaigns.json';
import {paginationPageSize} from '@forest-feed/config';

export type TCampaign = {
  id: string;
  status: boolean;
  type: string;
  budget: string;
  goal: number;
  reposts: number;
  createdAt: string;
};

function MyCampaigns() {
  const t = useTranslations('myCampaigns');

  const [page, setPage] = useState(1);

  const columns: TableOptions<TCampaign>['columns'] = useMemo(
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
        accessor: 'id',
      },
      {
        Header: t('type'),
        accessor: 'type',
      },
      {
        Header: t('budget'),
        accessor: 'budget',
      },
      {
        Header: t('goal'),
        accessor: 'goal',
      },
      {
        Header: t('reposts'),
        accessor: 'reposts',
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

  const data = useMemo(() => mockCampaigns.slice((page - 1) * paginationPageSize, page * paginationPageSize), [page]);

  return (
    <AnimatedPage>
      <AuthWrapper>
        <Table<TCampaign>
          data={data}
          columns={columns}
          pagination={{
            page,
            loading: false,
            refetching: false,
            loadNextPrevPage: async (number: 1 | -1) =>
              setPage(prevState => (prevState + number < 1 ? prevState : prevState + number)),
          }}
        />
      </AuthWrapper>
    </AnimatedPage>
  );
}

export default MyCampaigns;
