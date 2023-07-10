import {formatUrl} from '@forest-feed/utils/fotmatUrl';

export type AppConfig = {
  name: string;
  projectId: string;
  debugFetch: boolean;
  apiBaseUrl: string;
};

export const appConfig: AppConfig = {
  name: 'Forest Feed',
  projectId: 'TEST_ID',
  debugFetch: process.env.NODE_ENV === 'development',
  apiBaseUrl: formatUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
};
