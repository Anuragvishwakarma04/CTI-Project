'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { Search, Eye, Edit, Calendar, Store, Car, Gavel, TrendingUp, Home, ChevronRight, LogOut, List, Plus, Users } from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';
import { appointmentsApi } from '@/lib/api/appointments';
import { useSearchParams } from "next/navigation";


export default function ShowroomDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const [appointmentsList, setAppointmentsList] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);


  const [auctions, setAuctions] = useState<any[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionSearch, setAuctionSearch] = useState('');
  const [auctionStatus, setAuctionStatus] = useState('all');
  const [auctionSortBy, setAuctionSortBy] = useState('start_date');
  const [auctionSortOrder, setAuctionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [auctionDateFrom, setAuctionDateFrom] = useState('');
  const [auctionDateTo, setAuctionDateTo] = useState('');
  const [auctionPage, setAuctionPage] = useState(1);
  const [auctionPagination, setAuctionPagination] = useState({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const searchParams = useSearchParams();

useEffect(() => {
  const section = searchParams.get("section");

  if (section) {
    setActiveSection(section);
  }
}, []);

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const data = await appointmentsApi.getDealerAppointments(token);

      console.log("APPOINTMENTS:", data);

      if (data.success) {
        setAppointmentsList(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchAuctions = async () => {
    try {
      setAuctionsLoading(true);
      const token = auth.getToken();
      if (!token) return;
      const res = await api.getMyAuctionListings(token);
      if (res.success) {
        setAuctions(res.auctions || res.data || []);
        if (res.pagination) setAuctionPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch auctions:', err);
    } finally {
      setAuctionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'listings') fetchVehicles();
    if (activeSection === 'auctions') fetchAuctions(); // ← yeh add karo
    if (activeSection === 'appointments') fetchAppointments();
  }, [activeSection]);

  // useEffect(() => {
  //   if (activeSection !== 'auctions') return;

  //   fetchAuctions(); // first load

  //   const interval = setInterval(() => {
  //     fetchAuctions(); // हर 5 sec refresh
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [activeSection]);

  const handleViewAuction = async (auctionCode: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://ctiapp.morbustech.com/api/auctions/${auctionCode}/vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("VEHICLES:", data);
      console.log("COUNT:", data.vehicles?.length);

      const vehicle = data?.vehicles?.[0];

      if (!vehicle || !vehicle.vehicle_id) {
        alert("No vehicle found in this auction");
        return;
      }

     if (data.vehicles.length === 1) {
  router.push(`/dealer/auctions/${auctionCode}/bid/${data.vehicles[0].vehicle_id}`);
} else {
  router.push(`/dealer/auctions/${auctionCode}/vehicles`);
}

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };


  const getAuctionStatus = (auction: any) => {
    if (auction.status === 'draft') return 'draft';
    const now = Date.now();
    const start = new Date(auction.start_date).getTime();
    const end = new Date(auction.end_date).getTime();
    if (auction.status === 'active' && now >= start && now <= end) return 'live';
    if (auction.status === 'active' && now < start) return 'upcoming';
    if (now > end) return 'ended';
    return auction.status || 'upcoming';
  };

  const getTimeRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const filteredAuctions = auctions.filter((a: any) => {
    const matchesSearch = !auctionSearch ||
      (a.title || '').toLowerCase().includes(auctionSearch.toLowerCase()) ||
      (a.auction_code || '').toLowerCase().includes(auctionSearch.toLowerCase());
    const derivedStatus = getAuctionStatus(a);
    const matchesStatus = auctionStatus === 'all' || derivedStatus === auctionStatus;
    return matchesSearch && matchesStatus;
  });

  const liveAuctions = auctions.filter((a: any) => {
    const status = getAuctionStatus(a);
    return status === 'live';
  });

  const filteredVehicles = vehicles.filter((v: any) => {
    const matchesSearch = !searchQuery ||
      v.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registration_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700',
      under_review: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      live: 'bg-green-100 text-green-700',
      sold: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };



  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const token = auth.getToken();
      if (!token) return;


      const response = await api.getMyListings(token);

      console.log("LISTINGS:", response);

      if (response.success) {
        setVehicles(response.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'listings') {
      fetchVehicles();
    }
  }, [activeSection]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = auth.getToken();
      console.log("TOKEN:", token);
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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    )
  }
  // const showroom = dashboardData?.showroom;
  // const counts = dashboardData?.counts;
  // const appointments = dashboardData?.appointments;

  const showroom = dashboardData?.showroom;
  const counts = dashboardData?.counts || { listings: 0, auctions: 0, sold_auctions: 0, not_sold_auctions: 0 };
  const appointments = dashboardData?.appointments || { today: [], upcoming: [] };


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
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'overview' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'overview' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${activeSection === 'overview' ? 'text-white' : 'text-gray-900'
                      }`}>Dashboard</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeSection === 'overview' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                    }`} />
                </button>

                <button
                  onClick={() => setActiveSection('listings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'listings' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'listings' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600 group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <List className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${activeSection === 'listings' ? 'text-white' : 'text-gray-900'
                      }`}>Listings</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeSection === 'listings' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
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
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'auctions' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'auctions' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600 group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${activeSection === 'auctions' ? 'text-white' : 'text-gray-900'
                      }`}>Auctions</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeSection === 'auctions' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                    }`} />
                </button>

                <button
                  onClick={() => setActiveSection('appointments')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'appointments' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'appointments' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${activeSection === 'appointments' ? 'text-white' : 'text-gray-900'
                      }`}>Appointments</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeSection === 'appointments' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
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
                    <h1 className="text-2xl font-bold text-gray-900">{showroom?.name}</h1>
                    {/* <p className="text-gray-600">Dealer Code: {showroom?.dealer_code}</p> */}
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
                      <p className="text-3xl font-bold text-gray-900">{counts?.listings}</p>
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
                      <p className="text-3xl font-bold text-gray-900">{counts?.auctions}</p>
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
                      <p className="text-3xl font-bold text-green-600">{counts?.sold_auctions}</p>
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
                      <p className="text-3xl font-bold text-orange-600">{counts?.not_sold_auctions}</p>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <button
                    onClick={() => router.push('/dealer/add-vehicle')}
                    className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Listing
                  </button>
                </div>

                <div className="card p-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Search by brand, model, registration number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-full"
                  />
                  <div className="flex gap-2 overflow-x-auto">
                    {['all', 'draft', 'pending', 'under_review', 'approved', 'live', 'sold'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {status === 'all' ? 'All' : status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {vehiclesLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="card p-12 text-center">
                    <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
                    <button onClick={() => router.push('/dealer/add-vehicle')} className="btn-primary mt-2">
                      Add Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle: any) => (
                      <div key={vehicle.vehicle_id} className="card overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div onClick={() => router.push(`/dealer/listings/${vehicle.vehicle_id}`)} className="cursor-pointer">
                          <div className="relative h-48 bg-gray-200">
                            {(vehicle.featured_image || vehicle.image_url) ? (
    <Image
      src={vehicle.featured_image || vehicle.image_url}
      alt={`${vehicle.brand} ${vehicle.model}`}
      fill
      className="object-cover" 
    />
  ) : (
    <div className="flex items-center justify-center h-full">
      <Car className="w-16 h-16 text-gray-400" />
    </div>
  )}
                            <div className="absolute top-3 left-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vehicle.status)}`}>
                                {vehicle.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{vehicle.brand} {vehicle.model}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{vehicle.year}</span>
                                {vehicle.registration_number && <><span>•</span><span>{vehicle.registration_number}</span></>}
                              </div>
                              {vehicle.expected_selling_price && (
                                <div className="text-primary font-semibold text-base">
                                  ₹{Number(vehicle.expected_selling_price).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pb-4 pt-2 border-t">
                          {vehicle.status === 'draft' ? (
                            <button
                              onClick={() => router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`)}
                              className="w-full btn-primary text-sm flex items-center justify-center gap-2"
                            >
                              <Edit className="w-4 h-4" />Complete
                            </button>
                          ) : (
                            <button
                              onClick={() => router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`)}
                              className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
                            >
                              <Edit className="w-4 h-4" />Edit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'auctions' && (

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Auctions</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push('/dealer/auctions/create')}
                      className="btn-primary text-sm flex items-center gap-2 px-4 py-2"
                    >
                      <Gavel className="w-4 h-4" />
                      Create Auction
                    </button>
                    <button
                      onClick={fetchAuctions}
                      className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="card p-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search auctions..."
                      value={auctionSearch}
                      onChange={(e) => { setAuctionSearch(e.target.value); setAuctionPage(1); }}
                      className="input-field w-full pl-10"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
                      <input
                        type="date"
                        value={auctionDateFrom}
                        onChange={(e) => { setAuctionDateFrom(e.target.value); setAuctionPage(1); }}
                        className="input-field w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
                      <input
                        type="date"
                        value={auctionDateTo}
                        onChange={(e) => { setAuctionDateTo(e.target.value); setAuctionPage(1); }}
                        className="input-field w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
                      <select
                        value={auctionSortBy}
                        onChange={(e) => { setAuctionSortBy(e.target.value); setAuctionPage(1); }}
                        className="input-field w-full"
                      >
                        <option value="start_date">Start Date</option>
                        <option value="end_date">End Date</option>
                        <option value="total_vehicles">Vehicles Count</option>
                        <option value="created_at">Created Date</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                      <select
                        value={auctionSortOrder}
                        onChange={(e) => { setAuctionSortOrder(e.target.value as 'asc' | 'desc'); setAuctionPage(1); }}
                        className="input-field w-full"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  {(auctionSearch || auctionStatus !== 'all' || auctionDateFrom || auctionDateTo) && (
                    <button
                      onClick={() => {
                        setAuctionSearch('');
                        setAuctionStatus('all');
                        setAuctionDateFrom('');
                        setAuctionDateTo('');
                        setAuctionPage(1);
                      }}
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                {/* Table */}
                {auctionsLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredAuctions.length === 0 ? (
                  <div className="card p-12 text-center">
                    <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No auctions found</h3>
                    <button onClick={() => router.push('/dealer/auctions/create')} className="btn-primary mt-2">
                      Create New Auction
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block card overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Auction Name</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Participants</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vehicles</th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">End Date</th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time Remaining</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredAuctions.map((auction: any) => {
                              const status = getAuctionStatus(auction);
                              return (
                                <tr key={auction.auction_code} className="hover:bg-gray-50 transition">
                                  <td className="px-4 py-4">
                                    <p className="font-semibold text-gray-900 text-sm">{auction.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{auction.auction_code}</p>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-50 text-purple-600 font-semibold text-sm rounded-lg">
                                      {auction.total_participants || 0}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 text-primary font-semibold text-sm rounded-lg">
                                      {auction.total_vehicles || 0}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status === 'live' ? 'bg-green-100 text-green-700' :
                                      status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                        status === 'ended' ? 'bg-gray-100 text-gray-600' :
                                          status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-amber-100 text-amber-700'
                                      }`}>
                                      {status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="text-sm text-gray-900">
                                      {new Date(auction.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(auction.end_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="text-sm text-gray-600">
                                      {status === 'live' ? getTimeRemaining(auction.end_date) : '-'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-center space-y-2">

                                    {/* 🔍 View Button */}
                                    <button
                                      onClick={() => router.push(`/dealer/auctions/${auction.auction_code}`)}
                                      className="w-full bg-blue-600 
                                                    text-white py-2 rounded-lg text-sm font-semibold 
                                                    shadow-md hover:shadow-xl 
                                                    transition-all duration-300 
                                                    hover:scale-[1.03] active:scale-95"
                                    >
                                      View Auction
                                    </button>

                                    
                                     {status === 'live' && (
                                        <button
                                          onClick={() => handleViewAuction(auction.auction_code)}
                                          className="w-full bg-gray-300 backdrop-blur-md 
                                          border border-gray-200 
                                          text-gray-800 py-2 rounded-lg text-sm font-semibold 
                                          shadow-sm hover:shadow-lg 
                                          transition-all duration-300 
                                          hover:scale-[1.03] active:scale-95 
                                          flex items-center justify-center gap-2"
                                        >
                                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                          Live Auction
                                        </button>
                                      )}

                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {filteredAuctions.map((auction: any) => {
                        const status = getAuctionStatus(auction);
                        return (
                          <div
                            key={auction.auction_code}
                            className="card p-4 hover:shadow-lg transition cursor-pointer"
                            onClick={() => router.push(`/dealer/auctions/${auction.auction_code}`)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">{auction.title}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{auction.auction_code}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'live' ? 'bg-green-100 text-green-700' :
                                status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                  status === 'ended' ? 'bg-gray-100 text-gray-600' :
                                    status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-amber-100 text-amber-700'
                                }`}>
                                {status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Participants</p>
                                <p className="text-gray-900 font-semibold">{auction.total_participants || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Vehicles</p>
                                <p className="text-gray-900 font-semibold">{auction.total_vehicles || 0}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Start Date</p>
                                <p className="text-gray-900">{new Date(auction.start_date).toLocaleDateString('en-IN')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">End Date</p>
                                <p className="text-gray-900">{new Date(auction.end_date).toLocaleDateString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                              <button className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Auction
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
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
