'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { api, auth } from '@/lib/api';
import { appointmentsApi } from '@/lib/api/appointments';
import DealerSidebar from '@/components/dealer/dashboard/DealerSidebar';
import DealerProfileHeader from '@/components/dealer/dashboard/DealerProfileHeader';
import DealerStatsGrid from '@/components/dealer/dashboard/DealerStatsGrid';
import OverviewSection from '@/components/dealer/dashboard/OverviewSection';
import AppointmentsSection from '@/components/dealer/dashboard/AppointmentsSection';

export default function DealerDashboardPage() {
  const { user, setUser } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [dealerAppointments, setDealerAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const hasLoadedProfile = useRef(false);

  useEffect(() => {
    if (hasLoadedProfile.current) return;
    hasLoadedProfile.current = true;

    const loadProfile = async () => {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await api.getProfile(token);
        if (response.success) {
          if (response.user.user_type !== 'dealer' && response.user.user_type !== 'showroom') {
            router.push('/dashboard');
            return;
          }
          setUser(response.user);
          auth.setUser(response.user);
        } else {
          auth.clear();
          router.push('/login');
        }
      } catch (error) {
        auth.clear();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [router]);

  useEffect(() => {
    if (!user || loading) return;
    
    sessionStorage.setItem('dashboard_section', activeSection);

    if (activeSection === 'overview') {
      fetchDashboardStats();
    }
    if (activeSection === 'appointments') {
      fetchDealerAppointments();
    }
    // Add other sections as needed
  }, [activeSection, user, loading]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dealer/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data.stats);
        setRecentInquiries(data.data.recentInquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchDealerAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const data = await appointmentsApi.getDealerAppointments(token);
      if (data.success) {
        setDealerAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId: number) => {
    const token = auth.getToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dealer/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });
      const data = await response.json();
      if (data.success) {
        fetchDealerAppointments();
      }
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <DealerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          userType={user.user_type}
        />

        <div className="space-y-6">
          {activeSection === 'overview' && (
            <>
              <DealerProfileHeader user={user} />
              <DealerStatsGrid stats={dashboardStats} loading={statsLoading} />
              {dashboardStats && (
                <OverviewSection 
                  dashboardStats={dashboardStats} 
                  recentInquiries={recentInquiries} 
                />
              )}
            </>
          )}

          {activeSection === 'appointments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Customer Appointments</h2>
              <AppointmentsSection 
                appointments={dealerAppointments}
                loading={appointmentsLoading}
                onConfirm={handleConfirmAppointment}
              />
            </div>
          )}

          {/* Placeholder for other sections */}
          {activeSection === 'inventory' && (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Inventory Section</h2>
              <p className="text-gray-600">Inventory management coming soon...</p>
              <button 
                onClick={() => router.push('/dealer/add-vehicle')}
                className="btn-primary mt-4"
              >
                Add Vehicle
              </button>
            </div>
          )}

          {activeSection === 'listings' && (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Listings Section</h2>
              <p className="text-gray-600">Manage your listings here...</p>
            </div>
          )}

          {activeSection === 'auctions' && (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Auctions Section</h2>
              <p className="text-gray-600">View and participate in auctions...</p>
            </div>
          )}

          {activeSection === 'sales' && (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Sales Section</h2>
              <p className="text-gray-600">Track your sales and revenue...</p>
            </div>
          )}

          {activeSection === 'customers' && (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Customers Section</h2>
              <p className="text-gray-600">Manage customer relationships...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
