'use client';

import React, {Children, useMemo, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'use-intl';

import {AttachIcon} from '@forest-feed/components/kit/Icons/AttachIcon';
import {DeleteIcon} from '@forest-feed/components/kit/Icons/DeleteIcon';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Modal} from '@forest-feed/components/kit/Modal';
import {colors} from 'colors';

export type UploaderProps = {
  preview: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file?: File | null;
};

export function Uploader(props: UploaderProps) {
  const {preview, file, onChange} = props;

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const t = useTranslations('newCampaign');

  const previewFile = useMemo(() => (file ? URL.createObjectURL(file as Blob) : ''), [file]);

  const handleDrop = (e: any) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div className="border border-border h-[88px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
      <RenderIf condition={!!previewFile}>
        <Modal visible={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
          <div className="flex justify-center items-center h-full">
            <Image className="rounded-sm mr-2" src={previewFile} alt="preview-photo" width={500} height={400} />
          </div>
        </Modal>
        <Image
          className="rounded-sm mr-2"
          src={previewFile}
          alt="preview-photo"
          width={120}
          height={120}
          onClick={() => setOpenPreviewModal(true)}
        />
      </RenderIf>
      <label className="flex items-center cursor-pointer" htmlFor="file-uploader">
        <input className="hidden" id="file-uploader" type="file" onChange={onChange} />
        {preview ? <DeleteIcon /> : <AttachIcon color={colors.primaryGreen} />}
        <p className="text-secondary text-lg font-medium ml-1">
          <span className="text-primaryGreen">
            {t(preview ? 'attachedPhoto' : previewFile ? 'changePhoto' : 'addPhoto')}
          </span>{' '}
          <RenderIf condition={!preview}>{t('dropPhoto')}</RenderIf>
        </p>
      </label>
    </div>
  );
}
