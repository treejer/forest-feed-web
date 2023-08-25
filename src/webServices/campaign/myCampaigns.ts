import {PaginationRes} from '@forest-feed/webServices/pagination';
import {Campaign} from '@forest-feed/types/campaigns';

export type MyCampaignsRes = PaginationRes<{campaignList: Campaign[]}>;

export type ActivationCampaignRes = {
  statusCode: number;
  message: string;
};
