'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dealer, Car as CarType } from '@/types';
import CarCard from '@/components/car/CarCard';
import { MapPin, Star, Car, Users, CheckCircle, Phone, Mail, Calendar } from 'lucide-react';
import { dealersApi } from '@/lib/api/dealers';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { appointmentsApi } from '@/lib/api/appointments';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  review: string;
  created_at: string;
}

export default function DealerShowroomClient({ dealerId }: { dealerId: string }) {
  const { user } = useStore();
  const router = useRouter();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [dealerCars, setDealerCars] = useState<CarType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    date: '',
    time: '',
    message: ''
  });
  const [reviewForm, setReviewForm] = useState({
    order_id: '',
    rating: 5,
    review: ''
  });

  useEffect(() => {
    fetchDealer();
    fetchReviews();
  }, [dealerId]);

  const fetchDealer = async () => {
    setLoading(true);
    try {
      const token = auth.getToken();
      const response = await dealersApi.getById(dealerId, token || undefined);
      if (response.success) {
        setDealer(response.data.dealer);
        setDealerCars(response.data.cars || []);
        setIsFollowing(response.data.dealer.isFollowing || false);
      }
    } catch (error) {
      console.error('Error fetching dealer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await dealersApi.getReviews(dealerId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleFollow = async () => {
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      if (isFollowing) {
        await dealersApi.unfollow(dealerId, token);
      } else {
        await dealersApi.follow(dealerId, token);
      }
      // Refetch dealer to get updated isFollowing status
      fetchDealer();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setSuccessMessage('');
    try {
      await dealersApi.addReview(dealerId, token, {
        order_id: parseInt(reviewForm.order_id),
        rating: reviewForm.rating,
        review: reviewForm.review
      });
      setSuccessMessage('Review submitted for approval');
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewForm({ order_id: '', rating: 5, review: '' });
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSuccessMessage('Failed to submit review');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setSuccessMessage('');
    try {
      await appointmentsApi.create(token, {
        dealer_code: dealerId,
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        customer_name: bookingForm.name,
        customer_phone: bookingForm.mobile,
        customer_message: bookingForm.message,
      });
      setSuccessMessage('Appointment request submitted successfully!');
      setTimeout(() => {
        setShowBookingModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSuccessMessage('Failed to book appointment. Please try again.');
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dealer...</p>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Dealer not found</h2>
        <p className="text-gray-600">The dealer you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Image
              src={dealer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
              alt={dealer.name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
            {dealer.verified && (
              <CheckCircle className="absolute -bottom-2 -right-2 w-8 h-8 text-blue-500 bg-white rounded-full" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dealer.showroomName}</h1>
            <p className="text-lg text-gray-600 mb-4">{dealer.name}</p>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{dealer.rating}</span>
                <span className="text-sm">(250 reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>{dealer.totalCars} Cars</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{dealer.followers} Followers</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5" />
              <span>{dealer.location}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {(!user || user?.role === 'customer' || user?.user_type === 'customer') && (
                <>
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow Dealer'}
                  </button>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Star className="w-5 h-5" />
                    <span>Write Review</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Contact</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">Available Cars ({dealerCars.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealerCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {dealerCars.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No cars available at the moment</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">Available Cars ({dealerCars.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealerCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {dealerCars.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No cars available at the moment</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.customer_name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                {review.review && <p className="text-gray-700 mt-2">{review.review}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No reviews yet</p>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Book Appointment</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
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
                  value={bookingForm.mobile}
                  onChange={(e) => setBookingForm({ ...bookingForm, mobile: e.target.value })}
                  className="input-field"
                  placeholder="10-digit mobile number"
                  readOnly={!!user?.mobile}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="input-field"
                    min={getTodayDate()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
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
                <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Write Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="number"
                  required
                  value={reviewForm.order_id}
                  onChange={(e) => setReviewForm({ ...reviewForm, order_id: e.target.value })}
                  className="input-field"
                  placeholder="Your completed order ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review (Optional)</label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                  className="input-field"
                  rows={4}
                  placeholder="Share your experience..."
                  maxLength={1000}
                />
              </div>
              {successMessage && (
                <div className={`p-3 rounded-lg text-center font-medium ${successMessage.includes('success') || successMessage.includes('approval') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {successMessage}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && dealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Contact Details</h3>
              <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href={`tel:${dealer.mobile}`} className="text-lg font-semibold text-primary-600 hover:underline">
                    {dealer.mobile}
                  </a>
                </div>
              </div>
              
              {dealer.email && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${dealer.email}`} className="text-lg font-semibold text-primary-600 hover:underline">
                      {dealer.email}
                    </a>
                  </div>
                </div>
              )}
              
              {dealer.location && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg font-semibold">{dealer.showroomName}</p>
                    <p className="text-gray-700">{dealer.location}</p>
                  </div>
                </div>
              )}
              
              {dealer.location && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <iframe
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(dealer.location)}`}
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
