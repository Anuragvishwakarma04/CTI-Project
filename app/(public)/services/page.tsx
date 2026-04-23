'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Clock } from 'lucide-react';
import { Service } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);
  const cityId = 1; // Default city ID, can be made dynamic

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const loadServices = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/city/${cityId}/services-warranties`);
        const data = await response.json();
        
        if (data.success) {
          setServices(data.services);
        } else {
          setError('Failed to load services');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-600">
          Complete car buying and selling services under one roof
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.id} className="card overflow-hidden hover:shadow-2xl transition-all">
            {service.image_url && (
              <div className="relative h-64">
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
              <p className="text-gray-600 mb-4">{service.subtitle}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{service.duration}</span>
                </div>
                <div className="text-right">
                  {service.has_offer && service.discounted_price ? (
                    <>
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(service.price)}
                      </p>
                      <p className="text-3xl font-bold text-primary-600">
                        {formatPrice(service.final_price)}
                      </p>
                      <span className="text-xs text-green-600">
                        {service.offer_percentage?.toFixed(0)}% OFF
                      </span>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-primary-600">
                      {formatPrice(service.price)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {service.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{check}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-primary">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
