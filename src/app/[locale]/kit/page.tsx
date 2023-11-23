'use client';

import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Hearts} from 'react-loader-spinner';

import {ButtonVariant} from '@forest-feed/components/kit/Button';

import {showToast, ToastType} from '@forest-feed/utils/showToast';
import {useI18n} from '@forest-feed/locales/client';

const Button = dynamic(() => import('@forest-feed/components/kit/Button'), {
  loading: () => <Hearts />,
  ssr: false,
});

const TextArea = dynamic(() => import('@forest-feed/components/kit/TextArea'), {
  loading: () => <Hearts />,
  ssr: false,
});

const Uploader = dynamic(() => import('@forest-feed/components/kit/Uploader'), {
  loading: () => <Hearts />,
  ssr: false,
});

const Spacer = dynamic(() => import('@forest-feed/components/common/Spacer'), {
  loading: () => <Hearts />,
  ssr: false,
});

const ChangeLanguage = dynamic(() => import('@forest-feed/components/kit/ChangeLanguage'), {
  loading: () => <Hearts />,
  ssr: false,
});

const AnimatedPage = dynamic(() => import('@forest-feed/components/kit/Animated/AnimatedPage'), {
  loading: () => <Hearts />,
  ssr: false,
});

const Modal = dynamic(() => import('@forest-feed/components/kit/Modal/Modal'), {
  loading: () => <Hearts />,
  ssr: false,
});

function KitPage() {
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const t = useI18n();

  return (
    <>
      Salam sobh bekheir
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
    </>
  );
}

export default KitPage;
