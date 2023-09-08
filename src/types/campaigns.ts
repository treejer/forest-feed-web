export enum CampaignStatus {
  active,
  notActive,
  finished,
}

export type Campaign = {
  _id: string;
  title: string;
  publicationId: string;
  creator: string;
  isFollowerOnly: boolean;
  status: CampaignStatus;
  awardedCount: number;
  campaignSize: number;
  createdAt: string;
  updatedAt: string;
};
