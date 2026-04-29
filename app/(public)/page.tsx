'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Award, Headphones } from 'lucide-react';
import CarCard from '@/components/car/CarCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import SupportButton from '@/components/supportButton/page';
import AuctionBanner from '@/components/auctionNoti/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [topFavorites, setTopFavorites] = useState<any[]>([]);
  const [trendingFavorites, setTrendingFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const handleSellCarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    const user = auth.getUser();

    if (!token || !user) {
      // Not logged in - redirect to login
      router.push('/login?redirect=/dashboard/add-listing');
    } else {
      // Logged in - redirect based on user type
      if (user.user_type === 'dealer' || user.user_type === 'showroom') {
        router.push('/dealer/add-vehicle');
      } else {
        router.push('/dashboard/add-listing');
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchTopFavorites();
    fetchTrendingFavorites();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`);
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/top-favorites?limit=10`);
      const result = await response.json();
      if (result.success) {
        setTopFavorites(result.data);
      }
    } catch (error) {
      console.error('Error fetching top favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const fetchTrendingFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/trending-favorites?limit=10&days=7`);
      const result = await response.json();
      if (result.success) {
        setTrendingFavorites(result.data);
      }
    } catch (error) {
      console.error('Error fetching trending favorites:', error);
    }
  };

  const banner = dashboardData?.banner || { title: 'Find Your Perfect Car', subtitle: 'Buy & Sell Cars with Confidence', description: 'Verified cars, transparent pricing, and hassle-free documentation. Your dream car is just a click away.' };
  const stats = dashboardData?.stats || { totalCars: 5000, totalDealers: 500, happyCustomers: 10000 };
  const featuredCars = dashboardData?.featuredCars || [];


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                {banner.title}
                <span className="block text-primary-600">{banner.subtitle}</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-gray-600 leading-relaxed">
                {banner.description || 'Verified cars, transparent pricing, and hassle-free documentation. Your dream car is just a click away.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cars" className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition text-center">
                  Explore Cars
                </Link>
                <button
                  onClick={handleSellCarClick}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition text-center"
                >
                  Sell Your Car
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCars}+</div>
                  <div className="text-gray-600">Cars Listed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalDealers}+</div>
                  <div className="text-gray-600">Dealers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.happyCustomers}+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
<div className="hidden md:block rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50">
  {dashboardData?.banner?.image ? (
    <Image
      src={dashboardData.banner.image}
      alt={banner.title}
      width={800}  
      height={500}
      className="w-full h-auto object-cover"
    />
  ) : (
    <Image
      src={'/Hero-image/hero4.jpg'}
      alt="Car Analytics Dashboard"
      width={800}  // Hero image ki width
      height={500} // Hero image ki height
      className="w-full h-auto object-contain" 
      priority
    />
  )}
</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Car Trust?</h2>
          <p className="text-gray-600 text-lg">Your trusted partner in car buying and selling</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">Verified Cars</h3>
            <p className="text-gray-600 text-xs sm:text-sm">150+ point inspection</p>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">Best Price</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Competitive pricing</p>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Always here to help</p>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">Warranty</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Extended warranty</p>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured Cars</h2>
              <p className="text-gray-600">Handpicked deals just for you</p>
            </div>
            <Link href="/cars" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg flex items-center gap-2">
              View All
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cars...</p>
              </div>
            ) : featuredCars.length > 0 ? (
              featuredCars
                .filter((car: any) =>
                  car.featured_image || car.image_url || car.thumbnail || car.images?.[0]?.url
                )
                .slice(0, 6)
                .map((car: any) => (
                  <CarCard key={car.vehicle_id || car.id} car={car} />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No featured cars available</p>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Top Favorites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Most Loved Cars</h2>
            <p className="text-gray-600">Top favorites of all time</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritesLoading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : topFavorites.length > 0 ? (
            topFavorites.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No favorites available</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Favorites */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Trending Now</h2>
              <p className="text-gray-600">Recently favorited cars</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritesLoading ? (
              <div className="col-span-full flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : trendingFavorites.length > 0 ? (
              trendingFavorites.map((car: any) => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No trending favorites available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Ready to Sell Your Car?</h2>
          <p className="text-lg sm:text-xl mb-8 text-primary-50 max-w-2xl mx-auto">Get the best price with our hassle-free process. List your car in minutes!</p>
          <button
            onClick={handleSellCarClick}
            className="inline-block bg-white text-primary-600 px-10 py-5 rounded-xl font-bold hover:bg-primary-50 transition shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg"
          >
            Start Selling Now →
          </button>
        </div>
      </section>
      <AuctionBanner/>
      {/* <SupportButton/> */}
    </div>
  );
}
