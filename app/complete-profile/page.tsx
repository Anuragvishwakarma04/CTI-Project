'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { User, Building2, MapPin, AlertCircle } from 'lucide-react';
import { api, auth } from '@/lib/api';

export default function CompleteProfilePage() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const router = useRouter();
  const { setUser } = useStore();

  const [userType, setUserType] = useState<'customer' | 'dealer' | 'showroom'>('customer');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    business_name: '',
    gst_number: '',
    city: '',
    state: '',
    pincode: '',
    contact_person: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const token = auth.getToken();
    console.log('Complete Profile - Token check:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return;
    }

    const fetchUserType = async () => {
      try {
        console.log('Fetching user profile with token...');
        const profileRes = await api.getProfile(token);
        console.log('Profile response:', profileRes);

        if (isMounted) {
          if (profileRes.success && profileRes.user) {
            const user = profileRes.user;

            // Agar profile already complete hai — dashboard pe redirect karo
            if (user.name && user.name.trim() !== '' && user.phone) {
              console.log('Profile already complete, redirecting to dashboard');
              auth.setUser(user);
              setUser(user);

              const dashPath =
                user.user_type === 'dealer' ? '/dealer/dashboard' :
                  user.user_type === 'showroom' ? '/showroom/dashboard' :
                    '/dashboard';

              router.push(redirectPath || dashPath);
              return;
            }


            setUserType(user.user_type || 'customer');
            setFormData(prev => ({
              ...prev,
              phone: user.phone || '',
              name: user.name || '',
              email: user.email || ''
            }));
            console.log('User type set to:', user.user_type);
          } else {
            console.log('Profile fetch failed or no user data');
          }
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    fetchUserType();

    return () => {
      isMounted = false;
    };
  }, [router, redirectPath, setUser]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ ...errors, email: emailError });
      return;
    }

    setLoading(true);

    const data: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    };

    if (userType === 'dealer' || userType === 'showroom') {
      data.business_name = formData.business_name;
      data.gst_number = formData.gst_number;
      data.city = formData.city;
      data.state = formData.state;
      data.pincode = formData.pincode;
      data.contact_person = formData.contact_person;
    }

    try {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        const profileRes = await api.getProfile(token);
        if (profileRes.success) {
          auth.setUser(profileRes.user);
          setUser(profileRes.user);

          if (redirectPath) {
            router.push(redirectPath);
          } else {
            const dashPath =
              profileRes.user.user_type === 'dealer' ? '/dealer/dashboard' :
                profileRes.user.user_type === 'showroom' ? '/showroom/dashboard' :
                  '/dashboard';
            router.push(dashPath);
          }
        }
      } else {
        if (result.errors) {
          const fieldErrors: any = {};
          Object.keys(result.errors).forEach(key => {
            fieldErrors[key] = result.errors[key][0];
          });
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setErrors({ ...fieldErrors, general: errorMessages });
        } else {
          setErrors({ general: result.message || 'Failed to create profile' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {isCheckingAuth ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
              <p className="text-gray-600">Please provide your details to continue</p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                  {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <p className="text-green-600 text-sm mt-1">✓ Valid email address</p>
                  )}
                </div>
              </div>

              {(userType === 'dealer' || userType === 'showroom') && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Name *</label>
                        <input
                          type="text"
                          value={formData.business_name}
                          onChange={(e) => handleChange('business_name', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">GST Number *</label>
                        <input
                          type="text"
                          value={formData.gst_number}
                          onChange={(e) => handleChange('gst_number', e.target.value)}
                          placeholder="29ABCDE1234F1Z5"
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Contact Person</label>
                        <input
                          type="text"
                          value={formData.contact_person}
                          onChange={(e) => handleChange('contact_person', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">City *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">State *</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleChange('state', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => handleChange('pincode', e.target.value)}
                          maxLength={6}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}