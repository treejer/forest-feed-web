export type CreateCampaignRes = {
  _id: string;
  title: string;
  publicationId: string;
  creator: string;
  status: number;
  isFollowerOnly: boolean;
  minFollower: number;
  awardedCount: number;
  campaignSize: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCampaignPayload = {
  title: string;
  publicationId: string;
  isFollowerOnly: boolean;
  minFollower: number;
  campaignSize: number;
  onSuccess?: () => void;
  onFailure?: () => void;
};

export type CreateCampaignForm = Omit<CreateCampaignPayload, 'onSuccess' | 'onFailure'>;

export type CreateCampaignAction = {
  type: string;
  payload: CreateCampaignPayload;
};
