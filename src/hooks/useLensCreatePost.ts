import {useCallback, useState} from 'react';

import {
  ContentFocus,
  MetadataUploadHandler,
  ProfileOwnedByMe,
  useCreatePost,
  MediaObject,
  SupportedPublicationMediaType,
  CollectPolicyType,
  NftAttributeDisplayType,
  ReferencePolicyType,
  CollectPolicyConfig,
  ReferencePolicyConfig,
} from '@lens-protocol/react-web';

import {NetworkConfig} from '@forest-feed/config';
import {getHttpDownloadUrl, upload, uploadContent} from '@forest-feed/utils/ipfs';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';

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

export function useLensCreatePost(props: UseLensCreatePostParams) {
  const {publisher} = props;

  const config = useConfig();
  const {campaignJourney} = useCampaignJourney();

  const {execute: create, ...createPostState} = useCreatePost({publisher, upload: uploadLens(config)});
  const [loading, setLoading] = useState(false);

  const createLensPost = useCallback(async () => {
    setLoading(true);
    try {
      const {content, image, settings, reward, size} = campaignJourney;

      let photoMetaData;

      if (image) {
        photoMetaData = await upload(config.ipfsPostURL, image);
      }

      let collect: CollectPolicyConfig;
      if (settings.canBeCollected) {
        collect = {
          type: CollectPolicyType.FREE,
          followersOnly: settings.canBeCollectedOnlyFollowers,
          collectLimit: size,
          metadata: {
            name: 'The NFT',
            description: 'The NFT description',

            //TODO: attributes
            attributes: [
              {
                displayType: NftAttributeDisplayType.Date,
                traitType: 'DoB',
                value: new Date(),
              },
            ],
          },
        };
      } else {
        collect = {
          type: CollectPolicyType.NO_COLLECT,
        };
      }

      let reference: ReferencePolicyConfig;

      if (reward.onlyFollowers) {
        reference = {
          type: ReferencePolicyType.FOLLOWERS_ONLY,
        };
      } else {
        reference = {
          type: ReferencePolicyType.DEGREES_OF_SEPARATION,
          params: {
            degreesOfSeparation: reward.minimumFollowerNumber,
            commentsRestricted: false,
            mirrorsRestricted: true,
          },
        };
      }

      await create({
        content,
        contentFocus: image ? ContentFocus.IMAGE : ContentFocus.TEXT_ONLY,
        media: [
          {
            url: getHttpDownloadUrl(config.ipfsGetURL, photoMetaData.Hash),
            mimeType: image?.type as SupportedPublicationMediaType,
            altTag: image?.name,
          },
        ],
        locale: 'en',
        collect,
        reference,
        // metadata_id: `forest-feed:${id}`,
      });
    } catch (e: any) {
      console.log(e, 'error in create post');
    } finally {
      console.log('create post finally');
      setLoading(false);
    }
  }, [campaignJourney, create, config.ipfsPostURL, config.ipfsGetURL]);

  return {
    ...createPostState,
    allLoading: createPostState.isPending || loading,
    imageLoading: loading,
    createLensPost,
  };
}
