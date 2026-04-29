'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';
import { ArrowLeft, Calendar, Car, Plus, IndianRupee, Clock, FileText, Building2, Gavel, LogIn, X, Trash2, Users } from 'lucide-react';
import Image from 'next/image';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

export default function AuctionDetailPage() {
  const { code } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [auction, setAuction] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableLoading, setAvailableLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
  const [addingVehicles, setAddingVehicles] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [removingVehicle, setRemovingVehicle] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const isShowroom = user?.user_type === 'showroom';

  useEffect(() => {
    if (code) {
      fetchAuction();
      fetchVehicles();
    }
  }, [code]);

  const fetchAuction = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      const res = await api.getAuctionDetail(code as string, token || undefined);
      if (res.success) {
        setAuction(res.data);
        if (res.data?.is_joined) setJoined(true);
      }
    } catch (err) {
      console.error('Failed to fetch auction:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const token = auth.getToken();
      const res = await api.getAuctionVehicles(code as string, token || undefined);
      if (res.success) setVehicles(res.vehicles || []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      setParticipantsLoading(true);
      const token = auth.getToken();
      if (!token) return;
      const res = await api.getAuctionParticipants(code as string, token);
      if (res.success || res.participants) {
        setParticipants(res.participants || []);
      }
    } catch (err) {
      console.error('Failed to fetch participants:', err);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const fetchAvailableVehicles = async () => {
    try {
      setAvailableLoading(true);
      const token = auth.getToken();
      if (!token) return;
      const res = await api.getMyListings(token, 'approved');
      if (res.success && res.data) {
        setAvailableVehicles(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch available vehicles:', err);
    } finally {
      setAvailableLoading(false);
    }
  };

  const toggleVehicle = (v: any) => {
    const exists = selectedVehicles.find(sv => sv.vehicle_id === v.vehicle_id);
    if (exists) {
      setSelectedVehicles(prev => prev.filter(sv => sv.vehicle_id !== v.vehicle_id));
    } else {
      setSelectedVehicles(prev => [...prev, {
        vehicle_id: v.vehicle_id,
        name: v.name || `${v.brand || ''} ${v.model || ''} ${v.variant || ''}`.trim(),
        reserve_price: Number(v.final_price || v.expected_selling_price || v.purchase_price || 0),
      }]);
    }
  };

  const openVehiclePicker = () => {
    setShowPicker(true);
    fetchAvailableVehicles();
  };

  const openParticipants = () => {
    setShowParticipants(true);
    fetchParticipants();
  };

  const handleAddVehicles = async () => {
    if (selectedVehicles.length === 0) return;
    
    try {
      setAddingVehicles(true);
      const token = auth.getToken();
      if (!token) return;
      
      const res = await api.addVehiclesToAuction(code as string, selectedVehicles, token);
      
      if (res.success) {
        alert('Vehicles added successfully!');
        setShowPicker(false);
        setSelectedVehicles([]);
        fetchVehicles();
      } else {
        alert(res.message || 'Failed to add vehicles');
      }
    } catch (err: any) {
      console.error('Failed to add vehicles:', err);
      alert(err.message || 'Failed to add vehicles. Please try again.');
    } finally {
      setAddingVehicles(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      setShowStatusMenu(false);
      const token = auth.getToken();
      if (!token) return;
      
      const res = await api.updateAuctionStatus(code as string, newStatus, token);
      
      if (res.success) {
        alert(`Auction status updated to ${newStatus}`);
        fetchAuction();
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to remove this vehicle from the auction?')) return;
    
    try {
      setRemovingVehicle(vehicleId);
      const token = auth.getToken();
      if (!token) return;
      
      const res = await api.removeVehiclesFromAuction(code as string, [vehicleId], token);
      
      if (res.success) {
        alert('Vehicle removed successfully');
        fetchVehicles();
      } else {
        alert(res.message || 'Failed to remove vehicle');
      }
    } catch (err: any) {
      console.error('Failed to remove vehicle:', err);
      alert(err.message || 'Failed to remove vehicle');
    } finally {
      setRemovingVehicle(null);
    }
  };

  const handleJoinAuction = async () => {
    try {
      setJoining(true);
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await api.joinAuction(code as string, token);
      if (res.success) {
        setJoined(true);
        alert('Successfully joined the auction!');
      } else {
        alert(res.message || 'Failed to join auction');
      }
    } catch (err) {
      console.error('Failed to join auction:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const getStatus = () => {
    if (!auction) return 'upcoming';
    if (auction.status === 'draft') return 'draft';
    const now = Date.now();
    const start = new Date(auction.start_date).getTime();
    const end = new Date(auction.end_date).getTime();
    if (auction.status === 'active' && now >= start && now <= end) return 'live';
    if (auction.status === 'active' && now < start) return 'upcoming';
    if (now > end) return 'ended';
    return auction.status || 'upcoming';
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      live: 'bg-green-100 text-green-700',
      upcoming: 'bg-blue-100 text-blue-700',
      ended: 'bg-gray-100 text-gray-600',
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-amber-100 text-amber-700',
    };
    return styles[status] || 'bg-amber-100 text-amber-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Auction not found.</p>
        <button onClick={() => router.back()} className="btn-primary mt-4">Go Back</button>
      </div>
    );
  }

  const status = getStatus();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push(getDashboardRoute(user?.user_type))}
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Auction Header */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{auction.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(status)}`}>
              {status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isShowroom && (
              <button
                onClick={openParticipants}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                <Users className="w-4 h-4" />
                Participants ({auction.total_participants || 0})
              </button>
            )}
            {isShowroom && (status === 'draft' || status === 'pending') && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={updatingStatus}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Update Status'
                  )}
                </button>
                {showStatusMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => handleUpdateStatus('active')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Make Active
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('cancelled')}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Cancel Auction
                    </button>
                  </div>
                )}
              </div>
            )}
            {isShowroom && status === 'live' && (
              <button
                onClick={() => handleUpdateStatus('completed')}
                disabled={updatingStatus}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-600 text-white hover:bg-gray-700 transition disabled:opacity-50"
              >
                {updatingStatus ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Complete Auction'
                )}
              </button>
            )}
            {!isShowroom && (status === 'live' || status === 'upcoming') && (
              <button
                onClick={handleJoinAuction}
                disabled={joining || joined}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                  joined
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50'
                }`}
              >
                {joining ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : joined ? (
                  <Gavel className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {joining ? 'Joining...' : joined ? 'Joined' : 'Join Auction'}
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">{auction.auction_code}</p>
        {auction.description && (
          <p className="text-sm text-gray-600">{auction.description}</p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t">
          {auction.created_by && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="text-sm font-semibold text-gray-900">{auction.created_by.name}</p>
                {auction.created_by.city && (
                  <p className="text-xs text-gray-400">{auction.created_by.city}</p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(auction.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(auction.start_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(auction.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(auction.end_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Vehicles</p>
              <p className="text-sm font-semibold text-gray-900">{auction.total_vehicles || 0}</p>
            </div>
          </div>
          {auction.total_participants !== undefined && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Participants</p>
                <p className="text-sm font-semibold text-gray-900">{auction.total_participants}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      {auction.terms_and_conditions && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Terms & Conditions</h2>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {auction.terms_and_conditions}
          </div>
        </div>
      )}

      {/* Vehicles Section */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">
              Vehicles ({vehicles.length})
            </h2>
          </div>
          {isShowroom && (
            <button
              onClick={openVehiclePicker}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          )}
        </div>

        {vehiclesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No vehicles added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {isShowroom
                ? 'Add vehicles to this auction to get started'
                : 'Vehicles will appear here once the showroom adds them'}
            </p>
            {isShowroom && (
              <button
                onClick={openVehiclePicker}
                className="btn-primary text-sm mt-4 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Vehicle
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reserve Price</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Current Bid</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    {(joined || isShowroom) && <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vehicles.map((v: any) => (
                    <tr key={v.vehicle_id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {v.image_url ? (
                              <Image src={v.image_url} alt={v.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                            <p className="text-xs text-gray-400">{v.vehicle_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
                          <span>{v.year}</span>
                          <span className="capitalize">{v.fuel_type}</span>
                          <span className="capitalize">{v.transmission}</span>
                          <span>{Number(v.km_driven).toLocaleString('en-IN')} km</span>
                          {v.color && <span>{v.color}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-bold text-gray-900">
                          ₹{Number(v.reserve_price).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {v.current_bid ? (
                          <span className="font-bold text-green-600">
                            ₹{Number(v.current_bid).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No bids</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(v.status)}`}>
                          {(v.status || '').toUpperCase()}
                        </span>
                      </td>
                      {(joined || isShowroom) && (
                        <td className="px-4 py-4 text-center">
                          {isShowroom ? (
                            <button
                              onClick={() => handleRemoveVehicle(v.vehicle_id)}
                              disabled={removingVehicle === v.vehicle_id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {removingVehicle === v.vehicle_id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              {removingVehicle === v.vehicle_id ? 'Removing...' : 'Remove'}
                            </button>
                          ) : (
                            <button
                              onClick={() => router.push(`/dealer/auctions/${code}/bid/${v.vehicle_id}`)}
                              disabled={status !== 'live'}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                                status === 'live'
                                  ? 'bg-primary text-white hover:bg-primary-dark'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Gavel className="w-3.5 h-3.5" />
                              {status === 'live' ? 'Bid Now' : status === 'upcoming' ? 'Not Started' : 'Ended'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {vehicles.map((v: any) => (
                <div key={v.vehicle_id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {v.image_url ? (
                        <Image src={v.image_url} alt={v.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{v.name}</h3>
                      <div className="flex flex-wrap gap-x-2 text-xs text-gray-500 mt-1">
                        <span>{v.year}</span>
                        <span className="capitalize">{v.fuel_type}</span>
                        <span className="capitalize">{v.transmission}</span>
                        <span>{Number(v.km_driven).toLocaleString('en-IN')} km</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge(v.status)}`}>
                      {(v.status || '').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Reserve Price</p>
                      <p className="font-bold text-gray-900 text-sm">₹{Number(v.reserve_price).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Current Bid</p>
                      {v.current_bid ? (
                        <p className="font-bold text-green-600 text-sm">₹{Number(v.current_bid).toLocaleString('en-IN')}</p>
                      ) : (
                        <p className="text-sm text-gray-400">No bids</p>
                      )}
                    </div>
                  </div>
                  {isShowroom ? (
                    <button
                      onClick={() => handleRemoveVehicle(v.vehicle_id)}
                      disabled={removingVehicle === v.vehicle_id}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {removingVehicle === v.vehicle_id ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Removing...</>
                      ) : (
                        <><Trash2 className="w-4 h-4" />Remove from Auction</>
                      )}
                    </button>
                  ) : joined ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/dealer/auctions/${code}/bid/${v.vehicle_id}`); }}
                      disabled={status !== 'live'}
                      className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                        status === 'live'
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Gavel className="w-4 h-4" />
                      {status === 'live' ? 'Bid Now' : status === 'upcoming' ? 'Not Started' : 'Ended'}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Vehicle Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-900">Select Vehicles</h3>
              <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : availableVehicles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  No approved vehicles available in your inventory
                </p>
              ) : availableVehicles.filter(av => !vehicles.find(v => v.vehicle_id === av.vehicle_id)).length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  All available vehicles are already in this auction
                </p>
              ) : (
                <div className="space-y-2">
                  {availableVehicles
                    .filter(av => !vehicles.find(v => v.vehicle_id === av.vehicle_id))
                    .map((v: any) => {
                    const isSelected = selectedVehicles.find(sv => sv.vehicle_id === v.vehicle_id);
                    return (
                      <button
                        key={v.vehicle_id}
                        type="button"
                        onClick={() => toggleVehicle(v)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition text-left ${
                          isSelected ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {v.image_url ? (
                            <Image src={v.image_url} alt={v.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {v.name || `${v.brand || ''} ${v.model || ''} ${v.variant || ''}`.trim()}
                          </p>
                          <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                            {v.year && <span>{v.year}</span>}
                            {v.fuel_type && <span className="capitalize">{v.fuel_type}</span>}
                            {v.km_driven && <span>{Number(v.km_driven).toLocaleString('en-IN')} km</span>}
                          </div>
                        </div>
                        {(v.final_price || v.expected_selling_price) && (
                          <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                            ₹{Number(v.final_price || v.expected_selling_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t space-y-3">
              {selectedVehicles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedVehicles.map(sv => (
                    <div key={sv.vehicle_id} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 truncate text-gray-700">{sv.name}</span>
                      <input
                        type="number"
                        value={sv.reserve_price || ''}
                        onChange={e => setSelectedVehicles(prev =>
                          prev.map(s => s.vehicle_id === sv.vehicle_id
                            ? { ...s, reserve_price: Number(e.target.value) } : s))}
                        className="input-field w-28 text-xs py-1"
                        placeholder="Reserve price"
                      />
                      <button
                        onClick={() => setSelectedVehicles(prev => prev.filter(s => s.vehicle_id !== sv.vehicle_id))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={handleAddVehicles}
                disabled={addingVehicles || selectedVehicles.length === 0}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingVehicles ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
                ) : (
                  <>Add {selectedVehicles.length > 0 ? `${selectedVehicles.length} ` : ''}Vehicle{selectedVehicles.length !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-xl rounded-t-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Auction Participants</h3>
              </div>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {participantsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No participants yet</p>
                  <p className="text-sm text-gray-400 mt-1">Dealers will appear here once they join the auction</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.map((p: any, index: number) => (
                    <div key={p.dealer_id || index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-lg">{p.name?.charAt(0) || 'D'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                          {p.phone && <span>{p.phone}</span>}
                          {p.email && <span className="truncate">{p.email}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-xs text-gray-600 font-medium">
                          {new Date(p.joined_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Participants</span>
                <span className="font-bold text-gray-900">{participants.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
