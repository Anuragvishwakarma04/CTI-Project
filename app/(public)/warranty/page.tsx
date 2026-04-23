'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Shield, Clock } from 'lucide-react';
import { Warranty } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);
  const cityId = 1; // Default city ID, can be made dynamic

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const loadWarranties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/city/${cityId}/services-warranties`);
        const data = await response.json();
        
        if (data.success) {
          setWarranties(data.warranties);
        } else {
          setError('Failed to load warranties');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load warranties');
      } finally {
        setLoading(false);
      }
    };
    
    loadWarranties();
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
        <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Extended Warranty Plans</h1>
        <p className="text-xl text-gray-600">
          Drive with confidence with our comprehensive warranty coverage
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {warranties.map((warranty) => (
          <div
            key={warranty.id}
            className="card overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-600"
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">{warranty.title}</h2>
              <p className="text-primary-100 mb-4">{warranty.subtitle}</p>
              <div className="mb-2">
                {warranty.has_offer && warranty.discounted_price ? (
                  <>
                    <div className="text-2xl line-through opacity-75 mb-1">
                      {formatPrice(warranty.price)}
                    </div>
                    <div className="text-5xl font-bold">
                      {formatPrice(warranty.final_price)}
                    </div>
                    <div className="text-sm text-green-300 mt-1">
                      Save {formatPrice(warranty.discount_amount)} ({warranty.offer_percentage?.toFixed(0)}% OFF)
                    </div>
                  </>
                ) : (
                  <div className="text-5xl font-bold">{formatPrice(warranty.price)}</div>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2 text-primary-100">
                <Clock className="w-5 h-5" />
                <span>{warranty.validity_months} months coverage</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">Coverage Includes:</h3>
              <div className="space-y-3 mb-6">
                {warranty.checks.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <button className="w-full btn-primary">Purchase Warranty</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 card p-8 bg-gradient-to-br from-blue-50 to-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Warranty?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
            <p className="text-sm text-gray-600">
              Protection for major components and systems
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Easy Claims</h3>
            <p className="text-sm text-gray-600">
              Simple and hassle-free claim process
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              Round-the-clock assistance when you need it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
