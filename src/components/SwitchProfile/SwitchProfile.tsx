// import React, {useCallback, useMemo} from 'react';
//
// import {
//   ProfileId,
//   use,
//   useProfiles,
// } from '@lens-protocol/react-web';
//
// import {DropDown, DropDownItem} from '@forest-feed/components/kit/DropDown';
// import {SkeletonBox} from '@forest-feed/components/layout/AppHeaderSkeleton';
// import {Color} from 'colors';
// import {useDebounce} from '@forest-feed/hooks/useDebounce';
// import {useCampaignJourney} from '@forest-feed/redux/module/campaignJourney/campaignJourney.slice';
// import {useAccount} from 'wagmi';
//
// export function SwitchProfile() {
//   const {address} = useAccount();
//   const {data: profiles} = useProfiles({
//     where: {
//       ownedBy: [address!],
//     },
//   });
//   const {execute: switchProfile, isPending} = useActiveProfileSwitch();
//
//   const {campaignJourney} = useCampaignJourney();
//
//   const debouncedProfiles = useDebounce(profiles);
//
//   const profilesList = useMemo(
//     () =>
//       debouncedProfiles?.map(
//         (profile): DropDownItem => ({
//           id: profile.id,
//           text: `@${profile.handle}`,
//         }),
//       ),
//     [debouncedProfiles],
//   );
//
//   const currentProfile = useMemo(
//     () => profilesList?.find(profile => profile.id === lensProfile?.id),
//     [lensProfile?.id, profilesList],
//   );
//
//   const handleSwitchProfile = useCallback(
//     async (item: DropDownItem) => {
//       await switchProfile(item.id as ProfileId);
//     },
//     [switchProfile],
//   );
//
//   return profilesLoading ? (
//     <SkeletonBox width="100%" height={36} />
//   ) : profilesList?.length ? (
//     <DropDown
//       selected={currentProfile!}
//       items={profilesList}
//       onChange={handleSwitchProfile}
//       bgColor={Color.primaryBg}
//       activeColor={Color.green}
//       shadow={false}
//       className="w-full"
//       disabled={isPending || campaignJourney.submissionLoading}
//     />
//   ) : null;
// }
