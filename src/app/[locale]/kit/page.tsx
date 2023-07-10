'use client';

import React, {useState} from 'react';
import {useTranslations} from 'use-intl';

import {Button, ButtonVariant} from '@forest-feed/components/kit/Button';
import {TextArea} from '@forest-feed/components/kit/TextArea';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {ChangeLanguage} from '@forest-feed/components/kit/ChangeLanguage';
import {Modal} from '@forest-feed/components/kit/Modal';

function KitPage() {
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations();

  return (
    <div>
      <h1>{t('hello')}</h1>
      <ChangeLanguage />
      <Button text={t('learnMore')} />
      <Button variant={ButtonVariant.menu} text={t('proceed')} />
      <Button variant={ButtonVariant.text} text={t('proceed')} />

      <TextArea
        value={text}
        onChange={e => setText(e.target.value)}
        label={t('newCampaign.content')}
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
    </div>
  );
}

export default KitPage;
