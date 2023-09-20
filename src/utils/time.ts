export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function diffTimeInSec(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / 1000;
}

export function checkTime(deadline: number, unit: number, percent?: number) {
  const current = deadline - Date.now();

  const time = Math.floor(current / unit);

  return percent ? (time % percent <= 0 ? 0 : time % percent) : time <= 0 ? 0 : time;
}
