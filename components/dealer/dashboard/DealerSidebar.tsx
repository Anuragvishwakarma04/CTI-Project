'use client';

import { useRouter } from 'next/navigation';
import { Home, Car, Calendar, Gavel, DollarSign, Users, LogOut, ChevronRight, List, Plus } from 'lucide-react';
import { api, auth } from '@/lib/api';
import { useStore } from '@/store/useStore';

interface DealerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType: 'dealer' | 'showroom';
}

export default function DealerSidebar({ activeSection, onSectionChange, userType }: DealerSidebarProps) {
  const router = useRouter();
  const { setUser } = useStore();

  const handleLogout = async () => {
    const token = auth.getToken();
    if (token) {
      await api.logout(token);
    }
    auth.clear();
    setUser(null);
    router.push('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, bgColor: 'bg-blue-100', textColor: 'text-blue-600', show: true },
    { id: 'inventory', label: 'Inventory', icon: Car, bgColor: 'bg-green-100', textColor: 'text-green-600', show: userType !== 'showroom' },
    { id: 'listings', label: 'Listings', icon: List, bgColor: 'bg-green-100', textColor: 'text-green-600', show: userType === 'showroom' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, bgColor: 'bg-blue-100', textColor: 'text-blue-600', show: true },
    { id: 'auctions', label: 'Auctions', icon: Gavel, bgColor: 'bg-amber-100', textColor: 'text-amber-600', show: true },
    { id: 'sales', label: 'Sales', icon: DollarSign, bgColor: 'bg-purple-100', textColor: 'text-purple-600', show: userType !== 'showroom' },
    { id: 'customers', label: 'Customers', icon: Users, bgColor: 'bg-orange-100', textColor: 'text-orange-600', show: userType !== 'showroom' },
  ];

  return (
    <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit space-y-4">
      <div className="card p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          {userType === 'showroom' ? 'Showroom Menu' : 'Dealer Menu'}
        </h3>
        <div className="space-y-1">
          {menuItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-primary-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : `${item.bgColor} ${item.textColor} group-hover:bg-primary group-hover:text-white`
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                }`} />
              </button>
            );
          })}

          {userType === 'showroom' && (
            <button
              onClick={() => router.push('/dealer/add-vehicle')}
              className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 rounded-lg transition group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-primary text-blue-600 group-hover:text-white transition">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm text-gray-900">Add Listing</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
            </button>
          )}
        </div>
      </div>

      <div className="card p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-white/50 rounded-lg transition group">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-danger text-danger group-hover:text-white transition">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm text-danger">Logout</p>
            <p className="text-xs text-red-600">Sign out</p>
          </div>
        </button>
      </div>
    </div>
  );
}
