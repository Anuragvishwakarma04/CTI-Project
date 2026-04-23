'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, IndianRupee, Car, Gauge, Fuel, Users, Edit, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { api, auth } from '@/lib/api';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldForm, setSoldForm] = useState({ sold_price: '', sold_to: '', sold_notes: '' });
  const [soldLoading, setSoldLoading] = useState(false);
  const [soldMessage, setSoldMessage] = useState('');

  useEffect(() => {
    const savedUser = auth.getUser();
    console.log('User from auth:', savedUser);
    setUser(savedUser);
    fetchVehicle();
  }, [params.id]);

  const handleBackToDashboard = () => {
    const savedUser = auth.getUser();
    if (savedUser?.user_type === 'dealer' || savedUser?.user_type === 'showroom') {
      const referrer = sessionStorage.getItem('dashboard_section');
      if (referrer) {
        router.push(`/dealer/dashboard?section=${referrer}`);
      } else {
        router.push('/dealer/dashboard');
      }
    } else {
      const referrer = sessionStorage.getItem('customer_dashboard_tab');
      if (referrer) {
        router.push(`/dashboard?tab=${referrer}`);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const fetchVehicle = async () => {
    const token = auth.getToken();
    const savedUser = auth.getUser();
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching vehicle:', params.id);
      // Always use authenticated API for listings
      const response = await api.getVehicle(token, params.id as string);
      
      console.log('Vehicle response:', response);
      if (response.success && response.data) {
        setVehicle(response.data);
      } else {
        console.error('Vehicle not found or error:', response);
      }
    } catch (err) {
      console.error('Failed to fetch vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    const savedUser = auth.getUser();
    if (savedUser?.user_type === 'dealer' || savedUser?.user_type === 'showroom') {
      router.push(`/dealer/edit-vehicle/${vehicle.vehicle_id}`);
    }
  };

  const handleDelete = async () => {
    const savedUser = auth.getUser();
    if (savedUser?.user_type !== 'dealer' && savedUser?.user_type !== 'showroom') {
      alert('Only dealers and showrooms can delete listings');
      return;
    }
    if (!confirm('Delete this vehicle?')) return;
    const token = auth.getToken();
    if (!token) return;
    const response = await api.deleteVehicle(token, vehicle.vehicle_id);
    if (response.success) {
      router.push('/listings');
    } else {
      alert(response.message || 'Failed to delete');
    }
  };

  const handleMarkAsSold = () => {
    setSoldForm({ 
      sold_price: vehicle.expected_selling_price?.toString() || '', 
      sold_to: '', 
      sold_notes: '' 
    });
    setShowSoldModal(true);
    setSoldMessage('');
  };

  const submitMarkAsSold = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) return;

    setSoldLoading(true);
    setSoldMessage('');
    try {
      const response = await api.markVehicleAsSold(token, vehicle.vehicle_id, {
        sold_price: parseInt(soldForm.sold_price),
        sold_to: soldForm.sold_to,
        sold_notes: soldForm.sold_notes,
      });
      if (response.success) {
        setSoldMessage('Vehicle marked as sold successfully!');
        setTimeout(() => {
          setShowSoldModal(false);
          fetchVehicle();
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
    const styles: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700',
      under_review: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      live: 'bg-green-100 text-green-700',
      available: 'bg-green-100 text-green-700',
      sold: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle not found</h3>
        <button 
          onClick={handleBackToDashboard} 
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const images = vehicle.images?.map((img: any) => img.url || img) || (vehicle.featured_image_url ? [vehicle.featured_image_url] : []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button 
            onClick={handleBackToDashboard} 
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.year} {vehicle.brand} {vehicle.model} {vehicle.variant || ''}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(vehicle.status)}`}>
                  {vehicle.status}
                </span>
                {vehicle.registration_number && (
                  <span className="text-sm text-gray-600 font-medium">{vehicle.registration_number}</span>
                )}
              </div>
            </div>
            {(user?.user_type === 'dealer' || user?.user_type === 'showroom') && (
              <div className="flex gap-2">
                <button onClick={handleEdit} className="btn-primary flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {vehicle.status !== 'sold' && (
                  <button onClick={handleMarkAsSold} className="btn-secondary bg-green-600 text-white hover:bg-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark as Sold
                  </button>
                )}
                <button onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            {vehicle.expected_selling_price && (
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Selling Price</p>
                    <p className="text-3xl font-bold text-gray-900">₹{vehicle.expected_selling_price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Gallery */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Vehicle Images</h2>
              <div className="relative h-96 rounded-xl overflow-hidden mb-4 bg-gray-100">
                {images[selectedImage] ? (
                  <Image src={images[selectedImage]} alt="Vehicle" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(idx)} 
                      className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden transition ${
                        selectedImage === idx ? 'ring-4 ring-primary shadow-lg' : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-primary'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Year</p>
                    <p className="font-bold text-gray-900">{vehicle.year}</p>
                  </div>
                </div>
                {vehicle.fuel_type && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Fuel Type</p>
                      <p className="font-bold text-gray-900">{vehicle.fuel_type}</p>
                    </div>
                  </div>
                )}
                {vehicle.km_driven && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Kms Driven</p>
                      <p className="font-bold text-gray-900">{vehicle.km_driven.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {vehicle.ownership && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Ownership</p>
                      <p className="font-bold text-gray-900">{vehicle.ownership}</p>
                    </div>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Transmission</p>
                      <p className="font-bold text-gray-900">{vehicle.transmission}</p>
                    </div>
                  </div>
                )}
                {vehicle.city && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="font-bold text-gray-900">{vehicle.city}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Listing Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Status</span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadge(vehicle.status)}`}>
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
                {vehicle.created_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Created</span>
                    <span className="text-sm font-semibold text-gray-900">{new Date(vehicle.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {vehicle.updated_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Updated</span>
                    <span className="text-sm font-semibold text-gray-900">{new Date(vehicle.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {(user?.user_type === 'dealer' || user?.user_type === 'showroom') && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <button onClick={handleEdit} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                    <Edit className="w-5 h-5" />
                    {vehicle.status === 'draft' ? 'Complete Listing' : 'Edit Listing'}
                  </button>
                  {vehicle.status !== 'sold' && (
                    <button onClick={handleMarkAsSold} className="w-full bg-green-600 text-white hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2 py-3 transition">
                      <CheckCircle className="w-5 h-5" />
                      Mark as Sold
                    </button>
                  )}
                  <button onClick={handleDelete} className="w-full btn-secondary text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 py-3">
                    <Trash2 className="w-5 h-5" />
                    Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mark as Sold Modal */}
      {showSoldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Mark as Sold
              </h3>
              <button onClick={() => setShowSoldModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</p>
              <p className="text-xs text-gray-600">{vehicle.registration_number}</p>
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
