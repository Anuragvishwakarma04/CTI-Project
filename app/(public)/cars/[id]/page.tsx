'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import CarDetailClient from './CarDetailClient';

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.getCarDetails(params.id as string);
        if (response.success) {
          setCar(response.data);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Car not found</div>;
  }

  return <CarDetailClient car={car} />;
}
