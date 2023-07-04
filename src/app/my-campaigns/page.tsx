'use client';

import React from 'react';

import {Table, TColumn} from '@forest-feed/components/kit/Table/Table';
import {Switch} from '@forest-feed/components/kit/Switch/Switch';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge/RepostsBadge';

const columns: TColumn<TCampaign>[] = [
  {
    name: 'Status',
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
    name: 'Compaign ID',
    selector: (row: TCampaign) => row.id,
  },
  {
    name: 'TYPE',
    selector: (row: TCampaign) => row.type,
    sortable: true,
  },
  {
    name: 'Budget',
    selector: (row: TCampaign) => row.budget,
  },
  {
    name: 'Goal',
    selector: (row: TCampaign) => row.goal,
    sortable: true,
  },
  {
    name: 'Reposts',
    cell: (row: TCampaign) => <RepostsBadge text={row.reposts} status={RepostsStatus.active} />,
    selector: (row: TCampaign) => row.reposts,
  },
  {
    name: 'Creation Date',
    selector: (row: TCampaign) => row.createdAt,
    sortable: true,
  },
];

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
  return (
    <div>
      <h1>My Campaigns Page</h1>
      <Table<TCampaign>
        data={Array(200).fill({
          id: 'ff-twit-4',
          status: 'eyb nadareh',
          type: 'Standard',
          budget: 'budget',
          goal: 'goal',
          reposts: '67/100',
          createdAt: 'creationDate',
        })}
        columns={columns}
      />
    </div>
  );
}

export default MyCampaigns;
