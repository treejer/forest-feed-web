import React from 'react';

import {motion} from 'framer-motion';

export type BackdropProps = React.PropsWithChildren<{
  onClick: () => void;
}>;

export function Backdrop(props: BackdropProps) {
  const {onClick, children} = props;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{
        duration: 0.5,
      }}
      className="fixed inset-0 bg-black/50 overflow-y-auto h-[100vh] p-2 z-50"
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}