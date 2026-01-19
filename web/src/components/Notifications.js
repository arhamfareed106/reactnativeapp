import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    getNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotification();

  useEffect(() => {
    getNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'shift_request':
        return 'schedule';
      case 'shift_approval':
        return 'check_circle';
      case 'shift_rejection':
        return 'cancel';
      case 'shift_reminder':
        return 'event_note';
      case 'subscription_expiry':
        return 'warning';
      case 'training_completed':
        return 'school';
      case 'payment_success':
        return 'payments';
      default:
        return 'notifications';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'shift_request':
        return 'border-blue-200 bg-blue-50';
      case 'shift_approval':
        return 'border-green-200 bg-green-50';
      case 'shift_rejection':
        return 'border-red-200 bg-red-50';
      case 'subscription_expiry':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) return <div className="p-4 text-center">Loading notifications...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{unreadCount} unread</span>
            <button
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded m-4">
          {error}
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 ${getNotificationClass(notification.type)} ${
                !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <span className="material-symbols-outlined text-gray-500">
                    {getNotificationIcon(notification.type)}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center">
                    {!notification.isRead && (
                      <button
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;