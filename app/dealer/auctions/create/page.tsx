'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';
import { ArrowLeft, Gavel, Car, Plus, X, IndianRupee } from 'lucide-react';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

interface SelectedVehicle {
  vehicle_id: string;
  name: string;
  reserve_price: number;
}

export default function CreateAuctionPage() {
  const router = useRouter();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  

  const [form, setForm] = useState({
    title: '',
    description: '',
    terms_and_conditions: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (!user) return;
    if (user.user_type !== 'showroom') {
      router.push('/dealer/dashboard');
      return;
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const token = auth.getToken();
    if (!token) return;
    
    try {
      setVehiclesLoading(true);
      const res = await api.getMyListings(token, 'approved');
      if (res.success && res.data) {
        setVehicles(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.start_date) e.start_date = 'Start date is required';
    if (!form.end_date) e.end_date = 'End date is required';
    if (form.start_date && form.end_date && form.start_date >= form.end_date)
      e.end_date = 'End date must be after start date';
    if (selectedVehicles.length === 0) e.vehicles = 'At least one vehicle is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const token = auth.getToken();
    if (!token) {
      setError('Please login to continue');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        title: form.title,
        description: form.description,
        terms_and_conditions: form.terms_and_conditions,
        start_date: form.start_date.replace('T', ' ') + ':00',
        end_date: form.end_date.replace('T', ' ') + ':00',
        vehicle_ids: selectedVehicles.map(sv => sv.vehicle_id),
        reserve_prices: selectedVehicles.map(sv => sv.reserve_price),
      };
      
      
      
      const res = await api.createAuction(token, payload);
      
      console.log('API Response:', res);
      
      if (res.success) {
        alert('Auction created successfully!');
        router.push(getDashboardRoute(user?.user_type));
      } else if (res.errors) {
        const fe: Record<string, string> = {};
        Object.keys(res.errors).forEach(k => { fe[k] = res.errors[k][0]; });
        setErrors(fe);
        setError(Object.values(res.errors).flat().join(', ') as string);
      } else {
        setError(res.message || 'Failed to create auction');
      }
    } catch (err: any) {
      console.error('Error creating auction:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const availableVehicles = vehicles.filter(
    v => !selectedVehicles.find(sv => sv.vehicle_id === v.vehicle_id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <button onClick={() => router.push(getDashboardRoute(user?.user_type))}
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Gavel className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Auction</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Details */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Auction Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              className={`input-field w-full ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g. March 2026 Car Auction" />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className="input-field w-full" rows={3} placeholder="Describe this auction..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea value={form.terms_and_conditions}
              onChange={e => handleChange('terms_and_conditions', e.target.value)}
              className="input-field w-full" rows={3} placeholder="e.g. All sales are final..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="datetime-local" value={form.start_date}
                onChange={e => handleChange('start_date', e.target.value)}
                className={`input-field w-full ${errors.start_date ? 'border-red-500' : ''}`} />
              {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="datetime-local" value={form.end_date}
                onChange={e => handleChange('end_date', e.target.value)}
                className={`input-field w-full ${errors.end_date ? 'border-red-500' : ''}`} />
              {errors.end_date && <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>}
            </div>
          </div>
        </div>

        {/* Vehicles */}
        <div className="card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Vehicles ({selectedVehicles.length})</h2>
            <button type="button" onClick={() => setShowPicker(true)}
              className="btn-secondary text-sm flex items-center gap-2 px-4 py-2">
              <Plus className="w-4 h-4" /> Add Vehicles
            </button>
          </div>

          {errors.vehicles && <p className="text-red-600 text-sm">{errors.vehicles}</p>}
          
          {selectedVehicles.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <Car className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No vehicles selected</p>
              <button type="button" onClick={() => setShowPicker(true)}
                className="text-primary text-sm font-semibold mt-2 hover:underline">
                Select from your inventory
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedVehicles.map(sv => (
                <div key={sv.vehicle_id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{sv.name}</p>
                    <p className="text-xs text-gray-400">{sv.vehicle_id}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                    <input type="number" value={sv.reserve_price || ''}
                      onChange={e => setSelectedVehicles(prev =>
                        prev.map(s => s.vehicle_id === sv.vehicle_id
                          ? { ...s, reserve_price: Number(e.target.value) } : s))}
                      className="input-field w-28 text-sm py-1.5" placeholder="Reserve price" />
                  </div>
                  <button type="button"
                    onClick={() => setSelectedVehicles(prev => prev.filter(s => s.vehicle_id !== sv.vehicle_id))}
                    className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
          ) : (
            <><Gavel className="w-5 h-5" />Create Auction</>
          )}
        </button>
      </form>

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
              {vehiclesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : availableVehicles.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  {vehicles.length === 0 ? 'No vehicles in your inventory' : 'All vehicles already selected'}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableVehicles.map((v: any) => (
                    <button key={v.vehicle_id} type="button" onClick={() => toggleVehicle(v)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary transition text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-gray-400" />
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
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <button type="button" onClick={() => setShowPicker(false)}
                className="btn-primary w-full py-2.5 text-sm">
                Done ({selectedVehicles.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
