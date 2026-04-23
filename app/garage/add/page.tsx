'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Car, ArrowLeft } from 'lucide-react';
import { api, auth } from '@/lib/api';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function AddVehiclePage() {
  const router = useRouter();
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    registration_date: getTodayDate(),
    insurance_expiry: getTodayDate(),
    pollution_expiry: getTodayDate(),
    has_warranty: false,
    warranty_expiry: getTodayDate(),
    last_service_date: getTodayDate(),
    next_service_date: getTodayDate(),
    notes: '',
  });
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [vehicleMessage, setVehicleMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (vehicleForm.brand) {
      const selectedBrand = brands.find(b => b.brand_name === vehicleForm.brand);
      if (selectedBrand) {
        fetchModels(selectedBrand.id);
      }
    } else {
      setModels([]);
    }
  }, [vehicleForm.brand, brands]);

  const fetchBrands = async () => {
    try {
      const data = await api.getVehicleBrands();
      if (data.success) {
        setBrands(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchModels = async (brandId: number) => {
    try {
      const data = await api.getVehicleModels(brandId);
      if (data.success) {
        setModels(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
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

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) return;

    setVehicleMessage('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(vehicleForm).forEach(([key, value]) => {
        // Convert boolean to 0 or 1
        if (key === 'has_warranty') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, value.toString());
        }
      });
      if (vehicleImage) {
        formData.append('vehicle_image', vehicleImage);
      }

      const response = await api.addGarageVehicle(token, formData);
      if (response.success) {
        setVehicleMessage('Vehicle added successfully!');
        setTimeout(() => {
          router.push('/dashboard?tab=garage');
        }, 1500);
      } else {
        setVehicleMessage(response.message || 'Failed to add vehicle');
      }
    } catch (error) {
      setVehicleMessage('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <DashboardSidebar activeTab="garage" />
          
          <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Garage</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Vehicle to Garage</h1>
              
              <form onSubmit={handleAddVehicle} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => { setVehicleImage(null); setImagePreview(''); }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition">
                        <Car className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Upload Image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Upload a photo of your vehicle</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP (Max 5MB)</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.vehicle_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value.toUpperCase() })}
                      placeholder="MH12AB1234"
                      className="input-field uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select
                      value={vehicleForm.brand}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value, model: '' })}
                      className="input-field"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.brand_name}>{brand.brand_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <select
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      className="input-field"
                      disabled={!vehicleForm.brand}
                    >
                      <option value="">Select Model</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.model_name}>{model.model_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={vehicleForm.year}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <input
                      type="date"
                      value={vehicleForm.registration_date}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, registration_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                    <input
                      type="date"
                      value={vehicleForm.insurance_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, insurance_expiry: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pollution Expiry</label>
                    <input
                      type="date"
                      value={vehicleForm.pollution_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, pollution_expiry: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
                    <input
                      type="date"
                      value={vehicleForm.last_service_date}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, last_service_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
                    <input
                      type="date"
                      value={vehicleForm.next_service_date}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, next_service_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleForm.has_warranty}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, has_warranty: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Has Warranty</span>
                  </label>
                </div>
                
                {vehicleForm.has_warranty && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
                    <input
                      type="date"
                      value={vehicleForm.warranty_expiry}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, warranty_expiry: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={vehicleForm.notes}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, notes: e.target.value })}
                    placeholder="Any additional notes about the vehicle..."
                    rows={3}
                    className="input-field"
                  />
                </div>
                
                {vehicleMessage && (
                  <div className={`p-3 rounded-lg text-center font-medium ${vehicleMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {vehicleMessage}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50">
                    {loading ? 'Adding...' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
