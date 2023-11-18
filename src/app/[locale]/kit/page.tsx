'use client';

import React, {useState} from 'react';

import Button, {ButtonVariant} from '@forest-feed/components/kit/Button';
import TextArea from '@forest-feed/components/kit/TextArea';
import Uploader from '@forest-feed/components/kit/Uploader';
import Spacer from '@forest-feed/components/common/Spacer';
import ChangeLanguage from '@forest-feed/components/kit/ChangeLanguage';
import AnimatedPage from '@forest-feed/components/kit/Animated/AnimatedPage';
import Modal from '@forest-feed/components/kit/Modal/Modal';
import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {useI18n} from '@forest-feed/locales/client';

function KitPage() {
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const t = useI18n();

  return (
    <AnimatedPage>
      <h1>{t('hello')}</h1>
      <ChangeLanguage />
      <Button text={t('learnMore')} />
      <Button
        variant={ButtonVariant.menu}
        text={t('proceed')}
        onClick={() => showToast({title: 'hello', message: 'learnMore', translate: true, type: ToastType.info})}
      />
      <Button variant={ButtonVariant.text} text={t('proceed')} />

      <TextArea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('newCampaign.placeholder.writePost')}
      />

      <Uploader
        preview
        file={file}
        onChange={e => setFile(e.target?.files?.[0] || null)}
        onDrop={e => setFile(e.dataTransfer.files[0])}
      />
      <Button text={t('learnMore')} onClick={() => setShow(true)} />
      <Spacer />
      <Modal visible={show} onClose={() => setShow(false)}>
        test
      </Modal>
    </AnimatedPage>
  );
}

export default KitPage;
