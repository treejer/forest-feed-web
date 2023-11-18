import {useCallback} from 'react';

import {ProfileId, useProfiles} from '@lens-protocol/react-web';
import {useDisconnect} from 'wagmi';

import {useWeb3} from '@forest-feed/redux/module/web3/web3.slice';
import {useI18n} from '@forest-feed/locales/client';
import {useAuthLens} from '@forest-feed/hooks/useAuthLens';
import {Modal} from '@forest-feed/components/kit/Modal/Modal';
import {LensProfileItem} from '@forest-feed/components/SelectLensProfileModal/LensProfileItem';
import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {LensProfileItemSkeleton} from '@forest-feed/components/SelectLensProfileModal/LensProfileItemSkeleton';
import {Logo} from '@forest-feed/components/kit/Icons/LogoIcon';
import {cn} from '@forest-feed/utils/tailwind';

export type SelectLensProfileModalProps = {
  visible: boolean;
};

export function SelectLensProfileModal(props: SelectLensProfileModalProps) {
  const {visible} = props;

  const {handleLensLogin, loginLoading} = useAuthLens();
  const {
    web3: {address, selectedProfileId},
    dispatchSetSelectedProfileId,
    dispatchRemoveSelectedProfileId,
    dispatchSetShowSelectProfile,
  } = useWeb3();

  const {data: profiles, loading} = useProfiles({
    where: {
      ownedBy: [address as `0x${string}`],
    },
  });

  const t = useI18n();

  const {disconnectAsync} = useDisconnect();

  const handleSelectLensProfile = useCallback(
    async (profileId: ProfileId) => {
      try {
        dispatchSetSelectedProfileId(profileId);
        await handleLensLogin(profileId);
        dispatchSetShowSelectProfile(false);
      } catch (e: any) {
        dispatchRemoveSelectedProfileId();
      }
    },
    [dispatchRemoveSelectedProfileId, dispatchSetSelectedProfileId, handleLensLogin, dispatchSetShowSelectProfile],
  );

  const handleCancelSelectProfile = useCallback(async () => {
    try {
      dispatchSetShowSelectProfile(false);
      await disconnectAsync();
    } catch (e: any) {
      console.log(e, 'error in dispatchSetShowSelectProfile');
    }
  }, [disconnectAsync, dispatchSetShowSelectProfile]);

  const renderProfiles = useCallback(() => {
    if (loading) {
      return Array.from(Array(2).keys()).map((_, index) => <LensProfileItemSkeleton key={index} />);
    }
    if (!profiles || profiles.length === 0) {
      return <p className={cn('text-error text-center')}>{t('selectLensProfile.emptyList')}</p>;
    } else {
      return profiles?.map(profile => (
        <LensProfileItem
          key={profile.id}
          profile={profile}
          disabled={loginLoading}
          loading={loginLoading && selectedProfileId === profile.id}
          onClick={() => handleSelectLensProfile(profile.id)}
        />
      ));
    }
  }, [t, handleSelectLensProfile, loading, loginLoading, profiles, selectedProfileId]);

  return (
    <Modal visible={visible}>
      <div className={cn('bg-primaryBg p-5 rounded-[8px] shadow-2xl w-screen max-w-lg')}>
        <div className={cn('flex items-center justify-between mb-3')}>
          <h3 className={cn('text-2xl')}>{t('selectLensProfile.title')}</h3>
          <Logo small />
        </div>
        <ul className={cn('mb-2')}>{renderProfiles()}</ul>
        <div className={cn('flex justify-end')}>
          <Button
            text={t('close')}
            variant={ButtonVariant.menu}
            onClick={handleCancelSelectProfile}
            disabled={loginLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
