'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dealer } from '@/types';
import { MapPin, Star, Car, Users, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { dealersApi } from '@/lib/api/dealers';

interface DealerCardProps {
  dealer: Dealer & { is_following?: boolean; isFollowing?: boolean };
}

export default function DealerCard({ dealer }: DealerCardProps) {
  const { user, token } = useStore();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(dealer.is_following || dealer.isFollowing || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(dealer.is_following || dealer.isFollowing || false);
  }, [dealer.is_following, dealer.isFollowing]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const authToken = token || localStorage.getItem('auth_token');
    
    if (!authToken) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await dealersApi.unfollow(dealer.id, authToken);
        setIsFollowing(false);
      } else {
        await dealersApi.follow(dealer.id, authToken);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
      <div className="relative h-32 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
            <Image
              src={dealer.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200'}
              alt={dealer.name || 'Dealer'}
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
            {dealer.verified && (
              <CheckCircle className="absolute bottom-0 right-0 w-6 h-6 text-blue-500 bg-white rounded-full" />
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-16 px-6 pb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition">{dealer.showroomName}</h3>
        <p className="text-sm text-gray-600 mb-3">{dealer.name}</p>
        
        <div className="flex items-center justify-center gap-1 mb-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{dealer.location}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-gray-900">{dealer.rating}</span>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Car className="w-4 h-4 text-primary-600" />
              <span className="font-bold text-gray-900">{dealer.totalCars}</span>
            </div>
            <p className="text-xs text-gray-500">Cars</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-primary-600" />
              <span className="font-bold text-gray-900">{dealer.followers}</span>
            </div>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/dealers/${dealer.id}`} className="flex-1 py-3 rounded-xl font-semibold text-center bg-primary-600 text-white hover:bg-primary-700 transition">
            Visit
          </Link>
          {(!user || user?.role === 'customer' || user?.user_type === 'customer') && (
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
