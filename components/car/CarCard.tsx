'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { Heart, MapPin, Fuel, Gauge, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/api';


interface CarCardProps {
  car: Car & { is_favorite?: boolean };
}

export default function CarCard({ car }: CarCardProps) {
  const [liked, setLiked] = useState(car.is_favorite || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(car.is_favorite || false);
  }, [car.is_favorite]);

  const carData = {
    id: car.vehicle_id || car.id,
    thumbnail: car.image_url || car.thumbnail,
    brand: car.brand,
    model: car.model,
    price: parseFloat(car.selling_price || String(car.price) || '0') || 0,
    year: car.year,
    mileage: car.km_driven || car.mileage,
    fuelType: car.fuel_type || car.fuelType,
    transmission: car.transmission,
    location: car.location,
    inspectionStatus: car.inspectionStatus,
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const token = auth.getToken();
    if (!token) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_BASE_URL}/api/cars/${carData.id}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setLiked(!liked);
      } else {
        alert(data.message || 'Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/cars/${carData.id}`} className="card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={carData.thumbnail}
          alt={`${carData.brand} ${carData.model}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition disabled:opacity-50"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        {carData.inspectionStatus === 'completed' && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Inspected
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {carData.brand} {carData.model}
        </h3>
        <p className="text-2xl font-bold text-primary-600 mb-3">{formatPrice(carData.price)}</p>
        
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{carData.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="w-4 h-4" />
            <span>{formatNumber(carData.mileage)} km</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="w-4 h-4" />
            <span>{carData.fuelType}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{carData.location}</span>
          </div>
          <span className="text-xs text-gray-500">{carData.transmission}</span>
        </div>
      </div>
    </Link>
  );
}
