import React from 'react';

import {AnimatePresence, motion} from 'framer-motion';

export type ExitBeforeEnterProps = React.PropsWithChildren<{
  animateKey?: string;
}>;

export function ExitBeforeEnter(props: ExitBeforeEnterProps) {
  const {animateKey, children} = props;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animateKey || 'empty'}
        initial={{y: -10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: 10, opacity: 0}}
        transition={{duration: 0.2}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
