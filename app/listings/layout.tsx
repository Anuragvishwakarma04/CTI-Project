'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { auth } from '@/lib/api';
import { Bell, User, LogOut, X, Clock, Check, Search, ChevronDown, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, notifications } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const isSellerType = user?.user_type === 'dealer' || user?.user_type === 'showroom';

  useEffect(() => {
    const savedUser = auth.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, [setUser]);

  const handleLogout = () => {
    auth.clear();
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">C</span>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Car Trust India</span>
            </Link>

            <div className="flex items-center gap-3">
              {user && (
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
                        <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
                    </button>
                    
                    {showProfileMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                          <div className="p-4 border-b bg-gray-50">
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email || user.phone}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary text-xs rounded capitalize">
                              {user.user_type}
                            </span>
                          </div>
                          <div className="py-2">
                            <Link 
                              href={isSellerType ? '/dealer/dashboard' : '/dashboard'} 
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
              )}
            </div>
          </div>
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
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'new_car' ? 'bg-blue-100' :
                            notification.type === 'price_drop' ? 'bg-green-100' :
                            notification.type === 'status_update' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <Bell className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{notification.title}</p>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          )}
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

              {notifications.length > 0 && (
                <div className="p-4 border-t">
                  <button className="w-full btn-secondary flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}
