import {useCallback, useState} from 'react';

import {
  appId,
  BroadcastingError,
  PendingSigningRequestError,
  Result,
  useCreatePost,
  UserRejectedError,
  WalletConnectionError,
  CollectActionConfig,
  OpenActionType,
  PostAsyncResult,
} from '@lens-protocol/react-web';
import {
  textOnly as textOnlyMetadata,
  image as imageMetadata,
  MediaImageMimeType,
  MarketplaceMetadataAttributeDisplayType,
} from '@lens-protocol/metadata';

import {lensProtocolAppId, NetworkConfig, storageKeys, SubmitCampaignSteps} from '@forest-feed/config';
import {getHttpDownloadUrl, IPFSUploadResponse, upload, uploadContent} from '@forest-feed/utils/ipfs';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
import {usePersistState} from '@forest-feed/hooks/usePersistState';

async function uploadLens({ipfsPostURL, ipfsGetURL}: NetworkConfig, data: any) {
  const dataJson = JSON.stringify(data);
  const contentMetaData = await uploadContent(ipfsPostURL, dataJson);

  return getHttpDownloadUrl(ipfsGetURL, contentMetaData.Hash);
}

export function useLensCreatePost() {
  const config = useConfig();
  const {campaignJourney, dispatchSetSubmissionState} = useCampaignJourney();

  const {execute: create, ...createPostState} = useCreatePost();
  const [loading, setLoading] = useState(false);
  const [createdPubId, setCreatedPubId] = usePersistState<string | null>(null, storageKeys.CREATED_PUBLICATION_ID);

  const createLensPost = useCallback(async () => {
    setLoading(true);
    dispatchSetSubmissionState({
      loading: true,
      error: false,
    });
    try {
      const {content, image, settings, size} = campaignJourney;

      let photoMetaData: IPFSUploadResponse | undefined = undefined;

      if (image) {
        photoMetaData = await upload(config.ipfsPostURL, image);
      }

      let collect: CollectActionConfig;
      // if (settings.canBeCollected) {
      //   collect = {
      //     type: CollectPolicyType.FREE,
      //     followersOnly: settings.canBeCollectedOnlyFollowers,
      //     collectLimit: size,
      //     metadata: {
      //       name: content.slice(0, 20),
      //       description: content,
      //       //TODO: attributes
      //       attributes: [
      //         {
      //           displayType: NftAttributeDisplayType.Date,
      //           value: new Date(), // actual Data instance
      //           traitType: 'DoB',
      //         },
      //         {
      //           displayType: NftAttributeDisplayType.Number,
      //           value: 42, // an actual JS number
      //           traitType: 'Level',
      //         },
      //         {
      //           displayType: NftAttributeDisplayType.String,
      //           value: '#ababab', // an arbitrary JS string
      //           traitType: 'Color',
      //         },
      //       ],
      //     },
      //   };
      // } else {
      //   collect = {
      //     type: CollectPolicyType.NO_COLLECT,
      //   };
      // }

      const attr = [
        {
          displayType: MarketplaceMetadataAttributeDisplayType.DATE,
          value: new Date(), // actual Data instance
          traitType: 'DoB',
        },
        {
          displayType: MarketplaceMetadataAttributeDisplayType.NUMBER,
          value: 42, // an actual JS number
          traitType: 'Level',
        },
        {
          displayType: MarketplaceMetadataAttributeDisplayType.STRING,
          value: '#ababab', // an arbitrary JS string
          traitType: 'Color',
        },
      ];

      let result: Result<
        PostAsyncResult,
        BroadcastingError | PendingSigningRequestError | UserRejectedError | WalletConnectionError
      >;

      if (image && photoMetaData) {
        const metadata = imageMetadata({
          appId: appId(lensProtocolAppId),
          locale: 'en',
          content,
          image: {
            item: getHttpDownloadUrl(config.ipfsGetURL, photoMetaData?.Hash),
            type: image?.type as MediaImageMimeType,
            altTag: image?.name,
          },
        });

        const metadataUrl = await uploadLens(config, metadata);

        result = await create({
          metadata: metadataUrl,
          actions: [
            {
              type: OpenActionType.SIMPLE_COLLECT,
              collectLimit: size,
              followerOnly: settings.canBeCollectedOnlyFollowers,
            },
          ],
        });
      } else {
        const metadata = textOnlyMetadata({
          appId: appId(lensProtocolAppId),
          locale: 'en',
          content,
        });

        const metadataUrl = await uploadLens(config, metadata);

        result = await create({
          metadata: metadataUrl,
        });
      }

      if (result.isSuccess()) {
        const completion = await result.value.waitForCompletion();
        if (completion.isSuccess()) {
          console.log(completion.value, 'jeheheheh');
          setCreatedPubId(completion.value.id);
          dispatchSetSubmissionState({
            activeStep: SubmitCampaignSteps.CheckAllowance,
            error: false,
          });
        }
        if (completion.isFailure()) {
          console.log('There was an processing the transaction', completion.error.message);
          dispatchSetSubmissionState({
            loading: false,
            activeStep: SubmitCampaignSteps.CreatePost,
            error: true,
          });
          return;
        }
      }
      if (result.isFailure()) {
        dispatchSetSubmissionState({
          loading: false,
          activeStep: SubmitCampaignSteps.CreatePost,
          error: true,
        });
      }
    } catch (e: any) {
      console.log(e, 'error in create post');
      dispatchSetSubmissionState({
        loading: false,
        activeStep: SubmitCampaignSteps.CreatePost,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatchSetSubmissionState, campaignJourney, config, create, setCreatedPubId]);

  return {
    ...createPostState,
    createdPubId,
    setCreatedPubId,
    allLoading: createPostState.loading || loading,
    imageLoading: loading,
    createLensPost,
  };
}
