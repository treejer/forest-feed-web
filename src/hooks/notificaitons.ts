import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {selectNotifications} from '@forest-feed/redux/selectors';
import {useCallback} from 'react';
import {dismissNotification as dismissNotify, notify, NewNotification} from 'reapop';

export function useNotification() {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  const dismissNotification = useCallback(
    (id: string) => {
      dispatch(dismissNotify(id));
    },
    [dispatch],
  );

  const showNotification = useCallback(
    (notification: NewNotification) => {
      dispatch(notify(notification));
    },
    [dispatch],
  );

  return {
    notifications,
    showNotification,
    dismissNotification,
  };
}
