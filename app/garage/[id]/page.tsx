'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Car, ArrowLeft, Shield, Wrench, FileText, Calendar } from 'lucide-react';
import { api, auth } from '@/lib/api';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function VehicleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const fetchVehicle = async () => {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await api.getGarageVehicle(token, params.id as string);
        if (response.success && response.vehicle) {
          setVehicle(response.vehicle);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    const token = auth.getToken();
    if (!token || !vehicle) return;

    try {
      const response = await api.deleteGarageVehicle(token, vehicle.id.toString());
      if (response.success) {
        router.push('/dashboard?tab=garage');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleEdit = () => {
    if (!vehicle) return;
    
    // Helper to format date for input[type="date"] (YYYY-MM-DD)
    const formatDateForInput = (dateStr: string | null) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    
    setEditForm({
      vehicle_number: vehicle.vehicle_number || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      registration_date: formatDateForInput(vehicle.registration_date),
      insurance_expiry: formatDateForInput(vehicle.insurance_expiry),
      pollution_expiry: formatDateForInput(vehicle.pollution_expiry),
      has_warranty: vehicle.has_warranty || false,
      warranty_expiry: formatDateForInput(vehicle.warranty_expiry),
      last_service_date: formatDateForInput(vehicle.last_service_date),
      next_service_date: formatDateForInput(vehicle.next_service_date),
      notes: vehicle.notes || '',
    });
    setVehicleImage(null);
    setImagePreview('');
    setShowEditModal(true);
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

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token || !vehicle) return;

    setEditLoading(true);
    setEditMessage('');
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === 'has_warranty') {
          formData.append(key, value ? '1' : '0');
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });
      if (vehicleImage) {
        formData.append('vehicle_image', vehicleImage);
      }

      const response = await api.updateGarageVehicle(token, vehicle.id.toString(), formData);
      if (response.success) {
        setEditMessage('Vehicle updated successfully!');
        setTimeout(() => {
          setShowEditModal(false);
          window.location.reload();
        }, 1500);
      } else {
        setEditMessage(response.message || 'Failed to update vehicle');
      }
    } catch (error) {
      setEditMessage('Failed to update vehicle');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <DashboardSidebar />
          
          <div className="space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Garage</span>
            </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-500 to-indigo-600">
            {(vehicle.vehicle_image || vehicle.vehicle_image_url) ? (
              <Image src={vehicle.vehicle_image_url || vehicle.vehicle_image} alt={vehicle.vehicle_number} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="w-32 h-32 text-white/30" />
              </div>
            )}
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehicle.vehicle_number}</h1>
                <p className="text-xl text-gray-600">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleEdit} className="px-4 py-2 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-lg flex items-center gap-2 transition font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg flex items-center gap-2 transition font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex gap-2 p-4">
              <button onClick={() => setActiveTab('details')} className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'details' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Details
              </button>
              <button onClick={() => setActiveTab('documents')} className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'documents' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Documents
              </button>
              <button onClick={() => setActiveTab('service')} className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'service' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Service History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Information</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Brand</p>
                      <p className="font-bold text-gray-900">{vehicle.brand}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Model</p>
                      <p className="font-bold text-gray-900">{vehicle.model}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Year</p>
                      <p className="font-bold text-gray-900">{vehicle.year}</p>
                    </div>
                    {vehicle.registration_date && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Registration Date</p>
                        <p className="font-bold text-gray-900">{new Date(vehicle.registration_date).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary-600" />
                    Expiry Dates
                  </h2>
                  <div className="space-y-4">
                    {vehicle.insurance_expiry && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Insurance Expiry</p>
                        <p className="font-bold text-gray-900">{new Date(vehicle.insurance_expiry).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                    {vehicle.pollution_expiry && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Pollution Expiry</p>
                        <p className="font-bold text-gray-900">{new Date(vehicle.pollution_expiry).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                    {vehicle.has_warranty && vehicle.warranty_expiry && (
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Warranty Expiry</p>
                        <p className="font-bold text-gray-900">Until {new Date(vehicle.warranty_expiry).toLocaleDateString('en-GB')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {vehicle.notes && (
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notes</h2>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-700">{vehicle.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents uploaded</h3>
                <p className="text-gray-600">Upload vehicle documents like RC, insurance papers, etc.</p>
              </div>
            )}

            {activeTab === 'service' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-orange-600" />
                  Service History
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {vehicle.last_service_date && (
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">Last Service</p>
                      <p className="font-bold text-gray-900">{new Date(vehicle.last_service_date).toLocaleDateString('en-GB')}</p>
                    </div>
                  )}
                  {vehicle.next_service_date && (
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">Next Service</p>
                      <p className="font-bold text-gray-900">{new Date(vehicle.next_service_date).toLocaleDateString('en-GB')}</p>
                    </div>
                  )}
                </div>
                {!vehicle.last_service_date && !vehicle.next_service_date && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No service history</h3>
                    <p className="text-gray-600">Add service records to track maintenance</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Vehicle</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
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
                  ) : (vehicle.vehicle_image_url || vehicle.vehicle_image) ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                      <Image src={vehicle.vehicle_image_url || vehicle.vehicle_image} alt="Current" fill className="object-cover" />
                      <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition">
                        <span className="text-white text-xs font-medium">Change Image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition">
                      <Car className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Upload a new photo to update vehicle image</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP (Max 5MB)</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={editForm.vehicle_number}
                    onChange={(e) => setEditForm({ ...editForm, vehicle_number: e.target.value.toUpperCase() })}
                    className="input-field uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editForm.brand}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                  <input
                    type="date"
                    value={editForm.registration_date}
                    onChange={(e) => setEditForm({ ...editForm, registration_date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={editForm.insurance_expiry}
                    onChange={(e) => setEditForm({ ...editForm, insurance_expiry: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pollution Expiry</label>
                  <input
                    type="date"
                    value={editForm.pollution_expiry}
                    onChange={(e) => setEditForm({ ...editForm, pollution_expiry: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
                  <input
                    type="date"
                    value={editForm.last_service_date}
                    onChange={(e) => setEditForm({ ...editForm, last_service_date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
                  <input
                    type="date"
                    value={editForm.next_service_date}
                    onChange={(e) => setEditForm({ ...editForm, next_service_date: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.has_warranty}
                    onChange={(e) => setEditForm({ ...editForm, has_warranty: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Has Warranty</span>
                </label>
              </div>
              
              {editForm.has_warranty && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
                  <input
                    type="date"
                    value={editForm.warranty_expiry}
                    onChange={(e) => setEditForm({ ...editForm, warranty_expiry: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  className="input-field"
                />
              </div>
              
              {editMessage && (
                <div className={`p-3 rounded-lg text-center font-medium ${editMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {editMessage}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50">
                  {editLoading ? 'Updating...' : 'Update Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
