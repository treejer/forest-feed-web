'use client';

import React, {useRef} from 'react';

import {AnimatePresence, motion} from 'framer-motion';

import {Backdrop} from '@forest-feed/components/kit/Modal/Backdrop';
import {cn} from '@forest-feed/utils/tailwind';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.5,
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

export type ModalProps = React.PropsWithChildren<{
  visible: boolean;
  onClose?: () => void;
}>;

export function Modal(props: ModalProps) {
  const {visible, onClose, children} = props;

  const dragAreaRef = useRef(null);

  return (
    <AnimatePresence>
      {visible ? (
        <Backdrop onClick={onClose}>
          <motion.div
            key="modal"
            className={cn('h-full w-full flex justify-center items-center')}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={dragAreaRef}
          >
            <motion.div
              onClick={e => {
                e.stopPropagation();
              }}
              drag
              dragConstraints={dragAreaRef}
            >
              {children}
            </motion.div>
          </motion.div>
        </Backdrop>
      ) : null}
    </AnimatePresence>
  );
}
