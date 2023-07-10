'use client';

import React, {useCallback, useMemo, useState} from 'react';
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
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  file?: File | null;
};

export function Uploader(props: UploaderProps) {
  const {preview, file, onChange, onDrop} = props;

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const t = useTranslations('newCampaign');

  const previewFile = useMemo(() => (file ? URL.createObjectURL(file as Blob) : ''), [file]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onDrop(e);
      }
    },
    [onDrop],
  );

  return (
    <div
      onDragEnter={handleDrag}
      className={`border border-border ${
        dragActive && 'border-dashed'
      } h-[88px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden`}
    >
      <RenderIf condition={!!previewFile}>
        <Modal visible={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
          <div className="flex justify-center items-center h-full">
            <Image className="rounded-sm mr-2" src={previewFile} alt="preview-photo" width={500} height={400} />
          </div>
        </Modal>
        <Image
          className="rounded-sm mr-2 max-h-[70px]"
          src={previewFile}
          alt="preview-photo"
          width={90}
          height={70}
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
      <RenderIf condition={dragActive}>
        <div
          className="absolute inset-0"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      </RenderIf>
    </div>
  );
}
