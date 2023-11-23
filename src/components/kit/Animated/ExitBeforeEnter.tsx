import React from 'react';

import {AnimatePresence, motion} from 'framer-motion';

export type ExitBeforeEnterProps = React.PropsWithChildren<{
  animateKey?: string;
  initial?: boolean;
  direction?: 'x' | 'y';
}>;

export default function ExitBeforeEnter(props: ExitBeforeEnterProps) {
  const {animateKey, direction = 'y', initial = true, children} = props;

  return (
    <AnimatePresence mode="wait" initial={initial}>
      <motion.div
        key={animateKey || 'empty'}
        initial={{[direction]: -15, opacity: 0}}
        animate={{[direction]: 0, opacity: 1}}
        exit={{[direction]: 50, opacity: 0}}
        transition={{duration: 0.2}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
