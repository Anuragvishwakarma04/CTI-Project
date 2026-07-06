'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { notificationApi } from '@/lib/api';
import { Notification } from '@/types';
import { Bell, User, LogOut, X, Clock, Check, Search, ChevronDown, Settings, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LocationSelector from '@/components/location/LocationSelector';
import CarLoan from '@/components/Inquiry/CarLoan'
import Insurance from '@/components/Inquiry/CarInsurance'
import { getDashboardRoute } from '@/utils/getDashboardRoute';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (showNotifications && user) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await notificationApi.getAll();
      if (response.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await notificationApi.markAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await notificationApi.delete(id);
      if (response.success) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notification && !notification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const navLinkClass = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(href + '/');
    return isActive
      ? 'text-primary border-b-2 border-primary '
      : ' hover:text-primary border-b-2 border-transparent text-black';
  };

  const isDealerPage = pathname?.startsWith('/dealer/');
  const isSellerType = (user?.user_type || user?.role) === 'showroom';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="relative w-[200px] h-[45px] sm:w-[250px] sm:h-[55px]">
                <Image
                  src={'/Hero-image/logo1.jpeg'}
                  alt="Car Trust India"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            <div className="flex-1 max-w-2xl mx-4 sm:mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars, brands, models..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.user_type || user.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
                    </button>

                    {showProfileMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-2rem)]  lg:w-72 md:w-72 lg:right-[-2px] sm:w-72 bg-white rounded-lg shadow-xl border z-50">
                          <div className="p-4 border-b bg-gray-50">
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email || user.phone || user.mobile}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary text-xs rounded capitalize">
                              {user.user_type || user.role}
                            </span>
                          </div>
                          <div className="py-2">
                            <Link
                              href={getDashboardRoute(user?.user_type || user?.role)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Dashboard</span>
                            </Link>
                            <Link
                              href="/edit-profile"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Settings className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Settings</span>
                            </Link>
                          </div>
                          <div className="border-t py-2">
                            <button
                              onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-danger"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm font-semibold">Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/login" className="btn-primary text-sm px-6 py-2.5">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cars, brands, models..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200">
          {!isDealerPage && !isSellerType && (
            <div className=" border-gray-200 ">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center space-x-4 sm:space-x-8 h-12">
                  <LocationSelector />
                  <Link href="/cars" className={`${navLinkClass('/cars')}`}>Buy Cars</Link>
                  <Link href="/dealers" className={navLinkClass('/dealers')}>Dealers</Link>
                  <Link href="/services" className={navLinkClass('/services')}>Services</Link>
                  <Link href="/warranty" className={navLinkClass('/warranty')}>Warranty</Link>
                  <CarLoan />
                  <Insurance />
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        className={`p-4 hover:bg-gray-50 transition cursor-pointer group ${!notification.is_read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type.includes('appointment') ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'new_car' ? 'bg-green-100 text-green-600' :
                                notification.type === 'price_drop' ? 'bg-orange-100 text-orange-600' :
                                  'bg-gray-100 text-gray-600'
                            }`}>
                            <Bell className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 mb-1">{notification.title}</p>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            {notification.data && (
                              <div className="text-xs text-gray-500 mb-2">
                                {notification.data.customer_name && (
                                  <span>Customer: {notification.data.customer_name}</span>
                                )}
                                {notification.data.vehicle_id && (
                                  <span className="ml-2">Vehicle: {notification.data.vehicle_id}</span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(notification.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="p-1 hover:bg-red-50 rounded text-red-600 opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bell className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No notifications</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && unreadCount > 0 && (
                <div className="p-4 border-t">
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
