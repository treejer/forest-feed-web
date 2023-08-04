import {useCallback} from 'react';

import {
  ContentFocus,
  MetadataUploadHandler,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useCreatePost,
} from '@lens-protocol/react-web';

import {NetworkConfig} from '@forest-feed/config';
import {getHttpDownloadUrl, upload, uploadContent} from '@forest-feed/utils/ipfs';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {
  CampaignJourneySlice,
  useCampaignJourney,
} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

export type UseLensCreatePostParams = {
  publisher: ProfileOwnedByMe;
};

export function uploadLens({ipfsPostURL, ipfsGetURL}: NetworkConfig): MetadataUploadHandler {
  return async (data: unknown) => {
    const dataJson = JSON.stringify(data);
    const contentMetaData = await uploadContent(ipfsPostURL, dataJson);

    return getHttpDownloadUrl(ipfsGetURL, contentMetaData.Hash);
  };
}

export function referenceType(settings: CampaignJourneySlice['settings']) {
  if (settings.canBeCollected) return ReferencePolicyType.ANYONE;
  else if (settings.canBeCollectedOnlyFollowers) return ReferencePolicyType.FOLLOWERS_ONLY;
  else return ReferencePolicyType;
}

export function useLensCreatePost(props: UseLensCreatePostParams) {
  const {publisher} = props;

  const config = useConfig();
  const {campaignJourney} = useCampaignJourney();

  const {execute: create, ...createPostState} = useCreatePost({publisher, upload: uploadLens(config)});

  const createLensPost = useCallback(async () => {
    try {
      const {content, image, settings, reward, size} = campaignJourney;
      let media;
      if (image) {
        const photoMetaData = await upload(config.ipfsPostURL, image);
        media = {
          url: getHttpDownloadUrl(config.ipfsGetURL, photoMetaData.Hash),
          mimeType: image?.type,
        };
      }

      await create({
        content: content,
        contentFocus: ContentFocus.TEXT,
        media: [media],
        locale: 'en',
      });
    } catch (e: any) {
      console.log(e, 'error in create post');
    }
  }, [campaignJourney, create, config.ipfsPostURL, config.ipfsGetURL]);

  return {
    ...createPostState,
    createLensPost,
  };
}
