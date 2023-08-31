import React from 'react';

import {motion} from 'framer-motion';

import {Spacer} from '@forest-feed/components/common/Spacer';

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
      className={`px-2 ${className}`}
    >
      {children}
      <div className="md:hidden">
        <Spacer times={8} />
      </div>
    </motion.div>
  );
}
