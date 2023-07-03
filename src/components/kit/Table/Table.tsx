import DataTable, {TableStyles} from 'react-data-table-component';
import {Switch} from '../Switch/Switch';
import {RepostsBadge, RepostsStatus} from '@forest-feed/components/RepostsBadge';
import {Pagination} from './Pagination';

const ExpandedComponent = ({data}) => <pre>{JSON.stringify(data, null, 2)}</pre>;
const columns = [
  {
    name: 'Status',
    cell: row => <Switch />,
    selector: row => row.status,
    sortable: true,
  },
  {
    name: 'Compaign ID',
    selector: row => row.id,
  },
  {
    name: 'TYPE',
    selector: row => row.type,
    sortable: true,
  },
  {
    name: 'Budget',
    selector: row => row.budget,
  },
  {
    name: 'Goal',
    selector: row => row.goal,
    sortable: true,
  },
  {
    name: 'Reposts',
    cell: row => <RepostsBadge text={row.reposts} status={RepostsStatus.active} />,
    selector: row => row.reposts,
  },
  {
    name: 'Creation Date',
    selector: row => row.createdAt,
    sortable: true,
  },
];

export const defaultStyles: TableStyles = {
  headRow: {
    style: {
      backgroundColor: '#E5E7DB',
    },
  },
  table: {
    style: {
      border: '1px solid #BDBDBD',
    },
  },
};

const data = [
  {
    id: 'ff-lens-21',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: 'reposts',
    createdAt: 'creationDate,',
  },
  {
    id: 'ff-twit-5',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: 'reposts',
    createdAt: 'creationDate,',
  },
  {
    id: 'ff-lens-20',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: 'reposts',
    createdAt: 'creationDate,',
  },
  {
    id: 'ff-lens-19',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: '83/100',
    createdAt: 'creationDate,',
  },
  {
    id: 'ff-lens-18',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: 'reposts',
    createdAt: 'creationDate,',
  },
  {
    id: 'ff-twit-4',
    status: 'status',
    type: 'Standard',
    budget: 'budget',
    goal: 'goal',
    reposts: '67/100',
    createdAt: 'creationDate,',
  },
];

export function Table() {
  return (
    <DataTable
      columns={columns}
      data={Array(200).fill({
        id: 'ff-twit-4',
        status: 'status',
        type: 'Standard',
        budget: 'budget',
        goal: 'goal',
        reposts: '67/100',
        createdAt: 'creationDate,',
      })}
      customStyles={defaultStyles}
      pagination
      paginationComponent={Pagination}
    />
  );
}
