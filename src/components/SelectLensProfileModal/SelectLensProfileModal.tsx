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

  return (
    <Modal
      visible={visible}
      onClose={() => {
        console.log('closed clicked');
      }}
    >
      <div className="bg-primaryBg p-5 rounded-[8px] shadow-2xl w-screen max-w-lg">
        <h3 className="mb-3 text-xl">{t('selectLensProfile.title')}</h3>
        <ul className="mb-2">
          {loading
            ? Array(2)
                .fill(2)
                .map((_, index) => <LensProfileItemSkeleton key={index} />)
            : profiles?.map(profile => (
                <LensProfileItem
                  key={profile.id}
                  profile={profile}
                  disabled={loginLoading}
                  loading={loginLoading && selectedProfileId === profile.id}
                  onClick={() => handleSelectLensProfile(profile.id)}
                />
              ))}
        </ul>
        <div className="flex jusify-end">
          <Button
            text={t('cancel')}
            variant={ButtonVariant.secondary}
            onClick={handleCancelSelectProfile}
            disabled={loginLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
