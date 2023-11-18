import React from 'react';

import {motion} from 'framer-motion';

import Spacer from '@forest-feed/components/common/Spacer';
import cn from '@forest-feed/utils/tailwind';

export type AnimatedPageProps = React.PropsWithChildren<{
  className?: string;
}>;

export default function AnimatedPage(props: AnimatedPageProps) {
  const {children, className} = props;

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1, rotate: [0, 3, -3, 0]}}
      transition={{duration: 0.5}}
      className={cn('px-2', className)}
    >
      {children}
      <div className={cn('lg:hidden')}>
        <Spacer times={8} />
      </div>
    </motion.div>
  );
}
