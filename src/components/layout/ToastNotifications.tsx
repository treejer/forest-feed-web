import React from 'react';

import NotificationsSystem, {setUpNotifications, atalhoTheme} from 'reapop';

import {useNotification} from '@forest-feed/hooks/notificaitons';

setUpNotifications({
  defaultProps: {
    position: 'bottom-center',
    dismissible: true,
    showDismissButton: true,
  },
});

export function ToastNotifications() {
  const {notifications, dismissNotification} = useNotification();

  return (
    <NotificationsSystem
      notifications={notifications}
      dismissNotification={id => dismissNotification(id)}
      theme={atalhoTheme}
    />
  );
}
