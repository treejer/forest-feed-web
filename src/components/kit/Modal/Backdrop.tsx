import React from 'react';

import {motion} from 'framer-motion';

export type BackdropProps = React.PropsWithChildren<{
  onClick: () => void;
}>;

export function Backdrop(props: BackdropProps) {
  const {onClick, children} = props;

  return (
    <motion.div className="fixed inset-0 bg-black/50 overflow-y-auto h-[100vh] p-2 z-50" onClick={onClick}>
      {children}
    </motion.div>
  );
}
