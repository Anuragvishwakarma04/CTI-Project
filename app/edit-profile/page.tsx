'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, Save, ArrowLeft, Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'dealer' | 'showroom'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
    business_name: '',
    showroom_name: '',
    company_name: '',
    gst_number: '',
    profile_image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [interiorImages, setInteriorImages] = useState<string[]>([]);
  const [exteriorImages, setExteriorImages] = useState<string[]>([]);
  const [interiorPreview, setInteriorPreview] = useState<any[]>([]);
  const [exteriorPreview, setExteriorPreview] = useState<any[]>([]);
  const interiorInputRef = useRef<HTMLInputElement>(null);
  const exteriorInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'interior' | 'exterior'>('interior');
  const [mainTab, setMainTab] = useState<'profile' | 'images'>('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = auth.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success && data.user) {
        setUserType(data.user.user_type);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          city: data.user.city_name || '',
          state: data.user.state || '',
          pincode: data.user.pincode || '',
          address: data.user.address || '',
          business_name: data.user.business_name || '',
          showroom_name: data.user.showroom_name || '',
          company_name: data.user.business_name || '',
          gst_number: data.user.gst_number || '',
          profile_image: data.user.profile_image || '',
        });
        if (data.user.profile_image) {
          const imageUrl = data.user.profile_image.startsWith('http') 
            ? data.user.profile_image 
            : `${API_BASE_URL}${data.user.profile_image}`;
          setPreviewImage(imageUrl);
        }
      }

      // Fetch dealer images
      if (data.user.user_type === 'dealer' || data.user.user_type === 'showroom') {
        const imagesRes = await fetch(`${API_BASE_URL}/api/dealer/images`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const imagesData = await imagesRes.json();
        
        if (imagesData.success && imagesData.data.images) {
          const interiorImgs = imagesData.data.images
            .filter((img: any) => img.type === 'interior')
            .map((img: any) => ({ id: img.id, url: img.image_url }));
          const exteriorImgs = imagesData.data.images
            .filter((img: any) => img.type === 'exterior')
            .map((img: any) => ({ id: img.id, url: img.image_url }));
          
          setInteriorPreview(interiorImgs);
          setExteriorPreview(exteriorImgs);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (userType === 'dealer') {
      if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
      if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
        newErrors.gst_number = 'Invalid GST format';
      }
    }

    if (userType === 'showroom') {
      if (!formData.showroom_name.trim()) newErrors.showroom_name = 'Showroom name is required';
      if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
        newErrors.gst_number = 'Invalid GST format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const token = auth.getToken();

    try {
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        profile_image: formData.profile_image,
      };

      if (userType === 'dealer') {
        submitData.business_name = formData.business_name;
        submitData.gst_number = formData.gst_number;
      }

      if (userType === 'showroom') {
        submitData.showroom_name = formData.showroom_name;
        submitData.business_name = formData.company_name;
        submitData.gst_number = formData.gst_number;
        submitData.address = formData.address;
      }

      if (userType === 'dealer' || userType === 'showroom') {
        submitData.interior_images = interiorPreview;
        submitData.exterior_images = exteriorPreview;
      }

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (data.success) {
        const user = auth.getUser();
        if (user) {
          auth.setUser({ ...user, ...formData });
        }
        router.push('/showroom/dashboard?success=profile_updated');
      } else {
        setErrors({ submit: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, profile_image: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, profile_image: 'Image must be less than 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFormData({ ...formData, profile_image: result });
    };
    reader.readAsDataURL(file);
    setErrors({ ...errors, profile_image: '' });
  };

  const handleInteriorImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    if (interiorPreview.length + fileArray.length > 10) {
      setErrors({ ...errors, interior_images: 'Maximum 10 images allowed' });
      return;
    }

    const token = auth.getToken();
    setErrors({ ...errors, interior_images: '' });

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, interior_images: 'Only image files allowed' });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, interior_images: 'Each image must be less than 5MB' });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'interior');
        formData.append('title', 'Interior Image');
        formData.append('sort_order', String(interiorPreview.length + 1));

        const res = await fetch(`${API_BASE_URL}/api/dealer/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data.image_url) {
          setInteriorPreview(prev => [...prev, { id: data.data.id, url: data.data.image_url }]);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleExteriorImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    if (exteriorPreview.length + fileArray.length > 10) {
      setErrors({ ...errors, exterior_images: 'Maximum 10 images allowed' });
      return;
    }

    const token = auth.getToken();
    setErrors({ ...errors, exterior_images: '' });

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, exterior_images: 'Only image files allowed' });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, exterior_images: 'Each image must be less than 5MB' });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'exterior');
        formData.append('title', 'Exterior Image');
        formData.append('sort_order', String(exteriorPreview.length + 1));

        const res = await fetch(`${API_BASE_URL}/api/dealer/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data.image_url) {
          setExteriorPreview(prev => [...prev, { id: data.data.id, url: data.data.image_url }]);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const removeInteriorImage = async (index: number) => {
    const image = interiorPreview[index];
    if (!image.id) return;

    const token = auth.getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/dealer/images/${image.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();
      if (data.success) {
        setInteriorPreview(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const removeExteriorImage = async (index: number) => {
    const image = exteriorPreview[index];
    if (!image.id) return;

    const token = auth.getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/dealer/images/${image.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();
      if (data.success) {
        setExteriorPreview(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
            <p className="text-gray-600 text-sm capitalize">{userType} Account</p>
          </div>

          {/* Main Tabs */}
          {(userType === 'dealer' || userType === 'showroom') && (
            <div className="flex gap-2 mb-8 border-b">
              <button
                type="button"
                onClick={() => setMainTab('profile')}
                className={`px-6 py-3 font-medium transition ${
                  mainTab === 'profile'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile Information
              </button>
              <button
                type="button"
                onClick={() => setMainTab('images')}
                className={`px-6 py-3 font-medium transition ${
                  mainTab === 'images'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Showroom Images
                {(interiorPreview.length > 0 || exteriorPreview.length > 0) && (
                  <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                    {interiorPreview.length + exteriorPreview.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {mainTab === 'profile' ? (
            <>
          <div className="mb-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4">Profile Picture</h3>
            
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : userType === 'dealer' || userType === 'showroom' ? (
                  <Building2 className="w-12 h-12 text-primary-600" />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition mb-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>
                <p className="text-sm text-gray-500 mb-3">JPG, PNG or WebP. Max size 5MB.</p>
                
                {errors.profile_image && (
                  <p className="text-red-600 text-sm mb-3">{errors.profile_image}</p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'dealer' || userType === 'showroom' ? 'Contact Person Name' : 'Full Name'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {(userType === 'dealer' || userType === 'showroom') && (
              <>
                {userType === 'showroom' ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Showroom Name *
                        </label>
                        <input
                          type="text"
                          value={formData.showroom_name}
                          onChange={(e) => handleChange('showroom_name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.showroom_name ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.showroom_name && <p className="text-red-600 text-sm mt-1">{errors.showroom_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={formData.company_name}
                          onChange={(e) => handleChange('company_name', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.company_name ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.company_name && <p className="text-red-600 text-sm mt-1">{errors.company_name}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={formData.gst_number}
                        onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
                        placeholder="22AAAAA0000A1Z5"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.gst_number ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.gst_number && <p className="text-red-600 text-sm mt-1">{errors.gst_number}</p>}
                    </div>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={formData.business_name}
                        onChange={(e) => handleChange('business_name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.business_name ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.business_name && <p className="text-red-600 text-sm mt-1">{errors.business_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={formData.gst_number}
                        onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
                        placeholder="22AAAAA0000A1Z5"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.gst_number ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.gst_number && <p className="text-red-600 text-sm mt-1">{errors.gst_number}</p>}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.city ? 'border-red-500' : ''
                  }`}
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.state ? 'border-red-500' : ''
                  }`}
                />
                {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                maxLength={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.pincode ? 'border-red-500' : ''
                }`}
              />
              {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
            </div>

            {userType === 'showroom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.address ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter complete address"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
          </>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Showroom Images</h3>
                <p className="text-sm text-gray-600">Upload interior and exterior images of your showroom (Max 10 images each)</p>
              </div>

              {/* Image Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  type="button"
                  onClick={() => setActiveTab('interior')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'interior'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Interior Images
                  {interiorPreview.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                      {interiorPreview.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('exterior')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'exterior'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Exterior Images
                  {exteriorPreview.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                      {exteriorPreview.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                {activeTab === 'interior' ? (
                  <>
                    <input
                      ref={interiorInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleInteriorImagesSelect}
                      className="hidden"
                    />
                    
                    {interiorPreview.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => interiorInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary-500 hover:bg-white transition flex flex-col items-center justify-center gap-3"
                      >
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Upload Interior Images</p>
                          <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                        </div>
                      </button>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                          {interiorPreview.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200">
                              <img
                                src={img.url}
                                alt={`Interior ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeInteriorImage(index)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {interiorPreview.length < 10 && (
                          <button
                            type="button"
                            onClick={() => interiorInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
                          >
                            <Upload className="w-4 h-4" />
                            Add More Images ({interiorPreview.length}/10)
                          </button>
                        )}
                      </div>
                    )}
                    
                    {errors.interior_images && (
                      <p className="text-red-600 text-sm mt-2">{errors.interior_images}</p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      ref={exteriorInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExteriorImagesSelect}
                      className="hidden"
                    />
                    
                    {exteriorPreview.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => exteriorInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary-500 hover:bg-white transition flex flex-col items-center justify-center gap-3"
                      >
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Upload Exterior Images</p>
                          <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                        </div>
                      </button>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                          {exteriorPreview.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200">
                              <img
                                src={img.url}
                                alt={`Exterior ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeExteriorImage(index)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {exteriorPreview.length < 10 && (
                          <button
                            type="button"
                            onClick={() => exteriorInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
                          >
                            <Upload className="w-4 h-4" />
                            Add More Images ({exteriorPreview.length}/10)
                          </button>
                        )}
                      </div>
                    )}
                    
                    {errors.exterior_images && (
                      <p className="text-red-600 text-sm mt-2">{errors.exterior_images}</p>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
