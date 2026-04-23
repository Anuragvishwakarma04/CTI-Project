'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';
import { Car, Edit, Eye, MapPin, Calendar, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Vehicle {
  vehicle_id: string;
  brand: string;
  model: string;
  year: number;
  registration_number: string;
  city: string;
  status: string;
  featured_image_url?: string;
  expected_selling_price?: number;
}

export default function VehiclesPage() {
  const router = useRouter();
  const { user } = useStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, per_page: 15, current_page: 1, last_page: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchVehicles();
  }, [user, router, currentPage, statusFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) return;

      const response = await api.getVehicles(token, statusFilter || undefined, currentPage);
      if (response.success) {
        setVehicles(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (vehicle.status === 'draft') {
      router.push(`/dealer/add-vehicle?draft=${vehicle.vehicle_id}`);
    } else {
      router.push(`/cars/${vehicle.vehicle_id}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700',
      under_review: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      live: 'bg-green-100 text-green-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <button onClick={() => router.push('/dealer/add-vehicle')} className="btn-primary">
            Add New Vehicle
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['', 'draft', 'pending', 'under_review', 'approved', 'live'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                statusFilter === status ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
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
                  onClick={() => handleVehicleClick(vehicle)}
                  className="card overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  <div className="relative h-48 bg-gray-200">
                    {vehicle.featured_image_url ? (
                      <Image
                        src={vehicle.featured_image_url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Car className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
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
                        <span>•</span>
                        <span>{vehicle.registration_number}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.city}</span>
                      </div>
                      
                      {vehicle.expected_selling_price && (
                        <div className="flex items-center gap-2 text-primary font-semibold text-base">
                          <IndianRupee className="w-4 h-4" />
                          <span>₹{vehicle.expected_selling_price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      {vehicle.status === 'draft' ? (
                        <button className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" />
                          Complete Listing
                        </button>
                      ) : (
                        <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
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
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-gray-700">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                  disabled={currentPage === pagination.last_page}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
