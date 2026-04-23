'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Car, Heart, ShoppingBag, Settings, LogOut, ChevronRight, Phone, Mail, Edit } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const router = useRouter();
  const { user, setUser } = useStore();

  const handleLogout = async () => {
    const token = auth.getToken();
    if (token) {
      await api.logout(token);
    }
    auth.clear();
    setUser(null);
    router.push('/');
  };

  const handleNavigation = (tab: string, path?: string) => {
    if (path) {
      router.push(path);
    } else if (onTabChange) {
      onTabChange(tab);
    } else {
      // If no onTabChange handler, navigate to dashboard with tab parameter
      router.push(`/dashboard?tab=${tab}`);
    }
  };

  return (
    <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit space-y-4">
      {/* User Profile Card */}
      <div className="card p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{user?.name}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{user?.phone}</span>
            </div>
            {user?.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
        <button onClick={() => router.push('/edit-profile')} className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Quick Menu</h3>
        <div className="space-y-1">
          <button onClick={() => handleNavigation('appointments')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
            activeTab === 'appointments' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
              activeTab === 'appointments' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-primary group-hover:text-white'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium text-sm ${
                activeTab === 'appointments' ? 'text-white' : 'text-gray-900'
              }`}>Appointments</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${
              activeTab === 'appointments' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
            }`} />
          </button>
          
          <button onClick={() => handleNavigation('listings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
            activeTab === 'listings' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
              activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-primary group-hover:text-white'
            }`}>
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium text-sm ${
                activeTab === 'listings' ? 'text-white' : 'text-gray-900'
              }`}>My Listings</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${
              activeTab === 'listings' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
            }`} />
          </button>
          
          <button onClick={() => handleNavigation('garage')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
            activeTab === 'garage' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
              activeTab === 'garage' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-primary group-hover:text-white'
            }`}>
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium text-sm ${
                activeTab === 'garage' ? 'text-white' : 'text-gray-900'
              }`}>My Garage</p>
              <p className={`text-xs ${
                activeTab === 'garage' ? 'text-white/80' : 'text-gray-500'
              }`}>Track your vehicles</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${
              activeTab === 'garage' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
            }`} />
          </button>
          
          {user?.user_type === 'customer' && (
            <button onClick={() => handleNavigation('favorites')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
              activeTab === 'favorites' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600 group-hover:bg-primary group-hover:text-white'
              }`}>
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${
                  activeTab === 'favorites' ? 'text-white' : 'text-gray-900'
                }`}>My Favorites</p>
              </div>
              <ChevronRight className={`w-4 h-4 ${
                activeTab === 'favorites' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
              }`} />
            </button>
          )}
          
          <button onClick={() => handleNavigation('bookings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
            activeTab === 'bookings' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
              activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600 group-hover:bg-primary group-hover:text-white'
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium text-sm ${
                activeTab === 'bookings' ? 'text-white' : 'text-gray-900'
              }`}>My Bookings</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${
              activeTab === 'bookings' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
            }`} />
          </button>
          
          <button onClick={() => handleNavigation('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
            activeTab === 'settings' ? 'bg-primary-600 text-white' : 'hover:bg-primary-50'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
              activeTab === 'settings' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary group-hover:text-white'
            }`}>
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium text-sm ${
                activeTab === 'settings' ? 'text-white' : 'text-gray-900'
              }`}>Settings</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${
              activeTab === 'settings' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
            }`} />
          </button>
        </div>
      </div>

      <div className="card p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-white/50 rounded-lg transition group">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-danger text-danger group-hover:text-white transition">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm text-danger">Logout</p>
            <p className="text-xs text-red-600">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
