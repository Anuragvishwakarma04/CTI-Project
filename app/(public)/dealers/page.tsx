'use client';

import DealerCard from '@/components/dealer/DealerCard';
import { dealersApi } from '@/lib/api/dealers';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dealer } from '@/types';
import { useStore } from '@/store/useStore';

export default function DealersPage() {
  const { user } = useStore();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'total_cars' | 'followers' | 'newest'>('rating');

  useEffect(() => {
    fetchDealers();
  }, [sortBy]);

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await dealersApi.getAll({
        search: searchTerm || undefined,
        sort: sortBy,
      }, token || undefined);
      if (response.success) {
        setDealers(response.data.dealers);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDealers();
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Trusted Car Dealers</h1>
            <p className="text-xl text-gray-600">
              Connect with verified dealers across India
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by dealer name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{dealers.length}+</div>
            <div className="text-sm text-gray-600">Verified Dealers</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">5000+</div>
            <div className="text-sm text-gray-600">Cars Available</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Dealers Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              All Dealers ({dealers.length})
            </h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="rating">Sort by Rating</option>
              <option value="total_cars">Most Cars</option>
              <option value="followers">Most Followers</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dealers...</p>
            </div>
          ) : dealers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map((dealer) => (
                <DealerCard key={dealer.id} dealer={dealer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-bold mb-2">No dealers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
