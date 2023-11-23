import React from 'react';

export type SpacerProps = {
  times?: number;
};

export default function Spacer(props: SpacerProps) {
  const {times = 1} = props;

  return <div style={{padding: 4 * times}} />;
}
