'use client';

import { useState } from 'react';
import { FilterOptions } from '@/types';
import { X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClose?: () => void;
}

export default function FilterPanel({ onFilterChange, onClose }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    brand:[]
  });

  const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissions = ['Manual', 'Automatic'];

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Brand</label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...(filters.brand || []), brand]
                        : (filters.brand || []).filter((b) => b !== brand);
                      setFilters({ ...filters, brand: newBrands });
                    }}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Price Range</label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min Price"
              className="input-field text-sm"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange?.[1] || 10000000],
                })
              }
            />
            <input
              type="number"
              placeholder="Max Price"
              className="input-field text-sm"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [filters.priceRange?.[0] || 0, Number(e.target.value)],
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Fuel Type</label>
          <div className="space-y-2">
            {fuelTypes.map((fuel) => (
              <label key={fuel} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fuelType?.includes(fuel)}
                  onChange={(e) => {
                    const newFuels = e.target.checked
                      ? [...(filters.fuelType || []), fuel]
                      : (filters.fuelType || []).filter((f) => f !== fuel);
                    setFilters({ ...filters, fuelType: newFuels });
                  }}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm">{fuel}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Transmission</label>
          <div className="space-y-2">
            {transmissions.map((trans) => (
              <label key={trans} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.transmission?.includes(trans)}
                  onChange={(e) => {
                    const newTrans = e.target.checked
                      ? [...(filters.transmission || []), trans]
                      : (filters.transmission || []).filter((t) => t !== trans);
                    setFilters({ ...filters, transmission: newTrans });
                  }}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm">{trans}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button onClick={handleReset} className="flex-1 btn-secondary">
          Reset
        </button>
        <button onClick={handleApply} className="flex-1 btn-primary">
          Apply
        </button>
      </div>
    </div>
  );
}
