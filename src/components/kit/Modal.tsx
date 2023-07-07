'use client';

import React, {ReactNode} from 'react';

import {RenderIf} from '@forest-feed/components/common/RenderIf';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal(props: ModalProps) {
  const {visible, onClose, children} = props;
  return (
    <RenderIf condition={visible}>
      <div className="fixed inset-0 bg-black/50 overflow-y-auto h-[100vh] w-full p-2 z-50">
        <button onClick={onClose}>x</button>
        {children}
      </div>
    </RenderIf>
  );
}
