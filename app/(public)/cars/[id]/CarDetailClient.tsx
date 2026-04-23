'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Heart, Share2, Phone, MapPin, Calendar, Gauge, Fuel, Users, CheckCircle, Flag, Eye, ArrowRight } from 'lucide-react';
import { appointmentsApi } from '@/lib/api/appointments';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function CarDetailClient({ car }: { car: any }) {
  const { user } = useStore();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [appointmentForm, setAppointmentForm] = useState({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    date: '',
    time: '',
    message: ''
  });

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    try {
      await appointmentsApi.create(token, {
        dealer_code: car.dealer_code || car.dealerId,
        vehicle_id: car.vehicle_id || car.id,
        appointment_date: appointmentForm.date,
        appointment_time: appointmentForm.time,
        customer_name: appointmentForm.name,
        customer_phone: appointmentForm.mobile,
        customer_email: appointmentForm.email,
        customer_message: appointmentForm.message,
      });
      setSuccessMessage('Appointment request submitted successfully!');
      setTimeout(() => {
        setShowAppointmentModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSuccessMessage('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const carData = {
    images: car.images?.map((img: any) => img.url || img) || [car.featured_image || car.image_url],
    brand: car.brand,
    model: car.model,
    variant: car.variant,
    year: car.year,
    mileage: car.km_driven || car.mileage,
    fuelType: car.fuel_type || car.fuelType,
    transmission: car.transmission,
    owners: car.ownership || car.owners || 1,
    price: parseFloat(car.selling_price || car.expected_selling_price || car.price || '0') || 0,
    location: car.location,
    features: car.features || [],
    description: car.description || `${car.brand} ${car.model} ${car.variant || ''} in excellent condition.`,
    inspectionStatus: car.inspection_status || car.inspectionStatus,
    dealerName: car.dealer_name || car.dealerName || 'Verified Dealer',
    color: car.color,
  };

  const emi = carData.price > 0 ? Math.round((carData.price * 0.85 * 0.009) / (1 - Math.pow(1 + 0.009, -60))) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {carData.year} {carData.brand} {carData.model} {carData.variant}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>{carData.mileage.toLocaleString()} kms</span>
            <span>•</span>
            <span>{carData.fuelType}</span>
            <span>•</span>
            <span>{carData.transmission}</span>
            <span>•</span>
            <span>{carData.owners === 1 ? '1st' : carData.owners + 'th'} Owner</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{formatPrice(carData.price)}</p>
                  <p className="text-sm text-gray-600 mt-1">{emi > 0 ? `EMI starts @ ₹${emi.toLocaleString()} /mo` : 'Price on Request'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLiked(!liked)} className="p-2 border rounded-lg hover:bg-gray-50">
                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <Image src={carData.images[selectedImage]} alt="Car" fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {carData.images.length} PHOTOS
                </div>
                {selectedImage > 0 && (
                  <button onClick={() => setSelectedImage(selectedImage - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                )}
                {selectedImage < carData.images.length - 1 && (
                  <button onClick={() => setSelectedImage(selectedImage + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {carData.images.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`}>
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Trending! Viewed by 4650+ users</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b overflow-x-auto">
                <div className="flex">
                  {['overview', 'specs', 'features'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-semibold capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}>
                      {tab === 'specs' ? 'Specs & Features' : tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Car Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">Registration Year</p>
                          <p className="font-semibold">{carData.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Fuel className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">Fuel Type</p>
                          <p className="font-semibold">{carData.fuelType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Gauge className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">Kms Driven</p>
                          <p className="font-semibold">{carData.mileage.toLocaleString()} Kms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">Ownership</p>
                          <p className="font-semibold">{carData.owners === 1 ? 'First' : carData.owners + 'th'} Owner</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Gauge className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">Transmission</p>
                          <p className="font-semibold">{carData.transmission}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-xs text-gray-600">RTO</p>
                          <p className="font-semibold">{carData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Features</h2>
                    {carData.features.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {carData.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No features listed</p>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Specifications</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fuel Type</span>
                        <span className="font-semibold">{carData.fuelType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Transmission</span>
                        <span className="font-semibold">{carData.transmission}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Year</span>
                        <span className="font-semibold">{carData.year}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Kms Driven</span>
                        <span className="font-semibold">{carData.mileage.toLocaleString()} km</span>
                      </div>
                      {carData.color && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Color</span>
                          <span className="font-semibold">{carData.color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Seller Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-4">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {carData.dealerName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{carData.dealerName}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{carData.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-green-600">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-semibold">24 Cars</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">2020</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Verified Seller</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white font-bold py-3 rounded-lg mb-3 transition-all duration-200 shadow-md hover:shadow-lg">
                View Seller Details
              </button>
              <button 
                onClick={() => setShowAppointmentModal(true)}
                className="w-full bg-white border-2 border-primary text-primary hover:bg-primary-50 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 mb-3"
              >
                <Calendar className="w-5 h-5" />
                Book Test Drive
              </button>
              <button className="w-full bg-white border-2 border-primary text-primary hover:bg-primary-50 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200">
                <Phone className="w-5 h-5" />
                Get Seller Number
              </button>
            </div>

            {carData.inspectionStatus === 'completed' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">Quality Assured</p>
                    <p className="text-sm text-green-700">150+ Point Inspection</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Engine & Transmission Checked</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Accident History Verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Original Documents Verified</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Addon Services Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Avail Addon Services</h2>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">🎉 Exclusive Offer</span>
            </div>
            <p className="text-gray-600 mt-2">Get complete vehicle history & verification reports</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-primary">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Complete 360° Bundle</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Service History</p>
                    <p className="text-xs text-gray-600">Complete maintenance records</p>
                  </div>
                </div>
                <p className="text-right text-sm font-semibold text-blue-700">Worth ₹999</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Background Check</p>
                    <p className="text-xs text-gray-600">Ownership verification</p>
                  </div>
                </div>
                <p className="text-right text-sm font-semibold text-green-700">Worth ₹99</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Challan Check</p>
                    <p className="text-xs text-gray-600">Pending fines & violations</p>
                  </div>
                </div>
                <p className="text-right text-sm font-semibold text-purple-700">Worth ₹29</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Bundle Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">₹1,003</span>
                    <span className="text-xl text-gray-400 line-through">₹1,127</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">12% OFF</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">You Save</p>
                  <p className="text-2xl font-bold text-green-600">₹124</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Buy Bundle Now
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-3">✓ Instant Report Delivery • ✓ 100% Verified Data</p>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Book Test Drive</h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={appointmentForm.name}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                  readOnly={!!user?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  required
                  value={appointmentForm.mobile}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, mobile: e.target.value })}
                  className="input-field"
                  placeholder="10-digit mobile number"
                  readOnly={!!user?.phone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={appointmentForm.email}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="input-field"
                    min={getTodayDate()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={appointmentForm.message}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Any specific requirements..."
                />
              </div>
              {successMessage && (
                <div className={`p-3 rounded-lg text-center font-medium ${successMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {successMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50">
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
