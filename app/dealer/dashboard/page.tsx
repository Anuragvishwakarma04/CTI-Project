'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Phone, Mail, Car, LogOut, Edit, Clock, TrendingUp, Eye, EyeOff, Building2, Calendar, Users, DollarSign, MessageSquare, ChevronRight, Home, MapPin, IndianRupee, Trash2, MoreVertical, PowerOff, Gavel, Search, Wallet, List, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import { api, auth } from '@/lib/api';
import { appointmentsApi } from '@/lib/api/appointments';


export default function DealerDashboardPage() {
  const hasFetchedDashboard = useRef(false);
  const { user, setUser, notifications } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [inventoryView, setInventoryView] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, per_page: 15, current_page: 1, last_page: 1 });
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dealerAppointments, setDealerAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionSearch, setAuctionSearch] = useState('');
  const [auctionZone, setAuctionZone] = useState('all');
  const [auctionStatus, setAuctionStatus] = useState('all');
  const [auctionCategory, setAuctionCategory] = useState('fresh');
  const [auctionDateFrom, setAuctionDateFrom] = useState('');
  const [auctionDateTo, setAuctionDateTo] = useState('');
  const [auctionSortBy, setAuctionSortBy] = useState('start_date');
  const [auctionSortOrder, setAuctionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [auctionPage, setAuctionPage] = useState(1);
  const [auctionPerPage, setAuctionPerPage] = useState(20);
  const [auctionPagination, setAuctionPagination] = useState({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const [dealerInfo, setDealerInfo] = useState<{ deposit: number; buying_limit: number; available_limit: number; is_kyc_completed: boolean } | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [soldForm, setSoldForm] = useState({ sold_price: '', sold_to: '', sold_notes: '' });
  const [soldLoading, setSoldLoading] = useState(false);
  const [soldMessage, setSoldMessage] = useState('');
  const hasLoadedProfile = useRef(false);


  const [copied, setCopied] = useState(false);

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

    // Check for section parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [router]);

  useEffect(() => {
    // Store current section in sessionStorage whenever it changes
    sessionStorage.setItem('dashboard_section', activeSection);

    if (activeSection === 'overview' && user) {
      fetchDashboardStats();
    }
    if (activeSection === 'inventory' && user) {
      fetchVehicles();
    }
    if (activeSection === 'listings' && user) {
      fetchVehicles();
    }
    if (activeSection === 'appointments' && user) {
      fetchDealerAppointments();
    }
    if (activeSection === 'auctions' && user) {
      fetchAuctions();
    }
  }, [activeSection, user, statusFilter, currentPage, searchQuery, auctionCategory, auctionSearch, auctionDateFrom, auctionDateTo, auctionStatus, auctionSortBy, auctionSortOrder, auctionPage, auctionPerPage]);

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

  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const response = await api.getMyListings(token, statusFilter === 'all' ? undefined : statusFilter);
      if (response.success) {
        let filteredVehicles = response.data || [];

        // Client-side search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredVehicles = filteredVehicles.filter((v: any) =>
            v.brand?.toLowerCase().includes(query) ||
            v.model?.toLowerCase().includes(query) ||
            v.registration_number?.toLowerCase().includes(query) ||
            v.vehicle_id?.toLowerCase().includes(query)
          );
        }

        setVehicles(filteredVehicles);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setVehiclesLoading(false);
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

  const fetchAuctions = async () => {
    try {
      setAuctionsLoading(true);
      const token = auth.getToken();

      let data;
      if (user?.user_type === 'showroom' && token) {
        data = await api.getMyAuctionListings(token);
      } else {
        // Build query params for dealers
        const params = new URLSearchParams();
        params.append('category', auctionCategory);
        if (auctionSearch) params.append('search', auctionSearch);
        if (auctionDateFrom) params.append('date_from', auctionDateFrom);
        if (auctionDateTo) params.append('date_to', auctionDateTo);
        if (auctionStatus !== 'all') params.append('status', auctionStatus);
        params.append('sort_by', auctionSortBy);
        params.append('sort_order', auctionSortOrder);
        params.append('per_page', auctionPerPage.toString());
        params.append('page', auctionPage.toString());

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auctions?${params.toString()}`;
        const response = await fetch(url, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        data = await response.json();
      }

      if (data.success) {
        setAuctions(data.auctions || data.data || []);
        if (data.dealer_info) setDealerInfo(data.dealer_info);
        if (data.pagination) setAuctionPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch auctions:', err);
    } finally {
      setAuctionsLoading(false);
    }
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

  const isShowroom = user?.user_type === 'showroom';

  const filteredAuctions = auctions.filter((a: any) => {
    const matchesSearch = !auctionSearch ||
      (a.title || '').toLowerCase().includes(auctionSearch.toLowerCase()) ||
      (a.auction_code || '').toLowerCase().includes(auctionSearch.toLowerCase()) ||
      (a.showroom?.name || '').toLowerCase().includes(auctionSearch.toLowerCase());
    const matchesZone = auctionZone === 'all' ||
      (a.title || '').toLowerCase().includes(auctionZone.toLowerCase()) ||
      (a.showroom?.name || '').toLowerCase().includes(auctionZone.toLowerCase());
    const derivedStatus = getAuctionStatus(a);
    const matchesStatus = auctionStatus === 'all' || derivedStatus === auctionStatus;
    return matchesSearch && matchesZone && matchesStatus;
  });

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

  const handleVehicleClick = (vehicle: any) => {
    router.push(`/dealer/listings/${vehicle.vehicle_id}`);
  };

  const handleDeleteVehicle = async (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this draft vehicle?')) return;

    try {
      const token = auth.getToken();
      if (!token) return;

      const response = await api.deleteVehicle(token, vehicleId);
      if (response.success) {
        fetchVehicles();
      } else {
        alert(response.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleStatusChange = async (vehicleId: string, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find the vehicle to check current status
    const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
    if (vehicle && vehicle.status === newStatus) {
      alert(`Vehicle is already ${newStatus}`);
      setActionMenuOpen(null);
      return;
    }

    try {
      const token = auth.getToken();
      if (!token) return;

      let response;
      // Use toggle-active endpoint for inactive/hidden status
      if (newStatus === 'inactive' || newStatus === 'hidden') {
        response = await api.toggleVehicleActive(token, vehicleId);
      } else {
        response = await api.updateVehicleStatus(token, vehicleId, newStatus);
      }

      if (response.success) {
        fetchVehicles();
        setActionMenuOpen(null);
      } else {
        alert(response.message || 'Failed to update');
      }
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleMarkAsSold = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVehicle(vehicle);
    setSoldForm({
      sold_price: vehicle.expected_selling_price?.toString() || '',
      sold_to: '',
      sold_notes: ''
    });
    setShowSoldModal(true);
    setSoldMessage('');
    setActionMenuOpen(null);
  };

  const submitMarkAsSold = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token || !selectedVehicle) return;

    setSoldLoading(true);
    setSoldMessage('');
    try {
      const response = await api.markVehicleAsSold(token, selectedVehicle.vehicle_id, {
        sold_price: parseInt(soldForm.sold_price),
        sold_to: soldForm.sold_to,
        sold_notes: soldForm.sold_notes,
      });
      if (response.success) {
        setSoldMessage('Vehicle marked as sold successfully!');
        setTimeout(() => {
          setShowSoldModal(false);
          fetchVehicles();
          setSoldMessage('');
        }, 2000);
      } else {
        setSoldMessage(response.message || 'Failed to mark as sold');
      }
    } catch (error) {
      setSoldMessage('Failed to mark as sold');
    } finally {
      setSoldLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700',
      under_review: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      live: 'bg-green-100 text-green-700',
      available: 'bg-green-100 text-green-700',
      sold: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
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

  const handleCopy = () => {
    navigator.clipboard.writeText(user.dealer_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Dealer Sidebar Menu - Left Side */}
        <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit space-y-4">
          <div className="card p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900">{user.user_type === 'showroom' ? 'Showroom Menu' : 'Dealer Menu'}</h3>
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

              {user.user_type !== 'showroom' && (
                <button
                  onClick={() => setActiveSection('inventory')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'inventory' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'inventory' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600 group-hover:bg-primary group-hover:text-white'
                    }`}>
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${activeSection === 'inventory' ? 'text-white' : 'text-gray-900'
                      }`}>Inventory</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeSection === 'inventory' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                    }`} />
                </button>
              )}

              {user.user_type === 'showroom' && (
                <>
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
                </>
              )}

              <button
                onClick={() => setActiveSection('appointments')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'appointments' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'appointments' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-primary group-hover:text-white'
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

              {user.user_type !== 'showroom' && (
                <>
                  <button
                    onClick={() => setActiveSection('sales')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'sales' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'sales' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-primary group-hover:text-white'
                      }`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium text-sm ${activeSection === 'sales' ? 'text-white' : 'text-gray-900'
                        }`}>Sales</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeSection === 'sales' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                      }`} />
                  </button>

                  <button
                    onClick={() => setActiveSection('customers')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition group ${activeSection === 'customers' ? 'bg-primary text-white' : 'hover:bg-primary-50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${activeSection === 'customers' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600 group-hover:bg-primary group-hover:text-white'
                      }`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium text-sm ${activeSection === 'customers' ? 'text-white' : 'text-gray-900'
                        }`}>Customers</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeSection === 'customers' ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                      }`} />
                  </button>
                </>
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

        {/* Main Content - Right Side */}
        <div className="space-y-6">
          {/* Dealer Profile Header */}
          {activeSection === 'overview' && (
            <div className="card p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <Image
                    src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover ring-4 ring-primary-100"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{user.business_name || user.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{user.phone}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{user.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 sm:px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-lg text-xs sm:text-sm font-semibold">
                      {user.user_type === 'showroom'
                        ? '🏢 Verified Showroom'
                        : '🏪 Verified Dealer'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="sm:text-base bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold text-gray-700">
                        {user.user_type === 'showroom'
                        ? `${user.user_type}`
                        : `Dealer ID: ${user.dealer_code}`}
                         
                      </span>

                      <button
                        onClick={handleCopy}
                        className="p-1 rounded hover:bg-gray-200 transition"
                      >
                        {user.user_type === 'showroom'
                        ? ''
                        : `${copied ? "✅" : "📑"}`}
                        
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => router.push('/edit-profile')} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* Dealer Stats Grid */}
          {activeSection === 'overview' && (
            <div>
              {statsLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : dashboardStats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                    <Car className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                    <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalCars || 0}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Total Cars</p>
                  </div>
                  <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                    <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3" />
                    <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalViews || 0}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Total Views</p>
                  </div>
                  <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
                    <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.totalInquiries || 0}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Inquiries</p>
                  </div>
                  <div className="card p-4 sm:p-6 hover:shadow-lg transition">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mb-2 sm:mb-3" />
                    <p className="text-2xl sm:text-3xl font-bold mb-1">{dashboardStats.followers || 0}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Followers</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Overview Content */}
          {activeSection === 'overview' && dashboardStats && (
            <div className="space-y-6">
              {/* Stock Summary */}
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Stock Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-1">{dashboardStats.totalCars || 0}</p>
                    <p className="text-sm text-gray-600">Total Stock</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600 mb-1">{dashboardStats.activeCars || 0}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600 mb-1">{dashboardStats.pendingApproval || 0}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600 mb-1">{dashboardStats.soldCars || 0}</p>
                    <p className="text-sm text-gray-600">Sold</p>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="card p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Inquiries
                </h4>
                {recentInquiries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No inquiries yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{inquiry.customerName}</p>
                          <p className="text-xs text-gray-500">{inquiry.customerMobile}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                          {inquiry.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory Section */}
          {activeSection === 'inventory' && (
            <div className="space-y-6">
              {/* Inventory Submenu */}
              <div className="card p-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInventoryView('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inventoryView === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All Vehicles
                  </button>
                  <button
                    onClick={() => router.push('/dealer/add-vehicle')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inventoryView === 'add' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    + Add Vehicle
                  </button>
                  <button
                    onClick={() => setInventoryView('aging')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inventoryView === 'aging' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Stock Aging
                  </button>
                  <button
                    onClick={() => setInventoryView('sold')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inventoryView === 'sold' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Sold Vehicles
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="card p-4 space-y-4">
                <input
                  type="text"
                  placeholder="Search by brand, model, registration number..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="input-field w-full"
                />
                <div className="flex gap-2 overflow-x-auto">
                  {['all', 'draft', 'pending', 'under_review', 'approved', 'live', 'sold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {status === 'all' ? 'All' : status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* All Vehicles Grid */}
              {inventoryView === 'all' && (
                <div>
                  {vehiclesLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : vehicles.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                      <p className="text-gray-600 mb-6">Start by adding your first vehicle</p>
                      <button onClick={() => router.push('/dealer/add-vehicle')} className="btn-primary">
                        Add Vehicle
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                          <div
                            key={vehicle.vehicle_id}
                            className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
                          >
                            <div
                              onClick={() => handleVehicleClick(vehicle)}
                              className="cursor-pointer"
                            >
                              <div className="relative h-48 bg-gray-200">
                                {vehicle.image_url ? (
                                  <Image
                                    src={vehicle.image_url}
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
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {vehicle.brand} {vehicle.model}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{vehicle.year}</span>
                                    {vehicle.registration_number && (
                                      <>
                                        <span>•</span>
                                        <span>{vehicle.registration_number}</span>
                                      </>
                                    )}
                                  </div>

                                  {vehicle.city && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{vehicle.city}</span>
                                    </div>
                                  )}

                                  {vehicle.expected_selling_price && (
                                    <div className="text-primary font-semibold text-base">
                                      ₹{vehicle.expected_selling_price.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="px-4 pb-4">
                              <div className="pt-4 border-t flex gap-2">
                                {vehicle.status === 'draft' ? (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`); }}
                                      className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                      Complete
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteVehicle(vehicle.vehicle_id, e)}
                                      className="btn-secondary text-sm p-2 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`); }}
                                      className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit
                                    </button>
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActionMenuOpen(actionMenuOpen === vehicle.vehicle_id ? null : vehicle.vehicle_id);
                                        }}
                                        className="btn-secondary text-sm p-2 hover:bg-gray-100"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                      {actionMenuOpen === vehicle.vehicle_id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-10"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActionMenuOpen(null);
                                            }}
                                          />
                                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-20">
                                            <button
                                              onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`); setActionMenuOpen(null); }}
                                              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-primary font-medium border-b"
                                            >
                                              <Edit className="w-4 h-4" />
                                              Edit Vehicle
                                            </button>
                                            {vehicle.status !== 'sold' && (
                                              <button
                                                onClick={(e) => handleMarkAsSold(vehicle, e)}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600 font-medium border-b"
                                              >
                                                <Check className="w-4 h-4" />
                                                Mark as Sold
                                              </button>
                                            )}
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const token = auth.getToken();
                                                if (!token) return;
                                                api.toggleVehicleActive(token, vehicle.vehicle_id).then((res) => {
                                                  if (res.success) {
                                                    fetchVehicles();
                                                    setActionMenuOpen(null);
                                                  } else {
                                                    alert(res.message || 'Failed to toggle status');
                                                  }
                                                });
                                              }}
                                              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600 font-medium"
                                            >
                                              {vehicle.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                              {vehicle.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {pagination.last_page > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          <span className="text-gray-700">
                            Page {pagination.current_page} of {pagination.last_page}
                          </span>

                          <button
                            onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                            disabled={currentPage === pagination.last_page}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Stock Aging View */}
              {inventoryView === 'aging' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="card p-4 bg-green-50 border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Fresh Stock (0-30 days)</p>
                      <p className="text-3xl font-bold text-green-600">{vehicles.filter((_, i) => i % 3 === 0).length}</p>
                    </div>
                    <div className="card p-4 bg-orange-50 border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">Aging (30-60 days)</p>
                      <p className="text-3xl font-bold text-orange-600">{vehicles.filter((_, i) => i % 3 === 1).length}</p>
                    </div>
                    <div className="card p-4 bg-red-50 border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Critical (60+ days)</p>
                      <p className="text-3xl font-bold text-red-600">{vehicles.filter((_, i) => i % 3 === 2).length}</p>
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-bold mb-4">Stock Aging Analysis</h3>
                    <p className="text-gray-600">Detailed aging report coming soon...</p>
                  </div>
                </div>
              )}

              {/* Sold Vehicles */}
              {inventoryView === 'sold' && (
                <div className="card p-6">
                  <h3 className="font-bold mb-4">Sold Vehicles</h3>
                  <p className="text-gray-600">No sold vehicles yet. Mark vehicles as sold from the All Vehicles view.</p>
                </div>
              )}
            </div>
          )}

          {/* Listings Section - showroom only */}
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
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="input-field w-full"
                />
                <div className="flex gap-2 overflow-x-auto">
                  {['all', 'draft', 'pending', 'under_review', 'approved', 'live', 'sold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
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
              ) : vehicles.length === 0 ? (
                <div className="card p-12 text-center">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first listing</p>
                  <button onClick={() => router.push('/dealer/add-vehicle')} className="btn-primary">
                    Add Listing
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.vehicle_id}
                        className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <div
                          onClick={() => handleVehicleClick(vehicle)}
                          className="cursor-pointer"
                        >
                          <div className="relative h-48 bg-gray-200">
                            {vehicle.image_url ? (
                              <Image
                                src={vehicle.image_url}
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
                              {vehicle.city && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{vehicle.city}</span>
                                </div>
                              )}
                              {vehicle.expected_selling_price && (
                                <div className="text-primary font-semibold text-base">
                                  ₹{vehicle.expected_selling_price.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pb-4">
                          <div className="pt-4 border-t flex gap-2">
                            {vehicle.status === 'draft' ? (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`); }}
                                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Complete
                                </button>
                                <button
                                  onClick={(e) => handleDeleteVehicle(vehicle.vehicle_id, e)}
                                  className="btn-secondary text-sm p-2 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`); }}
                                className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pagination.last_page > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700">Page {pagination.current_page} of {pagination.last_page}</span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                        disabled={currentPage === pagination.last_page}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Auctions Section */}
          {activeSection === 'auctions' && (
            <div className="space-y-6">
              {/* Dealer Info Cards */}
              {dealerInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="text-lg font-bold text-gray-900">₹{dealerInfo.deposit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Buying Limit</p>
                      <p className="text-lg font-bold text-gray-900">₹{dealerInfo.buying_limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Limit</p>
                      <p className="text-lg font-bold text-gray-900">₹{dealerInfo.available_limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Banner */}
              {dealerInfo && !dealerInfo.is_kyc_completed && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Complete Your KYC Verification</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete your KYC verification to unlock all features and participate in premium auctions.
                      </p>
                    </div>
                  </div>
                  <button className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap flex-shrink-0">
                    Start KYC
                  </button>
                </div>
              )}

              {/* Category Tabs - Only for Dealers */}
              {!isShowroom && (
                <div className="card p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    <button
                      onClick={() => setAuctionCategory('fresh')}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition ${auctionCategory === 'fresh' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Fresh Auctions
                    </button>
                    <button
                      onClick={() => setAuctionCategory('upcoming')}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition ${auctionCategory === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Upcoming
                    </button>
                    <button
                      onClick={() => setAuctionCategory('past')}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition ${auctionCategory === 'past' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Past Auctions
                    </button>
                    <button
                      onClick={() => setAuctionCategory('completed')}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition ${auctionCategory === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Filters */}
              <div className="card p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search auctions..."
                      value={auctionSearch}
                      onChange={(e) => { setAuctionSearch(e.target.value); setAuctionPage(1); }}
                      className="input-field w-full pl-10"
                    />
                  </div>
                </div>

                {/* Date Range Filter */}
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

                {/* Clear Filters */}
                {(auctionSearch || auctionStatus !== 'all' || auctionDateFrom || auctionDateTo || auctionSortBy !== 'start_date' || auctionSortOrder !== 'desc') && (
                  <button
                    onClick={() => {
                      setAuctionSearch('');
                      setAuctionStatus('all');
                      setAuctionDateFrom('');
                      setAuctionDateTo('');
                      setAuctionSortBy('start_date');
                      setAuctionSortOrder('desc');
                      setAuctionPage(1);
                    }}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Auction Buckets Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{isShowroom ? 'My Auctions' : 'Available Auction Buckets'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isShowroom ? filteredAuctions.length : auctionPagination.total} auction bucket{(isShowroom ? filteredAuctions.length : auctionPagination.total) !== 1 ? 's' : ''} {!isShowroom && `(Page ${auctionPagination.current_page} of ${auctionPagination.last_page})`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isShowroom && (
                    <button
                      onClick={() => router.push('/dealer/auctions/create')}
                      className="btn-primary text-sm flex items-center gap-2 px-4 py-2"
                    >
                      <Gavel className="w-4 h-4" />
                      Create Auction
                    </button>
                  )}
                  <button
                    onClick={fetchAuctions}
                    className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Auction Table */}
              {auctionsLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredAuctions.length === 0 ? (
                <div className="card p-12 text-center">
                  <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No auction buckets found</h3>
                  <p className="text-gray-600">
                    {auctionSearch || auctionZone !== 'all' || auctionStatus !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Check back soon for new auctions'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Auction Name</th>
                            {isShowroom ? (
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participants</th>
                            ) : (
                              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            )}
                            {!isShowroom && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>}
                            {!isShowroom && <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Format</th>}
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicles</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Remaining</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
                                {isShowroom ? (
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-50 text-purple-600 font-semibold text-sm rounded-lg">
                                      {auction.total_participants || 0}
                                    </span>
                                  </td>
                                ) : (
                                  <td className="px-4 py-4">
                                    <span className="text-sm text-gray-600">{auction.showroom?.name || '-'}</span>
                                  </td>
                                )}
                                {!isShowroom && (
                                  <td className="px-4 py-4">
                                    <span className="text-sm text-gray-600">Insurance</span>
                                  </td>
                                )}
                                {!isShowroom && (
                                  <td className="px-4 py-4">
                                    <span className="text-sm text-gray-600">Close</span>
                                  </td>
                                )}
                                <td className="px-4 py-4 text-center">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 text-primary font-semibold text-sm rounded-lg">
                                    {auction.total_vehicles}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status === 'live' ? 'bg-green-100 text-green-700' :
                                      status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                        status === 'ended' ? 'bg-gray-100 text-gray-600' :
                                          status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-amber-100 text-amber-700'
                                      }`}>
                                      {status.toUpperCase()}
                                    </span>
                                    {auction.is_joined && (
                                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        Joined
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm">
                                    <p className="text-gray-900">{new Date(auction.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                    <p className="text-gray-500 text-xs">{new Date(auction.end_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-gray-600">
                                    {status === 'live'
                                      ? getTimeRemaining(auction.end_date)
                                      : '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <button
                                    onClick={() => router.push(`/dealer/auctions/${auction.auction_code}`)}
                                    className="text-sm text-primary font-semibold hover:text-primary-dark hover:underline transition"
                                  >
                                    View
                                  </button>
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
                              <p className="text-sm text-gray-500 mt-0.5">{auction.showroom?.name || '-'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'live' ? 'bg-green-100 text-green-700' :
                                status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                  status === 'ended' ? 'bg-gray-100 text-gray-600' :
                                    status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-amber-100 text-amber-700'
                                }`}>
                                {status.toUpperCase()}
                              </span>
                              {auction.is_joined && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                  Joined
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {isShowroom ? (
                              <div>
                                <p className="text-gray-500 text-xs">Participants</p>
                                <p className="text-gray-900 font-semibold">{auction.total_participants || 0}</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-500 text-xs">Showroom</p>
                                <p className="text-gray-900">{auction.showroom?.name || '-'}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500 text-xs">Vehicles</p>
                              <p className="text-gray-900 font-semibold">{auction.total_vehicles}</p>
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
                          <div className="mt-4 pt-3 border-t">
                            <button className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Auction
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {!isShowroom && auctionPagination.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
                      <div className="text-sm text-gray-600">
                        Showing {((auctionPagination.current_page - 1) * auctionPagination.per_page) + 1} to {Math.min(auctionPagination.current_page * auctionPagination.per_page, auctionPagination.total)} of {auctionPagination.total} auctions
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAuctionPage(p => Math.max(1, p - 1))}
                          disabled={auctionPage === 1}
                          className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(5, auctionPagination.last_page))].map((_, i) => {
                            let pageNum;
                            if (auctionPagination.last_page <= 5) {
                              pageNum = i + 1;
                            } else if (auctionPage <= 3) {
                              pageNum = i + 1;
                            } else if (auctionPage >= auctionPagination.last_page - 2) {
                              pageNum = auctionPagination.last_page - 4 + i;
                            } else {
                              pageNum = auctionPage - 2 + i;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => setAuctionPage(pageNum)}
                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${auctionPage === pageNum
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setAuctionPage(p => Math.min(auctionPagination.last_page, p + 1))}
                          disabled={auctionPage === auctionPagination.last_page}
                          className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sales Section */}
          {activeSection === 'sales' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Sales</h2>
              <div className="card p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sales Management</h3>
                <p className="text-gray-600">Track your sales and revenue here</p>
              </div>
            </div>
          )}

          {/* Customers Section */}
          {activeSection === 'customers' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Customers</h2>
              <div className="card p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
                <p className="text-gray-600">Manage your customer relationships here</p>
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {activeSection === 'appointments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Customer Appointments</h2>
              {appointmentsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : dealerAppointments.length === 0 ? (
                <div className="card p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
                  <p className="text-gray-600">Customer test drive requests will appear here</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {dealerAppointments.map((appointment) => (
                    <div key={appointment.id} className="card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{appointment.vehicle?.name || 'Showroom Visit'}</h3>
                          <p className="text-sm text-gray-600">Customer: {appointment.customer?.name || 'N/A'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.customer?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4" />
                          <span>{appointment.customer?.email || 'N/A'}</span>
                        </div>
                      </div>
                      {appointment.customer_message && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Customer Message:</p>
                          <p className="text-sm text-gray-800">{appointment.customer_message}</p>
                        </div>
                      )}
                      {appointment.status === 'pending' && (
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                          >
                            Confirm Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mark as Sold Modal */}
      {showSoldModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Mark as Sold
              </h3>
              <button onClick={() => setShowSoldModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</p>
              <p className="text-xs text-gray-600">{selectedVehicle.registration_number}</p>
            </div>
            <form onSubmit={submitMarkAsSold} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sold Price *</label>
                <input
                  type="number"
                  required
                  value={soldForm.sold_price}
                  onChange={(e) => setSoldForm({ ...soldForm, sold_price: e.target.value })}
                  className="input-field"
                  placeholder="Enter sold price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sold To</label>
                <input
                  type="text"
                  value={soldForm.sold_to}
                  onChange={(e) => setSoldForm({ ...soldForm, sold_to: e.target.value })}
                  className="input-field"
                  placeholder="Buyer name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={soldForm.sold_notes}
                  onChange={(e) => setSoldForm({ ...soldForm, sold_notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>
              {soldMessage && (
                <div className={`p-3 rounded-lg text-center font-medium ${soldMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {soldMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSoldModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={soldLoading} className="flex-1 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50">
                  {soldLoading ? 'Marking...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
