import React, {useCallback, useEffect, useMemo} from 'react';

import {ProfileId, useActiveProfile, useActiveProfileSwitch, useProfilesOwnedByMe} from '@lens-protocol/react-web';

import {DropDown, DropDownItem} from '@forest-feed/components/kit/DropDown';
import {SkeletonBox} from '@forest-feed/components/layout/AppHeaderSkeleton';
import {Color} from 'colors';
import {useDebounce} from '@forest-feed/hooks/useDebounce';

export function SwitchProfile() {
  const {data: lensProfile} = useActiveProfile();
  const {data: profiles, loading: profilesLoading, hasMore, next} = useProfilesOwnedByMe();
  const {execute: switchProfile} = useActiveProfileSwitch();

  const debouncedProfiles = useDebounce(profiles);
  // useEffect(() => {
  //   if (hasMore) {
  //     (async () => {
  //       await next();
  //     })();
  //   }
  // }, [debouncedProfiles]);

  const profilesList = useMemo(
    () =>
      debouncedProfiles?.map(
        (profile): DropDownItem => ({
          id: profile.id,
          text: `@${profile.handle}`,
        }),
      ),
    [debouncedProfiles],
  );

  const currentProfile = useMemo(
    () => profilesList?.find(profile => profile.id === lensProfile?.id),
    [lensProfile?.id, profilesList],
  );

  const handleSwitchProfile = useCallback(
    async (item: DropDownItem) => {
      await switchProfile(item.id as ProfileId);
    },
    [switchProfile],
  );

  return profilesLoading ? (
    <SkeletonBox width={160} />
  ) : profilesList?.length ? (
    <DropDown
      selected={currentProfile!}
      items={profilesList}
      onChange={handleSwitchProfile}
      bgColor={Color.primaryBg}
      activeColor={Color.green}
      shadow={false}
      width="40"
    />
  ) : null;
}
