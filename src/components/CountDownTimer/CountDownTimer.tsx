import React, {useEffect, useMemo, useRef, useState} from 'react';

import moment from 'moment/moment';

import {checkTime, DAY, diffTimeInSec, HOUR, MINUTE, SECOND} from '@forest-feed/utils/time';
import cn from '@forest-feed/utils/tailwind';

export type CountDownTimerProps = {
  start?: string;
  deadline: number;
  onEndTime: () => void;
};

export type TimeState = {
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function CountDownTimer(props: CountDownTimerProps) {
  const {start, deadline, onEndTime} = props;

  const diffSec = useMemo(() => {
    if (start) {
      const diff = Math.floor(deadline - diffTimeInSec(start, moment().toDate().toString()));
      if (diff > 0) return diff;
      else return 0;
    } else {
      return deadline;
    }
  }, [start, deadline]);

  const parsedDeadline = useMemo(() => Date.parse(moment().add(diffSec, 'seconds').toString()), [diffSec]);

  const [time, setTime] = useState<TimeState>({
    day: (parsedDeadline - Date.now()) / DAY,
    hours: ((parsedDeadline - Date.now()) / HOUR) % 24,
    minutes: ((parsedDeadline - Date.now()) / MINUTE) % 60,
    seconds: ((parsedDeadline - Date.now()) / SECOND) % 60,
  });
  const [hideCounter, setHideCounter] = useState({
    day: false,
    hours: false,
  });

  const interval = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const mountTime = parsedDeadline - Date.now();
    interval.current = setInterval(() => {
      setTime({
        day: checkTime(parsedDeadline, DAY),
        hours: checkTime(parsedDeadline, HOUR, 24),
        minutes: checkTime(parsedDeadline, MINUTE, 60),
        seconds: checkTime(parsedDeadline, SECOND, 60),
      });
    }, 1000);
    setHideCounter({
      day: Math.floor(mountTime / DAY) <= 0,
      hours: Math.floor(mountTime / HOUR) % 24 <= 0,
    });
    return () => {
      if (interval?.current) {
        clearInterval(interval?.current);
      }
    };
  }, [parsedDeadline]);

  useEffect(() => {
    if (Object.values(time).every(item => item === 0)) {
      if (interval.current) clearInterval(interval.current);
      onEndTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div>
      <div className={cn('flex items-center')}>
        {Object.entries(time).map(([label, value]) => {
          return hideCounter[label] ? null : (
            <React.Fragment key={label}>
              <div className={cn('col-4 flex items-center')}>
                <div>
                  <p className={cn('text-white')}>{`${Math.floor(value)}`.padStart(2, '0')}</p>
                </div>
              </div>
              <span className={cn('last:hidden mx-0.5')}>:</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
