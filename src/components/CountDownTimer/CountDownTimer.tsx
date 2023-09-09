import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export type CountDownTimerProps = {
  deadline: string;
  onEndTime: () => void;
};

export type TimeState = {
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function CountDownTimer(props: CountDownTimerProps) {
  const {deadline, onEndTime} = props;

  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
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

  const checkTime = useCallback(
    (unit: number, percent?: number) => {
      const current = parsedDeadline - Date.now();

      const time = Math.floor(current / unit);

      return percent ? (time % percent <= 0 ? 0 : time % percent) : time <= 0 ? 0 : time;
    },
    [parsedDeadline],
  );

  useEffect(() => {
    const mountTime = parsedDeadline - Date.now();
    interval.current = setInterval(() => {
      setTime({
        day: checkTime(DAY),
        hours: checkTime(HOUR, 24),
        minutes: checkTime(MINUTE, 60),
        seconds: checkTime(SECOND, 60),
      });
    }, 1000);
    setHideCounter({
      day: Math.floor(mountTime / DAY) === 0,
      hours: Math.floor(mountTime / HOUR) % 24 === 0,
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
  }, [time]);

  return (
    <div>
      <div className="flex items-center">
        {Object.entries(time).map(([label, value]) => {
          return hideCounter[label] ? null : (
            <React.Fragment key={label}>
              <div className="col-4 flex items-center">
                <div>
                  <p className="text-white">{`${Math.floor(value)}`.padStart(2, '0')}</p>
                </div>
              </div>
              <span className="last:hidden mx-0.5">:</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
