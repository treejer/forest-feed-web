import {useCallback, useState} from 'react';

import {
  appId,
  BroadcastingError,
  CollectPolicyConfig,
  CollectPolicyType,
  ContentFocus,
  FailedUploadError,
  MetadataUploadHandler,
  NftAttributeDisplayType,
  PendingSigningRequestError,
  ProfileOwnedByMe,
  ReferencePolicyConfig,
  ReferencePolicyType,
  Result,
  SupportedPublicationMediaType,
  useCreatePost,
  UserRejectedError,
  WalletConnectionError,
} from '@lens-protocol/react-web';

import {lensProtocolAppId, NetworkConfig} from '@forest-feed/config';
import {getHttpDownloadUrl, upload, uploadContent} from '@forest-feed/utils/ipfs';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {showToast, ToastType} from '@forest-feed/utils/showToast';

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
            name: content.slice(0, 20),
            description: content,
            //TODO: attributes
            attributes: [
              {
                displayType: NftAttributeDisplayType.Date,
                value: new Date(), // actual Data instance
                traitType: 'DoB',
              },
              {
                displayType: NftAttributeDisplayType.Number,
                value: 42, // an actual JS number
                traitType: 'Level',
              },
              {
                displayType: NftAttributeDisplayType.String,
                value: '#ababab', // an arbitrary JS string
                traitType: 'Color',
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

      const values = {
        content,
        collect,
        reference,
        appId: appId(lensProtocolAppId),
        locale: 'en',
      };

      let result: Result<
        void,
        BroadcastingError | PendingSigningRequestError | UserRejectedError | WalletConnectionError | FailedUploadError
      >;

      if (image) {
        result = await create({
          contentFocus: ContentFocus.IMAGE,
          media: [
            {
              url: getHttpDownloadUrl(config.ipfsGetURL, photoMetaData.Hash),
              mimeType: image?.type as SupportedPublicationMediaType,
              altTag: image?.name,
            },
          ],
          ...values,
        });
      } else {
        result = await create({
          contentFocus: ContentFocus.TEXT_ONLY,
          ...values,
        });
      }

      if (result.isSuccess()) {
        showToast({
          message: 'lens.postCreated',
          translate: true,
          type: ToastType.success,
        });
      }
      if (result.isFailure()) {
        showToast({
          message: 'lens.postFailure',
          translate: true,
          type: ToastType.error,
        });
      }
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
