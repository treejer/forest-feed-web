'use client';

import React, {useMemo} from 'react';
import Image from 'next/image';
import {useTranslations} from 'use-intl';

import {AttachIcon} from '@forest-feed/components/kit/Icons/AttachIcon';
import {DeleteIcon} from '@forest-feed/components/kit/Icons/DeleteIcon';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {colors} from 'colors';

export type UploaderProps = {
  preview: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file?: File | null;
};

export function Uploader(props: UploaderProps) {
  const {preview, file, onChange} = props;

  const t = useTranslations('newCampaign');

  const previewFile = useMemo(() => (file ? URL.createObjectURL(file as Blob) : ''), [file]);

  return (
    <label
      htmlFor="file-uploader"
      className="border border-border h-[88px] rounded-lg flex items-center justify-center cursor-pointer relative"
    >
      <RenderIf condition={!!previewFile}>
        <Image className="-z-[1]" src={previewFile} alt="preview-photo" fill={true} objectFit="contain" />
      </RenderIf>
      <input className="hidden" id="file-uploader" type="file" onChange={onChange} />
      {preview ? <DeleteIcon /> : <AttachIcon color={colors.primaryGreen} />}
      <p className="text-secondary text-lg font-medium ml-1">
        <span className="text-primaryGreen">{t(preview ? 'attachedPhoto' : 'addPhoto')}</span>{' '}
        <RenderIf condition={!preview}>{t('dropPhoto')}</RenderIf>
      </p>
    </label>
  );
}
