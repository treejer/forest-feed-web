import React from 'react';

import {motion} from 'framer-motion';

export type AnimatedPageProps = React.PropsWithChildren<{
  className?: string;
}>;

export function AnimatedPage(props: AnimatedPageProps) {
  const {children, className} = props;

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1, rotate: [0, 3, -3, 0]}}
      transition={{duration: 0.5}}
      className={className}
    >
      {children}
    </motion.div>
  );
}
