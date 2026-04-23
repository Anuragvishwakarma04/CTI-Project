'use client';

import { useState, useEffect } from 'react';
import CarCard from '@/components/car/CarCard';
import FilterPanel from '@/components/car/FilterPanel';
import { FilterOptions } from '@/types';
import { SlidersHorizontal, X, Grid3x3, List, Plus } from 'lucide-react';
import { api, auth } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function CarsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const router = useRouter();

  const handleAddClick = () => {
    if (user?.type === 'dealer' || user?.type === 'showroom') {
      router.push('/dealer/add-vehicle');
    } else {
      router.push('/dashboard/add-listing');
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters, sortBy]);


 

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.brand && filters.brand.length > 0) {
        params.brand = Array.isArray(filters.brand) ? filters.brand.join(',') : filters.brand;
      }
      if (filters.fuelType && filters.fuelType.length > 0) {
        params.fuel_type = Array.isArray(filters.fuelType) ? filters.fuelType.join(',') : filters.fuelType;
      }
      if (filters.transmission && filters.transmission.length > 0) {
        params.transmission = Array.isArray(filters.transmission) ? filters.transmission.join(',') : filters.transmission;
      }
      if (filters.priceRange) {
        if (filters.priceRange[0]) params.min_price = filters.priceRange[0];
        if (filters.priceRange[1]) params.max_price = filters.priceRange[1];
      }
      if (sortBy) params.sort_by = sortBy;

      const token = auth.getToken();
      const response = await api.getCarListings(params, token || undefined);
      if (response.success) {
        setCars(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            {user && (
              <button
                onClick={handleAddClick}
                className="p-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                title="Add New Car"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold">Used Cars for Sale</h1>
          </div>
          <p className="text-gray-300">Find your perfect car from {cars.length} verified listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {showFilters && <X className="w-4 h-4" />}
              </button>
              <span className="text-sm text-gray-600">{cars.length} cars available</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">Sort by</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="year_new">Newest First</option>
                <option value="mileage_low">Low Mileage</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-20">
                <FilterPanel
                  onFilterChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Cars Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cars...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car,index) => (
                  <CarCard key={car.vehicle_id || car.id || index} car={car} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
            
            {!loading && cars.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-bold mb-2">No cars found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
