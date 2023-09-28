'use client';

import React, {useCallback, useMemo, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'use-intl';

import {AttachIcon} from '@forest-feed/components/kit/Icons/AttachIcon';
import {DeleteIcon} from '@forest-feed/components/kit/Icons/DeleteIcon';
import {Modal} from '@forest-feed/components/kit/Modal/Modal';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {colors} from 'colors';

export type UploaderProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDetach?: () => void;
  onBlur?: () => void;
  preview?: boolean;
  file: File | null;
  disabled?: boolean;
  accept?: string;
};

export function Uploader(props: UploaderProps) {
  const {preview, file, disabled, accept, onChange, onDrop, onBlur, onDetach} = props;

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const t = useTranslations('newCampaign');

  const previewFile = useMemo(() => (file ? URL.createObjectURL(file as Blob) : ''), [file]);

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!disabled) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
          setDragActive(true);
        } else if (e.type === 'dragleave') {
          setDragActive(false);
        }
      }
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!disabled) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onDrop(e);
        }
      }
    },
    [disabled, onDrop],
  );

  return (
    <>
      <Modal visible={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
        <Image
          className="rounded-sm mr-2"
          key="image-in-modal"
          draggable={false}
          src={previewFile}
          alt="preview-photo"
          width={800}
          height={900}
        />
      </Modal>
      <div
        onDragEnter={handleDrag}
        className={`border border-border ${
          dragActive && 'border-dashed'
        } h-[88px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow hover:shadow-lg`}
      >
        <RenderIf condition={!!previewFile && !preview && !!onDetach}>
          <button type="button" onClick={onDetach}>
            <DeleteIcon />
          </button>
          <Spacer />
        </RenderIf>
        <RenderIf condition={!!previewFile}>
          <Image
            className="rounded-sm mr-2 max-h-[70px]"
            key="image-in-box"
            src={previewFile}
            alt="preview-photo"
            width={90}
            height={70}
            onClick={() => setOpenPreviewModal(true)}
          />
        </RenderIf>
        <label className="flex items-center cursor-pointer" htmlFor="file-uploader">
          <input
            disabled={disabled}
            className="hidden"
            id="file-uploader"
            type="file"
            accept={accept || 'image/gif, image/png, image/jpeg, image/webp'}
            onChange={onChange}
            onBlur={onBlur}
            multiple={false}
          />
          <RenderIf condition={!preview}>
            <AttachIcon color={colors.primaryGreen} />
          </RenderIf>
          <p className="text-secondary md:text-lg font-medium ml-1 text-sm">
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
    </>
  );
}
