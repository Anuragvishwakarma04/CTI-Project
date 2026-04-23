'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { Store, Car, Gavel, TrendingUp, Calendar, Home, ChevronRight, LogOut, List, Plus, Users } from 'lucide-react';

export default function ShowroomDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/showroom/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('Failed to fetch dashboard data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    auth.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { showroom, counts, appointments } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit space-y-4">
            <div className="card p-4">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Showroom Menu</h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveSection('overview')} 
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
                    activeSection === 'overview' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    activeSection === 'overview' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${
                      activeSection === 'overview' ? 'text-white' : 'text-gray-900'
                    }`}>Dashboard</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    activeSection === 'overview' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                  }`} />
                </button>

                <button
                  onClick={() => setActiveSection('listings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
                    activeSection === 'listings' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    activeSection === 'listings' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <List className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${
                      activeSection === 'listings' ? 'text-white' : 'text-gray-900'
                    }`}>Listings</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    activeSection === 'listings' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                  }`} />
                </button>

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

                <button 
                  onClick={() => setActiveSection('auctions')} 
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
                    activeSection === 'auctions' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    activeSection === 'auctions' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${
                      activeSection === 'auctions' ? 'text-white' : 'text-gray-900'
                    }`}>Auctions</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    activeSection === 'auctions' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                  }`} />
                </button>

                <button 
                  onClick={() => setActiveSection('appointments')} 
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${
                    activeSection === 'appointments' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    activeSection === 'appointments' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${
                      activeSection === 'appointments' ? 'text-white' : 'text-gray-900'
                    }`}>Appointments</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    activeSection === 'appointments' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
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
                  <p className="text-xs text-red-600">Sign out</p>
                </div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Header */}
            {activeSection === 'overview' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{showroom.name}</h1>
                    <p className="text-gray-600">Dealer Code: {showroom.dealer_code}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Listings</p>
                      <p className="text-3xl font-bold text-gray-900">{counts.listings}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Auctions</p>
                      <p className="text-3xl font-bold text-gray-900">{counts.auctions}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Gavel className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Sold Auctions</p>
                      <p className="text-3xl font-bold text-green-600">{counts.sold_auctions}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Not Sold</p>
                      <p className="text-3xl font-bold text-orange-600">{counts.not_sold_auctions}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Gavel className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Section */}
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-gray-900">Today's Appointments</h2>
                  </div>
                  {appointments.today && appointments.today.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.today.map((apt: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-900">{apt.customer_name}</p>
                          <p className="text-sm text-gray-600">{apt.time} - {apt.vehicle}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No appointments today</p>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                  </div>
                  {appointments.upcoming && appointments.upcoming.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.upcoming.map((apt: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-900">{apt.customer_name}</p>
                          <p className="text-sm text-gray-600">{apt.date} - {apt.vehicle}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/dealer/add-vehicle')}
                  className="btn-primary py-4"
                >
                  Add New Vehicle
                </button>
                <button
                  onClick={() => router.push('/dealer/auctions/create')}
                  className="btn-secondary py-4"
                >
                  Create Auction
                </button>
                <button
                  onClick={() => setActiveSection('listings')}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  View All Listings
                </button>
              </div>
            )}

            {/* Other Sections Placeholder */}
            {activeSection === 'listings' && (
              <div className="card p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Listings</h3>
                <p className="text-gray-600 mb-6">Manage your vehicle listings here</p>
                <button onClick={() => router.push('/dealer/add-vehicle')} className="btn-primary">
                  Add New Listing
                </button>
              </div>
            )}

            {activeSection === 'auctions' && (
              <div className="card p-12 text-center">
                <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Auctions</h3>
                <p className="text-gray-600 mb-6">Manage your auctions here</p>
                <button onClick={() => router.push('/dealer/auctions/create')} className="btn-primary">
                  Create New Auction
                </button>
              </div>
            )}

            {activeSection === 'appointments' && (
              <div className="card p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointments</h3>
                <p className="text-gray-600">Customer appointments will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
