import React, { memo, useEffect } from 'react';

const Notification = memo(({ updateShowNotification, showNotification }: any) => {
  useEffect(() => {
    setTimeout(() => updateShowNotification(''), 3000);
  }, [showNotification, updateShowNotification]);

  return <div className="notification">{showNotification}</div>;
});

Notification.displayName = 'Notification';

export default Notification;
