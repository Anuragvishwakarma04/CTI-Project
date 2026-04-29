'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Phone, Mail, Car, Heart, Bell, LogOut, Edit, Settings, Clock, TrendingUp, Eye, MapPin, Building2, Calendar, ShoppingBag, CreditCard, Shield, FileText, Wrench, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { api, auth } from '@/lib/api';
import { appointmentsApi } from '@/lib/api/appointments';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardPage() {
  const { user, setUser, notifications } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('appointments'); // Default for customers
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState('');
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [garageVehicles, setGarageVehicles] = useState<any[]>([]);
  const [garageLoading, setGarageLoading] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    registration_date: '',
    insurance_expiry: '',
    pollution_expiry: '',
    has_warranty: false,
    warranty_expiry: '',
    last_service_date: '',
    next_service_date: '',
    notes: '',
  });
  const [vehicleMessage, setVehicleMessage] = useState('');
  const [userListings, setUserListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
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
          // Redirect dealers/showrooms to their dashboard
          if (response.user.user_type === 'dealer' || response.user.user_type === 'showroom') {
            router.push('/dealer/dashboard');
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

    // Check for success message
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'profile_updated') {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clean URL
      window.history.replaceState({}, '', '/dashboard');
    }

    // Check for tab parameter in URL
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [router]);

  useEffect(() => {
    if (!user || loading) return; // Don't fetch until user is loaded
    
    // Store current tab in sessionStorage whenever it changes
    sessionStorage.setItem('customer_dashboard_tab', activeTab);

    if (activeTab === 'appointments') {
      fetchAppointments();
    }
    if (activeTab === 'activity') {
      fetchNotifications();
      if (user.user_type === 'dealer') {
        fetchDashboardStats();
      }
    }
    if (activeTab === 'garage') {
      fetchGarageVehicles();
    }
    if (activeTab === 'listings') {
      fetchUserListings();
    }
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, user, loading]);

  const fetchNotifications = async () => {
    const token = auth.getToken();
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        // Update notifications in store if needed
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchDashboardStats = async () => {
    const token = auth.getToken();
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dealer/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data?.stats || null);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchAppointments = async () => {
    const token = auth.getToken();
    if (!token) return;
    setAppointmentsLoading(true);
    try {
      console.log('Fetching appointments from:', `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`);
      const response = await appointmentsApi.getAll(token);
      console.log('Appointments response:', response);
      if (response.success) {
        setAppointments(response.appointments || []);
      } else {
        console.error('Appointments API error:', response);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({ date: appointment.appointment_date, time: appointment.appointment_time });
    setShowRescheduleModal(true);
    setRescheduleMessage('');
  };

  const submitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token || !selectedAppointment) return;

    setRescheduleLoading(true);
    setRescheduleMessage('');
    try {
      const data = await appointmentsApi.reschedule(
        token,
        selectedAppointment.id,
        rescheduleForm.date,
        rescheduleForm.time
      );
      if (data.success) {
        setRescheduleMessage('Appointment rescheduled successfully!');
        setTimeout(() => {
          setShowRescheduleModal(false);
          fetchAppointments();
          setRescheduleMessage('');
        }, 2000);
      } else {
        setRescheduleMessage(data.message || 'Failed to reschedule');
      }
    } catch (error) {
      setRescheduleMessage('Failed to reschedule appointment');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    const token = auth.getToken();
    if (!token) return;

    try {
      const data = await appointmentsApi.cancel(token, appointmentId);
      if (data.success) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const fetchGarageVehicles = async () => {
    const token = auth.getToken();
    if (!token) return;
    setGarageLoading(true);
    try {
      const response = await api.getGarageVehicles(token);
      if (response.success) {
        setGarageVehicles(response.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching garage vehicles:', error);
    } finally {
      setGarageLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) return;

    setVehicleMessage('');
    try {
      const formData = new FormData();
      Object.entries(vehicleForm).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (vehicleImage) {
        formData.append('vehicle_image', vehicleImage);
      }

      const response = await api.addGarageVehicle(token, formData);
      if (response.success) {
        setVehicleMessage('Vehicle added successfully!');
        setTimeout(() => {
          setShowAddVehicleModal(false);
          setVehicleForm({
            vehicle_number: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            registration_date: '',
            insurance_expiry: '',
            pollution_expiry: '',
            has_warranty: false,
            warranty_expiry: '',
            last_service_date: '',
            next_service_date: '',
            notes: '',
          });
          setVehicleImage(null);
          setImagePreview('');
          fetchGarageVehicles();
          setVehicleMessage('');
        }, 2000);
      } else {
        setVehicleMessage(response.message || 'Failed to add vehicle');
      }
    } catch (error) {
      setVehicleMessage('Failed to add vehicle');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVehicleImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    const token = auth.getToken();
    if (!token) return;

    try {
      const response = await api.deleteGarageVehicle(token, id.toString());
      if (response.success) {
        fetchGarageVehicles();
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const fetchUserListings = async () => {
    const token = auth.getToken();
    if (!token) return;
    setListingsLoading(true);
    try {
      const response = await api.getMyListings(token);
      if (response.success) {
        setUserListings(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    const token = auth.getToken();
    if (!token) return;
    setFavoritesLoading(true);
    try {
      const response = await api.getFavorites(token);
      if (response.success) {
        setFavorites(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = auth.getToken();
    if (!token) return;

    try {
      const response = await api.removeFromFavorites(token, vehicleId);
      if (response.success) {
        setFavorites(favorites.filter(car => car.vehicle_id !== vehicleId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleStatusUpdate = async (vehicleId: number, newStatus: 'active' | 'sold') => {
    const token = auth.getToken();
    if (!token) return;
    setStatusUpdating(vehicleId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${vehicleId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUserListings();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleLogout = async () => {
    const token = auth.getToken();
    if (token) {
      await api.logout(token);
    }
    auth.clear();
    setUser(null);
    router.push('/');
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

  const tabs = user.user_type === 'dealer' 
    ? [
        { id: 'analytics', label: 'Analytics', icon: Eye },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'activity', label: 'Activity', icon: Clock },
      ]
    : [
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'activity', label: 'Activity', icon: Clock },
      ];
// console.log("USER TYPE:", user?.user_type);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-700 font-semibold">{successMessage}</p>
          <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-600 hover:text-green-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content - Right Side */}
        <div className="space-y-6">          {/* Stats Grid */}
          {user.user_type === 'dealer' && dashboardStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalCars || 0}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Active Listings</p>
              </div>
              <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalViews || 0}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Total Views</p>
              </div>
              <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalLikes || 0}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Total Likes</p>
              </div>
              <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-warning mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold mb-1">{notifications.filter(n => !n.read).length}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Notifications</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="card">
            <div className="p-4 sm:p-6">
              {activeTab === 'listings' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">My Listings</h3>
                    <button onClick={() => router.push('/dashboard/add-listing')} className="btn-primary flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Add New Car
                    </button>
                  </div>
                  {listingsLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : userListings.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                      <p className="text-gray-600 mb-4">Start selling your car by adding a listing</p>
                      <button onClick={() => router.push('/dashboard/add-listing')} className="btn-primary inline-flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Add Your First Car
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userListings.map((vehicle) => (
                        <div 
                          key={vehicle.vehicle_id} 
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                          <div 
                            onClick={() => router.push(`/listings/${vehicle.vehicle_id}`)}
                            className="relative w-32 h-24 flex-shrink-0 cursor-pointer"
                          >
                            {vehicle.image_url || vehicle.featured_image || vehicle.images?.[0]?.url ? (
                              <Image 
                                src={vehicle.image_url || vehicle.featured_image || vehicle.images[0].url} 
                                alt={`${vehicle.brand} ${vehicle.model}`} 
                                fill 
                                className="object-cover rounded-lg" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <Car className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div 
                            onClick={() => router.push(`/listings/${vehicle.vehicle_id}`)}
                            className="flex-1 cursor-pointer"
                          >
                            <h4 className="font-bold text-lg">{vehicle.brand} {vehicle.model}</h4>
                            <p className="text-gray-600 text-sm">{vehicle.year} • {vehicle.km_driven?.toLocaleString()} km</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                vehicle.status === 'approved' ? 'bg-green-100 text-green-700' :
                                vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {vehicle.status}
                              </span>
                              {vehicle.listing_status && (
                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                  vehicle.listing_status === 'active' ? 'bg-blue-100 text-blue-700' :
                                  vehicle.listing_status === 'sold' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {vehicle.listing_status}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-primary-600 font-bold text-xl">₹{vehicle.expected_selling_price?.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/dashboard/edit-listing/${vehicle.vehicle_id}`);
                                }}
                                className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              {vehicle.status === 'approved' && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(vehicle.vehicle_id, 'active');
                                    }}
                                    disabled={statusUpdating === vehicle.vehicle_id || vehicle.listing_status === 'active'}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                      vehicle.listing_status === 'active'
                                        ? 'bg-blue-100 text-blue-700 cursor-default'
                                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                    } disabled:opacity-50`}
                                  >
                                    {statusUpdating === vehicle.vehicle_id ? '...' : 'Active'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusUpdate(vehicle.vehicle_id, 'sold');
                                    }}
                                    disabled={statusUpdating === vehicle.vehicle_id || vehicle.listing_status === 'sold'}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                      vehicle.listing_status === 'sold'
                                        ? 'bg-red-100 text-red-700 cursor-default'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                    } disabled:opacity-50`}
                                  >
                                    {statusUpdating === vehicle.vehicle_id ? '...' : 'Sold'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">My Appointments</h3>
                    <span className="text-sm text-gray-600">{appointments.length} Total</span>
                  </div>
                  
                  {/* Appointment Filters */}
                  <div className="flex gap-2 mb-6">
                    <button onClick={() => setAppointmentFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition ${
                      appointmentFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      All
                    </button>
                    <button onClick={() => setAppointmentFilter('upcoming')} className={`px-4 py-2 rounded-lg font-medium transition ${
                      appointmentFilter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Upcoming
                    </button>
                    <button onClick={() => setAppointmentFilter('pending')} className={`px-4 py-2 rounded-lg font-medium transition ${
                      appointmentFilter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Pending
                    </button>
                    <button onClick={() => setAppointmentFilter('cancelled')} className={`px-4 py-2 rounded-lg font-medium transition ${
                      appointmentFilter === 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Cancelled
                    </button>
                  </div>
                  
                  {appointmentsLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : appointments.filter(apt => 
                    appointmentFilter === 'all' ? true :
                    appointmentFilter === 'upcoming' ? apt.status === 'confirmed' :
                    appointmentFilter === 'pending' ? apt.status === 'pending' :
                    apt.status === 'cancelled'
                  ).length === 0 ? (
                    <div className="text-center py-16 text-gray-600">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-xl font-semibold mb-2">No {appointmentFilter !== 'all' ? appointmentFilter : ''} appointments</p>
                      <p className="text-sm">Book a test drive to see your appointments here</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {appointments.filter(apt => 
                        appointmentFilter === 'all' ? true :
                        appointmentFilter === 'upcoming' ? apt.status === 'confirmed' :
                        appointmentFilter === 'pending' ? apt.status === 'pending' :
                        apt.status === 'cancelled'
                      ).map((appointment) => (
                        <div key={appointment.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Car className="w-6 h-6 text-primary-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg text-gray-900">
                                      {appointment.vehicle?.name || 'Showroom Visit'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {appointment.dealer?.business_name || appointment.dealer?.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                appointment.status === 'confirmed' ? 'bg-green-500 text-white' :
                                appointment.status === 'pending' ? 'bg-yellow-400 text-gray-900' :
                                appointment.status === 'cancelled' ? 'bg-red-500 text-white' :
                                'bg-gray-300 text-gray-700'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">Date</p>
                                  <p className="font-bold text-gray-900">{new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">Time</p>
                                  <p className="font-bold text-gray-900">{appointment.appointment_time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                  <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">Contact</p>
                                  <p className="font-bold text-gray-900">{appointment.dealer?.phone}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">Dealer</p>
                                  <p className="font-bold text-gray-900">{appointment.dealer?.name}</p>
                                </div>
                              </div>
                            </div>
                            
                            {appointment.customer_message && (
                              <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-primary-500">
                                <p className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Your Message</p>
                                <p className="text-sm text-gray-800">{appointment.customer_message}</p>
                              </div>
                            )}
                            
                            {appointment.dealer_notes && (
                              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                                <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Dealer Notes</p>
                                <p className="text-sm text-blue-900">{appointment.dealer_notes}</p>
                              </div>
                            )}
                            
                            {appointment.status !== 'cancelled' && (
                              <div className="flex gap-3 pt-2">
                                <button onClick={() => handleReschedule(appointment)} className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                                  <Calendar className="w-4 h-4" />
                                  Reschedule
                                </button>
                                <button onClick={() => handleCancelAppointment(appointment.id)} className="flex-1 py-3 px-4 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'garage' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">My Garage</h3>
                    <button onClick={() => router.push('/garage/add')} className="btn-primary flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Add Vehicle
                    </button>
                  </div>
                  {garageLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : garageVehicles.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles in garage</h3>
                      <p className="text-gray-600 mb-4">Add your vehicles to track maintenance and history</p>
                      <button onClick={() => router.push('/garage/add')} className="btn-primary inline-flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Add Your First Vehicle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {garageVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => router.push(`/garage/${vehicle.id}`)}>
                          <div className="flex flex-col md:flex-row">
                            {/* Vehicle Image */}
                            <div className="relative w-full md:w-80 h-56 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
                              {(vehicle.vehicle_image || vehicle.vehicle_image_url) ? (
                                <Image src={vehicle.vehicle_image_url || vehicle.vehicle_image} alt={vehicle.vehicle_number} fill className="object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Car className="w-24 h-24 text-white/30" />
                                </div>
                              )}
                            </div>
                            
                            {/* Vehicle Info */}
                            <div className="flex-1 p-6">
                              <h4 className="text-2xl font-bold text-gray-900 mb-1">{vehicle.vehicle_number}</h4>
                              <p className="text-gray-600 mb-6">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
                              
                              <div className="grid grid-cols-2 gap-4">
                                {vehicle.insurance_expiry && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Insurance Expiry:</p>
                                    <p className="font-semibold text-gray-900">{new Date(vehicle.insurance_expiry).toLocaleDateString('en-GB')}</p>
                                  </div>
                                )}
                                
                                {vehicle.pollution_expiry && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Pollution Expiry:</p>
                                    <p className="font-semibold text-gray-900">{new Date(vehicle.pollution_expiry).toLocaleDateString('en-GB')}</p>
                                  </div>
                                )}
                                
                                {vehicle.has_warranty && vehicle.warranty_expiry && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Warranty:</p>
                                    <p className="font-semibold text-gray-900">Until {new Date(vehicle.warranty_expiry).toLocaleDateString('en-GB')}</p>
                                  </div>
                                )}
                                
                                {vehicle.next_service_date && (
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Next Service:</p>
                                    <p className="font-semibold text-gray-900">{new Date(vehicle.next_service_date).toLocaleDateString('en-GB')}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                                <button onClick={(e) => { e.stopPropagation(); router.push(`/garage/${vehicle.id}`); }} className="px-4 py-2 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-lg flex items-center gap-2 transition font-medium">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteVehicle(vehicle.id); }} className="px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg flex items-center gap-2 transition font-medium">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">My Favorites</h3>
                  {favoritesLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                      <p className="text-gray-600">Save cars you like to view them here</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {favorites.map((car) => (
                        <div 
                          key={car.vehicle_id} 
                          onClick={() => router.push(`/listings/${car.vehicle_id}`)}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="relative h-48">
                            {car.image_url ? (
                              <Image 
                                src={car.image_url} 
                                alt={car.name} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Car className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            <button 
                              onClick={(e) => handleRemoveFromFavorites(car.vehicle_id, e)}
                              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 transition"
                            >
                              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            </button>
                          </div>
                          <div className="p-5">
                            <h4 className="font-bold text-lg mb-2">{car.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <span>{car.year}</span>
                              <span>•</span>
                              <span>{car.km_driven?.toLocaleString()} km</span>
                              <span>•</span>
                              <span>{car.fuel_type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                              <MapPin className="w-4 h-4" />
                              <span>{car.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-2xl font-bold text-primary-600">₹{parseFloat(car.selling_price).toLocaleString()}</p>
                              <span className="text-xs text-gray-500">{car.transmission}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              

              {activeTab === 'bookings' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">My Bookings</h3>
                  <div className="card p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Your service and warranty bookings will appear here</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Settings</h3>
                  <div className="card p-12 text-center">
                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { icon: '✅', title: 'Profile completed', desc: 'Your profile is now active', time: '1 hour ago', color: 'bg-green-100' },
                      { icon: '🔐', title: 'Logged in', desc: 'Successful login from new device', time: '2 hours ago', color: 'bg-blue-100' },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{activity.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{activity.desc}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Reschedule Appointment</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900">{selectedAppointment.vehicle?.name || 'Showroom Visit'}</p>
              <p className="text-xs text-gray-600">{selectedAppointment.dealer?.business_name || selectedAppointment.dealer?.name}</p>
            </div>
            <form onSubmit={submitReschedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  className="input-field"
                  min={getTodayDate()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                <input
                  type="time"
                  required
                  value={rescheduleForm.time}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                  className="input-field"
                />
              </div>
              {rescheduleMessage && (
                <div className={`p-3 rounded-lg text-center font-medium ${rescheduleMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {rescheduleMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowRescheduleModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={rescheduleLoading} className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50">
                  {rescheduleLoading ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
