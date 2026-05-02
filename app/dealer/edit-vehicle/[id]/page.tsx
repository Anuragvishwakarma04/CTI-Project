'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, auth } from '@/lib/api';
import { vehicleMasters, Brand, Model, Variant } from '@/lib/api/vehicle-masters';
import { ArrowLeft, Save, Car, X, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { getDashboardRoute } from '@/utils/getDashboardRoute';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const OWNERSHIPS = ['1st owner', '2nd owner', '3rd owner', '4th owner'];
const FEATURES_LIST = ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Reverse Camera', 'Cruise Control', 'Alloy Wheels', 'Leather Seats', 'Navigation', 'Bluetooth', 'Keyless Entry'];

export default function EditVehiclePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [vehicle, setVehicle] = useState<any>(null);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const {user} = useStore()
  
  const [form, setForm] = useState({
    brandId: '', brand: '', modelId: '', model: '', variantId: '', variant: '', year: new Date().getFullYear(),
    registration_number: '', fuel_type: 'petrol', transmission: 'manual',
    kilometers: '', ownership: '1st owner', color: '', body_type: 'sedan',
    purchase_price: '', expected_selling_price: '', minimum_selling_price: '',
    has_insurance: false, insurance_expiry: '', description: '',
    features: [] as string[],
  });
  
  const [newImages, setNewImages] = useState({
    featured_image: null as File | null,
    front_images: [] as File[],
    rear_images: [] as File[],
    side_images: [] as File[],
    interior_images: [] as File[],
    dashboard_images: [] as File[],
    engine_images: [] as File[],
    other_images: [] as File[],
  });

  useEffect(() => {
    const loadData = async () => {
      const loadedBrands = await fetchBrands();
      await fetchVehicle(loadedBrands);
    };
    loadData();
  }, [id]);

  const fetchBrands = async () => {
    try {
      console.log('Fetching brands...');
      const response = await vehicleMasters.getBrands();
      if (response.success) {
        console.log('Brands loaded:', response.data.length);
        setBrands(response.data);
        return response.data;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      return [];
    }
  };

  const fetchModels = async (brandId: number) => {
    try {
      setModels([]);
      setVariants([]);
      const response = await vehicleMasters.getModelsByBrand(brandId);
      if (response.success) setModels(response.data);
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  };

  const fetchVariants = async (modelId: number) => {
    try {
      setVariants([]);
      const response = await vehicleMasters.getVariantsByModel(modelId);
      if (response.success) setVariants(response.data);
    } catch (err) {
      console.error('Failed to fetch variants:', err);
    }
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find(b => b.id === Number(brandId));
    setForm(prev => ({ 
      ...prev, 
      brandId, 
      brand: brand?.brand_name || '',
      modelId: '',
      model: '',
      variantId: '',
      variant: '',
      fuel_type: '',
      transmission: '',
      body_type: ''
    }));
    if (brandId) fetchModels(Number(brandId));
  };

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === Number(modelId));
    setForm(prev => ({ 
      ...prev, 
      modelId, 
      model: model?.model_name || '',
      variantId: '',
      variant: '',
      fuel_type: '',
      transmission: '',
      body_type: ''
    }));
    if (modelId) fetchVariants(Number(modelId));
  };

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === Number(variantId));
    if (variant) {
      setForm(prev => ({ 
        ...prev, 
        variantId, 
        variant: variant.variant_name,
        fuel_type: variant.fuel_type?.fuel_type?.toLowerCase() || '',
        transmission: variant.transmission?.transmission_type?.toLowerCase() || '',
        body_type: variant.body_type?.type_name?.toLowerCase() || ''
      }));
    }
  };

  const fetchVehicle = async (loadedBrands: Brand[]) => {
    try {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      console.log('Fetching vehicle...');
      const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const v = data.data;
        console.log('Vehicle data:', v);
        setVehicle(v);
        setExistingImages(v.images || []);
        
        // Find brand by name
        console.log('Looking for brand:', v.brand, 'in', loadedBrands.length, 'brands');
        const matchedBrand = loadedBrands.find(b => b.brand_name.toLowerCase() === v.brand?.toLowerCase());
        console.log('Matched brand:', matchedBrand);
        
        // Load models if brand found
        let matchedModel = null;
        let variantsResponse: any = null;
        if (matchedBrand) {
          console.log('Loading models for brand:', matchedBrand.id);
          const modelsResponse = await vehicleMasters.getModelsByBrand(matchedBrand.id);
          if (modelsResponse.success) {
            console.log('Models loaded:', modelsResponse.data.length);
            setModels(modelsResponse.data);
            matchedModel = modelsResponse.data.find((m: Model) => m.model_name.toLowerCase() === v.model?.toLowerCase());
            console.log('Matched model:', matchedModel);
            
            // Load variants if model found
            if (matchedModel) {
              console.log('Loading variants for model:', matchedModel.id);
              variantsResponse = await vehicleMasters.getVariantsByModel(matchedModel.id);
              if (variantsResponse.success) {
                console.log('Variants loaded:', variantsResponse.data.length);
                setVariants(variantsResponse.data);
              }
            }
          }
        }
        
        console.log('Setting form with brandId:', matchedBrand?.id, 'modelId:', matchedModel?.id);
        
        // Build initial form data
        const initialFormData: any = {
          brandId: matchedBrand?.id.toString() || '',
          brand: v.brand || '',
          modelId: matchedModel?.id.toString() || '',
          model: v.model || '',
          variantId: '',
          variant: v.variant || '',
          year: v.year || new Date().getFullYear(),
          registration_number: v.registration_number || '',
          fuel_type: v.fuel_type?.toLowerCase() || 'petrol',
          transmission: v.transmission?.toLowerCase() || 'manual',
          kilometers: v.km_driven || v.kilometers || '',
          ownership: v.ownership || '1st owner',
          color: v.color || '',
          body_type: v.body_type?.toLowerCase() || 'sedan',
          purchase_price: v.purchase_price || '',
          expected_selling_price: v.expected_selling_price || v.price || '',
          minimum_selling_price: v.minimum_selling_price || '',
          has_insurance: v.has_insurance || false,
          insurance_expiry: v.insurance_expiry || '',
          description: v.description || '',
          features: v.features || [],
        };
        
        // If variant was matched, update the form data with variant info
        if (matchedModel && variantsResponse) {
          const matchedVariant = variantsResponse.data.find((variant: Variant) => 
            variant.variant_name.toLowerCase() === v.variant?.toLowerCase()
          );
          if (matchedVariant) {
            console.log('Matched variant:', matchedVariant);
            initialFormData.variantId = matchedVariant.id.toString();
            initialFormData.fuel_type = matchedVariant.fuel_type?.fuel_type?.toLowerCase() || initialFormData.fuel_type;
            initialFormData.transmission = matchedVariant.transmission?.transmission_type?.toLowerCase() || initialFormData.transmission;
            initialFormData.body_type = matchedVariant.body_type?.type_name?.toLowerCase() || initialFormData.body_type;
          }
        }
        
        setForm(initialFormData);
      } else {
        setError(data.message || 'Failed to load vehicle');
      }
    } catch (err) {
      console.error('Fetch vehicle error:', err);
      setError('Failed to load vehicle');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));
  };

  const handleImageUpload = (category: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    if (category === 'featured_image') {
      setNewImages(prev => ({ ...prev, featured_image: fileArray[0] }));
    } else {
      setNewImages(prev => ({
        ...prev,
        [category]: [...prev[category as keyof typeof prev] as File[], ...fileArray],
      }));
    }
  };

  const removeNewImage = (category: string, index?: number) => {
    if (category === 'featured_image') {
      setNewImages(prev => ({ ...prev, featured_image: null }));
    } else if (index !== undefined) {
      setNewImages(prev => ({
        ...prev,
        [category]: (prev[category as keyof typeof prev] as File[]).filter((_, i) => i !== index),
      }));
    }
  };

  const markImageForRemoval = (imageId: number) => {
    setImagesToRemove(prev => 
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = auth.getToken();
    if (!token) return;
    
    try {
      setLoading(true);
      setError('');
      
      const fd = new FormData();
      
      // Basic details
      fd.append('brand', form.brand);
      fd.append('model', form.model);
      fd.append('variant', form.variant);
      fd.append('year', String(form.year));
      fd.append('fuel_type', form.fuel_type);
      fd.append('transmission', form.transmission);
      fd.append('kilometers', String(form.kilometers));
      fd.append('ownership', form.ownership);
      fd.append('color', form.color);
      fd.append('body_type', form.body_type);
      fd.append('expected_selling_price', String(form.expected_selling_price));
      fd.append('description', form.description);
      
      if (form.purchase_price) fd.append('purchase_price', String(form.purchase_price));
      if (form.minimum_selling_price) fd.append('minimum_selling_price', String(form.minimum_selling_price));
      if (form.has_insurance) {
        fd.append('has_insurance', '1');
        if (form.insurance_expiry) fd.append('insurance_expiry', form.insurance_expiry);
      }
      
      // Features
      form.features.forEach(f => fd.append('features[]', f));
      
      // Images to remove
      imagesToRemove.forEach(imgId => fd.append('remove_images[]', String(imgId)));
      
      // New images
      if (newImages.featured_image) fd.append('featured_image', newImages.featured_image);
      
      Object.entries(newImages).forEach(([key, files]) => {
        if (key !== 'featured_image' && Array.isArray(files)) {
          files.forEach(file => fd.append(`${key}[]`, file));
        }
      });

      const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}/edit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: fd,
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Vehicle updated successfully! Redirecting...');
      router.push(getDashboardRoute(user?.user_type));
      } else {
        setError(data.message || 'Failed to update vehicle');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle not found</h3>
        <button onClick={() => router.push('/dealer/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <button onClick={() => router.push('/dealer/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
          <p className="text-sm text-gray-600">Vehicle ID: {id}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Details */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Vehicle Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select value={form.brandId} onChange={e => handleBrandChange(e.target.value)} className="input-field w-full" required>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <select value={form.modelId} onChange={e => handleModelChange(e.target.value)} className="input-field w-full" disabled={!form.brandId} required>
                <option value="">Select Model</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.model_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              <select value={form.variantId} onChange={e => handleVariantChange(e.target.value)} className="input-field w-full" disabled={!form.modelId}>
                <option value="">Select Variant</option>
                {variants.map(v => <option key={v.id} value={v.id}>{v.variant_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input type="number" value={form.year} onChange={e => handleChange('year', Number(e.target.value))} className="input-field w-full" min={2000} max={new Date().getFullYear()} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input type="text" value={form.registration_number} className="input-field w-full bg-gray-100" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" value={form.color} onChange={e => handleChange('color', e.target.value)} className="input-field w-full" placeholder="e.g. White" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
              <input type="text" value={form.fuel_type} className="input-field w-full bg-gray-50" disabled placeholder="Auto-filled from variant" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
              <input type="text" value={form.transmission} className="input-field w-full bg-gray-50" disabled placeholder="Auto-filled from variant" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
              <input type="text" value={form.body_type} className="input-field w-full bg-gray-50" disabled placeholder="Auto-filled from variant" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ownership *</label>
              <select value={form.ownership} onChange={e => handleChange('ownership', e.target.value)} className="input-field w-full" required>
                {OWNERSHIPS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometers Driven *</label>
              <input type="number" value={form.kilometers} onChange={e => handleChange('kilometers', e.target.value)} className="input-field w-full" placeholder="e.g. 45000" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="input-field w-full" rows={3} placeholder="Describe the vehicle condition..." />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
              <input type="number" value={form.purchase_price} onChange={e => handleChange('purchase_price', e.target.value)} className="input-field w-full" placeholder="800000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Selling Price (₹) *</label>
              <input type="number" value={form.expected_selling_price} onChange={e => handleChange('expected_selling_price', e.target.value)} className="input-field w-full" placeholder="950000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Selling Price (₹)</label>
              <input type="number" value={form.minimum_selling_price} onChange={e => handleChange('minimum_selling_price', e.target.value)} className="input-field w-full" placeholder="880000" />
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Insurance</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.has_insurance} onChange={e => handleChange('has_insurance', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Has valid insurance</span>
          </label>
          {form.has_insurance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
              <input type="date" value={form.insurance_expiry} onChange={e => handleChange('insurance_expiry', e.target.value)} className="input-field w-full sm:w-48" />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Features</h2>
          <div className="flex flex-wrap gap-2">
            {FEATURES_LIST.map(f => (
              <button key={f} type="button" onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  form.features.includes(f)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Existing Images</h2>
            <p className="text-sm text-gray-600">Click on images to mark for removal</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {existingImages.map((img: any) => (
                <div key={img.id} className="relative group">
                  <div className={`relative h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                    imagesToRemove.includes(img.id) ? 'border-red-500 opacity-50' : 'border-gray-200 hover:border-primary'
                  }`} onClick={() => markImageForRemoval(img.id)}>
                    <Image src={img.url} alt={img.category} fill className="object-cover" />
                    {imagesToRemove.includes(img.id) && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">{img.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Add New Images</h2>
          
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">Featured Image</label>
            {newImages.featured_image ? (
              <div className="relative inline-block">
                <img src={URL.createObjectURL(newImages.featured_image)} alt="Featured" className="h-32 rounded-lg" />
                <button type="button" onClick={() => removeNewImage('featured_image')} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input type="file" accept="image/*" onChange={e => handleImageUpload('featured_image', e.target.files)} className="hidden" id="featured-upload" />
                <label htmlFor="featured-upload" className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Featured Image
                </label>
              </div>
            )}
          </div>

          {/* Category Images */}
          <div className="grid sm:grid-cols-2 gap-4">
            {['front_images', 'rear_images', 'side_images', 'interior_images', 'dashboard_images', 'engine_images', 'other_images'].map(category => (
              <div key={category}>
                <label className="block text-sm font-semibold mb-2 capitalize">{category.replace('_', ' ')}</label>
                {(newImages[category as keyof typeof newImages] as File[]).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(newImages[category as keyof typeof newImages] as File[]).map((file, idx) => (
                      <div key={idx} className="relative">
                        <img src={URL.createObjectURL(file)} alt={`${category} ${idx}`} className="h-16 w-16 object-cover rounded" />
                        <button type="button" onClick={() => removeNewImage(category, idx)} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(category, e.target.files)} className="hidden" id={`${category}-upload`} />
                <label htmlFor={`${category}-upload`} className="btn-secondary cursor-pointer inline-flex items-center gap-2 text-sm">
                  <Upload className="w-3 h-3" /> Add ({(newImages[category as keyof typeof newImages] as File[]).length})
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save className="w-5 h-5" />Save Changes</>
          )}
        </button>
      </form>
    </div>
  );
}
