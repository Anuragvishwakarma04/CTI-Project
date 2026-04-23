'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Mail, AlertCircle } from 'lucide-react';
import { api, auth } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState<'customer' | 'dealer' | 'showroom'>('customer');
  const [errors, setErrors] = useState({ email: '', otp: '', dealer_code: '' });
  const [loading, setLoading] = useState(false);
  const [hasDealerCode, setHasDealerCode] = useState(false);
  const [dealerCode, setDealerCode] = useState('');
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, setToken } = useStore();

  // COMMENTED: Mobile OTP Login (for future use)
  // const [mobile, setMobile] = useState('');
  // const validateMobile = (value: string): string => {
  //   const cleaned = value.replace(/\D/g, '');
  //   if (!cleaned) return 'Mobile number is required';
  //   if (cleaned.length !== 10) return 'Mobile number must be 10 digits';
  //   if (!/^[6-9]/.test(cleaned)) return 'Mobile number must start with 6-9';
  //   return '';
  // };
  // const handleMobileChange = (value: string) => {
  //   const cleaned = value.replace(/\D/g, '').slice(0, 10);
  //   setMobile(cleaned);
  //   if (errors.mobile) setErrors({ ...errors, mobile: '' });
  // };

  useEffect(() => {
    // Get redirect parameter from URL
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  const getDashboardPath = (userType: string) => {
    if (userType === 'dealer') return '/dealer/dashboard';
    if (userType === 'showroom') return '/showroom/dashboard';
    return '/dashboard';
  };

  useEffect(() => {
    const token = auth.getToken();
    const savedUser = auth.getUser();

    if (token && savedUser) {
      setUser(savedUser);
      router.replace(getDashboardPath(savedUser.user_type));
    }
  }, [router, setUser]);

  const validateEmail = (value: string): string => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return '';
  };

  const validateOTP = (value: string): string => {
    if (!value) return 'OTP is required';
    if (!/^\d{6}$/.test(value)) return 'OTP must be 6 digits';
    return '';
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ ...errors, email: emailError });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: role }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setErrors({ email: '', otp: '', dealer_code: '' });
      } else {
        setErrors({ ...errors, email: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ ...errors, email: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpError = validateOTP(otp);
    if (otpError) {
      setErrors({ ...errors, otp: otpError });
      return;
    }
    setLoading(true);
    try {
      const body: any = { email, otp, type: role };
      if (hasDealerCode && dealerCode) body.dealer_code = dealerCode;
      
      console.log('Verifying OTP with:', body);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log('OTP verification response:', data);
      
      if (data.success) {
        const userType = data.type || role;
        
        // Save token immediately
        if (data.token) {
          console.log('Saving token to localStorage:', data.token.substring(0, 20) + '...');
          auth.setToken(data.token);
          setToken(data.token);
          
          // Verify token was saved
          const savedToken = auth.getToken();
          console.log('Token saved successfully:', savedToken ? 'Yes' : 'No');
        } else {
          console.error('No token in response!');
        }
        
        if (data.profile_completed) {
          console.log('Profile completed, fetching user data...');
          // Profile already completed - login directly
          const profileRes = await api.getProfile(data.token);
          if (profileRes.success) {
            auth.setUser(profileRes.user);
            setUser(profileRes.user);
            localStorage.removeItem('loginPageVisits');
            
            if (redirectPath) {
              router.push(redirectPath);
            } else {
              router.push(getDashboardPath(profileRes.user.user_type));
            }
          }
        } else {
          console.log('Profile not completed, redirecting to complete-profile...');
          // Profile not completed - redirect to complete profile
          const redirectParam = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : '';
          router.push(`/complete-profile${redirectParam}`);
        }
      } else {
        if (data.errors) {
          const newErrors: any = { email: '', otp: '', dealer_code: '' };
          Object.keys(data.errors).forEach(key => {
            newErrors[key] = data.errors[key][0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ ...errors, otp: data.message || 'Invalid OTP' });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ ...errors, otp: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value.trim());
    if (errors.email) setErrors({ ...errors, email: '' });
  };

  const handleOTPChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (errors.otp) setErrors({ ...errors, otp: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to continue</p>
        </div>

        <div className="flex gap-3 mb-6">
          {[
            { value: 'customer' as const, label: 'Customer' },
            { value: 'showroom' as const, label: 'Showroom' },
            { value: 'dealer' as const, label: 'Dealer' },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`flex-1 py-3 rounded-lg font-semibold transition text-sm ${role === r.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email"
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
              {email && !errors.email && validateEmail(email) === '' && (
                <p className="text-green-600 text-sm mt-2">✓ Valid email address</p>
              )}
            </div>
            {role === 'customer' && (
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDealerCode}
                    onChange={(e) => setHasDealerCode(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">I have a dealer code</span>
                </label>
                {hasDealerCode && (
                  <div>
                    <input
                      type="text"
                      value={dealerCode}
                      onChange={(e) => setDealerCode(e.target.value.toUpperCase())}
                      placeholder="Enter dealer code"
                      className={`input-field mt-2 ${errors.dealer_code ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.dealer_code && (
                      <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.dealer_code}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => handleOTPChange(e.target.value)}
                placeholder="6-digit OTP"
                className={`input-field text-center text-2xl tracking-widest ${errors.otp ? 'border-red-500 focus:ring-red-500' : ''}`}
                maxLength={6}
                autoFocus
              />
              {errors.otp && (
                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.otp}</span>
                </div>
              )}
              {otp && !errors.otp && otp.length === 6 && (
                <p className="text-green-600 text-sm mt-2">✓ Valid OTP format</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                OTP sent to {email}{' '}
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); setErrors({ email: '', otp: '', dealer_code: '' }); }}
                  className="text-primary-600 font-semibold"
                >
                  Change
                </button>
              </p>
            </div>
            <button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full text-primary-600 font-semibold hover:underline"
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-600 font-semibold">
            Terms & Conditions
          </a>
        </div>
      </div>
    </div>
  );
}
