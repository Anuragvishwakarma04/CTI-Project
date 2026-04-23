'use client';

import { useStore } from '@/store/useStore';
import { Bell, Car, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_car':
        return <Car className="w-6 h-6 text-blue-600" />;
      case 'price_drop':
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'status_update':
        return <CheckCircle className="w-6 h-6 text-purple-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markNotificationRead(notification.id)}
              className={`card p-6 cursor-pointer transition ${
                !notification.read ? 'bg-blue-50 border-l-4 border-primary-600' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-3 h-3 bg-primary-600 rounded-full flex-shrink-0"></div>
                )}
              </div>
              {notification.carId && (
                <Link
                  href={`/cars/${notification.carId}`}
                  className="mt-4 inline-block text-primary-600 font-semibold hover:underline"
                >
                  View Car →
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
