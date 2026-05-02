'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';
import { vehicleMasters, Brand, Model, Variant } from '@/lib/api/vehicle-masters';
import { Car, DollarSign, FileText, Image as ImageIcon, ChevronRight, ChevronLeft, Save, Check, Upload, X, Star, IndianRupee, AlertCircle } from 'lucide-react';
import { getDashboardRoute } from '@/utils/getDashboardRoute';
 
const OWNERSHIPS = ['1st owner', '2nd owner', '3rd owner', '4th owner'];

export default function AddVehiclePage() {
  const router = useRouter();
  const { user } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [uploadedImages, setUploadedImages] = useState<Record<string, any[]>>({});
 
  
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Details
    brandId: '',
    brand: '',
    modelId: '',
    model: '',
    variantId: '',
    variant: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    fuelType: '',
    transmission: '',
    kilometers: '',
    ownership: '',
    color: '',
    bodyType: '',
    engineNumber: '',
    chassisNumber: '',
    
    // Step 2: Financial
    purchasePrice: '',
    reconditioningCost: '',
    accessoriesCost: '',
    otherExpenses: '',
    expectedSellingPrice: '',
    minimumSellingPrice: '',
    
    // Step 3: Documentation
    insuranceExpiry: '',
    hasInsurance: true,
    rcDocument: null as File | null,
    insuranceDocument: null as File | null,
    
    // Step 4: Media
    description: '',
    features: [] as string[],
    images:[],
    
    // Step 5: Inventory
    status: 'available',
    networkVisible: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load brands on mount
    fetchBrands();
    
    // Load draft if draft parameter exists
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get('draft');
    if (draftId) {
      loadDraft(draftId);
    }
  }, [user, router]);

  // Load images when vehicleId is set and on step 4
  useEffect(() => {
    if (vehicleId && currentStep === 4) {
      loadVehicleImages(vehicleId);
    }
  }, [vehicleId, currentStep]);

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = await vehicleMasters.getBrands();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchModels = async (brandId: number) => {
    try {
      setLoadingModels(true);
      setModels([]);
      setVariants([]);
      const response = await vehicleMasters.getModelsByBrand(brandId);
      if (response.success) {
        setModels(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchVariants = async (modelId: number) => {
    try {
      setLoadingVariants(true);
      setVariants([]);
      const response = await vehicleMasters.getVariantsByModel(modelId);
      if (response.success) {
        setVariants(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch variants:', err);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find(b => b.id === Number(brandId));
    setFormData(prev => ({ 
      ...prev, 
      brandId, 
      brand: brand?.brand_name || '',
      modelId: '',
      model: '',
      variantId: '',
      variant: '',
      fuelType: '',
      transmission: '',
      bodyType: ''
    }));
    if (brandId) fetchModels(Number(brandId));
  };

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === Number(modelId));
    setFormData(prev => ({ 
      ...prev, 
      modelId, 
      model: model?.model_name || '',
      variantId: '',
      variant: '',
      fuelType: '',
      transmission: '',
      bodyType: ''
    }));
    if (modelId) fetchVariants(Number(modelId));
  };

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === Number(variantId));
    if (variant) {
      setFormData(prev => ({ 
        ...prev, 
        variantId, 
        variant: variant.variant_name,
        fuelType: variant.fuel_type?.fuel_type?.toLowerCase() || '',
        transmission: variant.transmission?.transmission_type?.toLowerCase() || '',
        bodyType: variant.body_type?.type_name?.toLowerCase() || ''
      }));
    }
  };

  const loadDraft = async (draftId: string) => {
    try {
      setLoadingDraft(true);
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      console.log('Loading draft:', draftId);
      const response = await api.getVehicle(token, draftId);
      console.log('Draft response:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        console.log('Draft data:', data);
        console.log('fuel_type from API:', data.fuel_type);
        console.log('body_type from API:', data.body_type);
        setVehicleId(data.vehicle_id);
        
        // Populate form with draft data
        const newFormData = {
          brand: data.brand || '',
          model: data.model || '',
          variant: data.variant || '',
          year: parseInt(data.year) || new Date().getFullYear(),
          registrationNumber: data.registration_number || '',
          fuelType: data.fuel_type?.toLowerCase() || '',
          transmission: data.transmission?.toLowerCase() || '',
          kilometers: (data.km_driven || data.kilometers)?.toString() || '',
          ownership: data.ownership || '',
          color: data.color || '',
          bodyType: data.body_type?.toLowerCase() || '',
          engineNumber: data.engine_number || '',
          chassisNumber: data.chassis_number || '',
          purchasePrice: parseFloat(data.purchase_price)?.toString() || '',
          reconditioningCost: parseFloat(data.reconditioning_cost)?.toString() || '',
          accessoriesCost: parseFloat(data.accessories_cost)?.toString() || '',
          otherExpenses: parseFloat(data.other_expenses)?.toString() || '',
          expectedSellingPrice: parseFloat(data.expected_selling_price)?.toString() || '',
          minimumSellingPrice: parseFloat(data.minimum_selling_price)?.toString() || '',
          insuranceExpiry: data.insurance_expiry || '',
          hasInsurance: data.has_insurance ?? true,
          description: data.description || '',
          features: data.features || [],
          status: data.status || 'available',
          networkVisible: true,
          rcDocument: null,
          insuranceDocument: null,
          images: formData.images,
        };
        
        console.log('km_driven:', data.km_driven);
        console.log('kilometers field:', newFormData.kilometers);
        
        console.log('Setting formData:', newFormData);
        setFormData(newFormData as any);
        
        setSuccess('Draft loaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
        
        // Load existing images
        loadVehicleImages(draftId);
      } else {
        throw new Error(response.message || 'Failed to load draft');
      }
    } catch (err: any) {
      console.error('Draft load error:', err);
      setError(err.message || 'Failed to load draft');
    } finally {
      setLoadingDraft(false);
    }
  };

  const loadVehicleImages = async (vehicleId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      const response = await api.getVehicleImages(token, vehicleId);
      console.log('Load images response:', response);
      
      if (response.success) {
        // Images are in response.data.images
        const images = response.data?.images || response.data || [];
        console.log('Images to process:', images);
        
        const imagesByCategory: Record<string, any[]> = {};
        images.forEach((img: any) => {
          const category = img.category || 'other';
          if (!imagesByCategory[category]) {
            imagesByCategory[category] = [];
          }
          imagesByCategory[category].push(img);
        });
        
        console.log('Images by category:', imagesByCategory);
        setUploadedImages(imagesByCategory);
      }
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleImageUpload = async (category: string, files: FileList | null) => {
    if (!files || !vehicleId) return;
    
    const token = auth.getToken();
    if (!token) return;
    
    setUploadingImages(prev => ({ ...prev, [category]: true }));
    
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(file => 
        api.uploadVehicleImage(token, vehicleId, file, category)
      );
      
      const results = await Promise.all(uploadPromises);
      
      // Update uploaded images state
      setUploadedImages(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), ...results.map(r => r.data)]
      }));
      
      setSuccess(`${fileArray.length} image(s) uploaded successfully!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploadingImages(prev => ({ ...prev, [category]: false }));
    }
  };

  const removeImage = async (category: string, imageId: number | string) => {
    if (!vehicleId || !imageId) return;
    
    const token = auth.getToken();
    if (!token) return;
    
    try {
      // If imageId is 'featured', use category-based delete
      if (imageId === 'featured') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${vehicleId}/images/featured`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!res.ok) throw new Error('Failed to delete featured image');
      } else {
        await api.deleteVehicleImage(token, vehicleId, imageId as number);
      }
      
      // Update uploaded images state
      setUploadedImages(prev => ({
        ...prev,
        [category]: (prev[category] || []).filter(img => 
          imageId === 'featured' ? false : img.id !== imageId
        )
      }));
      
      setSuccess('Image deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  };

  const totalCost = Number(formData.purchasePrice || 0) + 
                    Number(formData.reconditioningCost || 0) + 
                    Number(formData.accessoriesCost || 0) + 
                    Number(formData.otherExpenses || 0);
  
  const expectedProfit = Number(formData.expectedSellingPrice || 0) - totalCost;
  const profitMargin = totalCost > 0 ? (expectedProfit / totalCost) * 100 : 0;
  
  const getProfitColor = () => {
    if (profitMargin >= 10) return 'text-green-600 bg-green-50';
    if (profitMargin >= 5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const steps = [
    { id: 1, name: 'Vehicle Details', icon: Car },
    { id: 2, name: 'Financial Info', icon: IndianRupee },
    { id: 3, name: 'Documentation', icon: FileText },
    { id: 4, name: 'Media & Listing', icon: ImageIcon },
  ];

  const handleNext = async () => {
    if (loading) return;
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      if (currentStep === 1) {
        // Step 1: Create or update vehicle draft
        const step1Data: any = {
          brand: formData.brand,
          model: formData.model,
          variant: formData.variant || undefined,
          year: formData.year,
          fuel_type: formData.fuelType,
          transmission: formData.transmission,
          kilometers: Number(formData.kilometers),
          ownership: formData.ownership,
          color: formData.color || undefined,
          body_type: formData.bodyType,
        };
        
        // Only include registration_number if not editing draft
        if (!vehicleId && formData.registrationNumber) {
          step1Data.registration_number = formData.registrationNumber;
        }
        
        const response = vehicleId 
          ? await api.updateVehicleDraft(token, vehicleId, step1Data)
          : await api.createVehicleStep1(token, step1Data);
          
        if (response.success) {
          if (!vehicleId) setVehicleId(response.vehicle_id);
          setSuccess(response.message);
          setCurrentStep(2);
        } else {
          throw new Error(response.message || 'Failed to save vehicle details');
        }
      } else if (currentStep === 2 && vehicleId) {
        // Step 2: Update financial info
        const step2Data: any = {
          purchase_price: Number(formData.purchasePrice),
          expected_selling_price: Number(formData.expectedSellingPrice),
        };
        
        if (formData.reconditioningCost) step2Data.reconditioning_cost = Number(formData.reconditioningCost);
        if (formData.accessoriesCost) step2Data.accessories_cost = Number(formData.accessoriesCost);
        if (formData.otherExpenses) step2Data.other_expenses = Number(formData.otherExpenses);
        if (formData.minimumSellingPrice) step2Data.minimum_selling_price = Number(formData.minimumSellingPrice);
        
        const response = await api.updateVehicleDraft(token, vehicleId, step2Data);
        if (response.success) {
          setSuccess(response.message);
          setCurrentStep(3);
        } else {
          throw new Error(response.message || 'Failed to save financial information');
        }
      } else if (currentStep === 3 && vehicleId) {
        // Step 3: Update legal & documents
        const formDataStep3 = new FormData();
        formDataStep3.append('has_insurance', formData.hasInsurance.toString());
        
        if (formData.engineNumber) formDataStep3.append('engine_number', formData.engineNumber);
        if (formData.chassisNumber) formDataStep3.append('chassis_number', formData.chassisNumber);
        if (formData.hasInsurance && formData.insuranceExpiry) {
          formDataStep3.append('insurance_expiry', formData.insuranceExpiry);
        }
        if (formData.rcDocument) formDataStep3.append('rc_document', formData.rcDocument);
        if (formData.insuranceDocument) formDataStep3.append('insurance_document', formData.insuranceDocument);
        
        const response = await api.updateVehicleDraftWithFiles(token, vehicleId, formDataStep3);
        if (response.success) {
          setSuccess(response.message);
          setCurrentStep(4);
        } else {
          throw new Error(response.message || 'Failed to save documents');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (loading || !vehicleId) return;
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      // Step 4: Finalize listing (images already uploaded)
      const step4Data: any = {
        status: formData.status,
      };
      
      if (formData.description) step4Data.description = formData.description;
      if (formData.features.length > 0) step4Data.features = formData.features;
      
      console.log('Submitting Step 4 data...');
      const response = await api.updateVehicleStep4(token, vehicleId, step4Data);
      console.log('Step 4 response:', response);
      
      if (response.success) {
        setSuccess('Vehicle submitted successfully! Redirecting...');
        setTimeout(() => {
          router.push(getDashboardRoute(user?.user_type));
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit vehicle');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (loading) return;
    setError('');
    setSuccess('Draft saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) return null;

  if (loadingDraft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(getDashboardRoute(user?.user_type))}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-4 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Vehicle</h1>
          <p className="text-gray-600">Complete all steps to list your vehicle</p>
          {vehicleId && (
            <p className="text-sm text-primary mt-2">Vehicle ID: <span className="font-mono font-semibold">{vehicleId}</span></p>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-primary text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-sm font-medium mt-2 ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                      {step.name}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Step 1: Vehicle Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Brand *</label>
                      <select 
                        value={formData.brandId}
                        onChange={(e) => handleBrandChange(e.target.value)}
                        className="input-field"
                        disabled={loadingBrands}
                      >
                        <option value="">{loadingBrands ? 'Loading...' : 'Select Brand'}</option>
                        {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.brand_name}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Model *</label>
                      <select 
                        value={formData.modelId}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className="input-field"
                        disabled={!formData.brandId || loadingModels}
                      >
                        <option value="">{loadingModels ? 'Loading...' : 'Select Model'}</option>
                        {models.map(model => <option key={model.id} value={model.id}>{model.model_name}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Variant</label>
                      <select 
                        value={formData.variantId}
                        onChange={(e) => handleVariantChange(e.target.value)}
                        className="input-field"
                        disabled={!formData.modelId || loadingVariants}
                      >
                        <option value="">{loadingVariants ? 'Loading...' : 'Select Variant'}</option>
                        {variants.map(variant => <option key={variant.id} value={variant.id}>{variant.variant_name}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Year *</label>
                      <select 
                        value={formData.year}
                        onChange={(e) => handleChange('year', Number(e.target.value))}
                        className="input-field"
                      >
                        {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Registration Number {!vehicleId && '*'}</label>
                      <input 
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                        placeholder="MH12AB1234"
                        className="input-field uppercase"
                        disabled={!!vehicleId}
                      />
                      {vehicleId && (
                        <p className="text-xs text-gray-500 mt-1">Registration number cannot be changed</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Fuel Type *</label>
                      <input 
                        type="text"
                        value={formData.fuelType}
                        className="input-field bg-gray-50"
                        disabled
                        placeholder="Auto-filled from variant"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Transmission *</label>
                      <input 
                        type="text"
                        value={formData.transmission}
                        className="input-field bg-gray-50"
                        disabled
                        placeholder="Auto-filled from variant"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Kilometers Driven *</label>
                      <input 
                        type="number"
                        value={formData.kilometers}
                        onChange={(e) => handleChange('kilometers', e.target.value)}
                        placeholder="50000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Ownership *</label>
                      <select 
                        value={formData.ownership}
                        onChange={(e) => handleChange('ownership', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select Ownership</option>
                        {OWNERSHIPS.map(own => <option key={own} value={own}>{own}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Color</label>
                      <input 
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        placeholder="White, Black, Silver"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Body Type *</label>
                      <input 
                        type="text"
                        value={formData.bodyType}
                        className="input-field bg-gray-50"
                        disabled
                        placeholder="Auto-filled from variant"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Financial Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Financial Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Purchase Price *</label>
                      <input 
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) => handleChange('purchasePrice', e.target.value)}
                        placeholder="500000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Reconditioning Cost</label>
                      <input 
                        type="number"
                        value={formData.reconditioningCost}
                        onChange={(e) => handleChange('reconditioningCost', e.target.value)}
                        placeholder="25000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Accessories Cost</label>
                      <input 
                        type="number"
                        value={formData.accessoriesCost}
                        onChange={(e) => handleChange('accessoriesCost', e.target.value)}
                        placeholder="15000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Other Expenses</label>
                      <input 
                        type="number"
                        value={formData.otherExpenses}
                        onChange={(e) => handleChange('otherExpenses', e.target.value)}
                        placeholder="10000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Expected Selling Price *</label>
                      <input 
                        type="number"
                        value={formData.expectedSellingPrice}
                        onChange={(e) => handleChange('expectedSellingPrice', e.target.value)}
                        placeholder="600000"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Minimum Selling Price</label>
                      <input 
                        type="number"
                        value={formData.minimumSellingPrice}
                        onChange={(e) => handleChange('minimumSellingPrice', e.target.value)}
                        placeholder="550000"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documentation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Legal & Documents</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Engine Number</label>
                      <input 
                        type="text"
                        value={formData.engineNumber}
                        onChange={(e) => handleChange('engineNumber', e.target.value.toUpperCase())}
                        placeholder="ABC123456"
                        className="input-field uppercase"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Chassis Number / VIN</label>
                      <input 
                        type="text"
                        value={formData.chassisNumber}
                        onChange={(e) => handleChange('chassisNumber', e.target.value.toUpperCase())}
                        placeholder="MA3ERLF3S00123456"
                        className="input-field uppercase"
                      />
                    </div>
                  </div>
                  
                  {/* Insurance Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <label className="block text-sm font-semibold mb-3">Insurance Status</label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio"
                          checked={formData.hasInsurance}
                          onChange={() => handleChange('hasInsurance', true)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Has Valid Insurance</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio"
                          checked={!formData.hasInsurance}
                          onChange={() => handleChange('hasInsurance', false)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">No Insurance</span>
                      </label>
                    </div>
                    
                    {formData.hasInsurance && (
                      <div>
                        <label className="block text-sm font-semibold mb-2">Insurance Expiry Date</label>
                        <input 
                          type="date"
                          value={formData.insuranceExpiry}
                          onChange={(e) => handleChange('insuranceExpiry', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                      {formData.rcDocument ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">✓ {formData.rcDocument.name}</p>
                          <button onClick={() => handleChange('rcDocument', null)} className="text-red-600 text-sm">Remove</button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-700">Upload RC Document</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            id="rc-upload"
                            onChange={(e) => e.target.files && handleChange('rcDocument', e.target.files[0])}
                          />
                          <label htmlFor="rc-upload" className="btn-primary cursor-pointer inline-block mt-2">Choose File</label>
                        </>
                      )}
                    </div>
                    
                    {formData.hasInsurance && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                        {formData.insuranceDocument ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">✓ {formData.insuranceDocument.name}</p>
                            <button onClick={() => handleChange('insuranceDocument', null)} className="text-red-600 text-sm">Remove</button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">Upload Insurance Copy</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.jpg,.jpeg,.png" 
                              id="insurance-upload"
                              onChange={(e) => e.target.files && handleChange('insuranceDocument', e.target.files[0])}
                            />
                            <label htmlFor="insurance-upload" className="btn-primary cursor-pointer inline-block mt-2">Choose File</label>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Media & Listing */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Photos & Listing</h2>
                    <div className="text-sm text-gray-600">
                      Total Images: <span className="font-semibold text-primary">
                        {Object.values(uploadedImages).reduce((sum, imgs) => sum + imgs.length, 0)}
                      </span>
                    </div>
                  </div>
                  
                  {!vehicleId && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                      <p className="text-sm">Please complete previous steps to upload images.</p>
                    </div>
                  )}
                  
                  {/* Featured Image */}
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      Featured Image (Main Display) *
                    </label>
                    <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center hover:border-primary-dark transition">
                      {uploadedImages.featured && uploadedImages.featured.length > 0 ? (
                        <div className="relative">
                          <img 
                            src={uploadedImages.featured[0].image_url} 
                            alt="Featured" 
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            onClick={() => removeImage('featured', uploadedImages.featured[0].id || 'featured')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer transition"
                            disabled={uploadingImages.featured}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          {uploadingImages.featured ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <p className="text-sm text-gray-600">Uploading...</p>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                              <p className="text-sm font-semibold text-gray-700 mb-1">Upload Featured Image</p>
                              <p className="text-xs text-gray-500 mb-3">This will be the main image shown on listings</p>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload('featured', e.target.files)}
                                className="hidden" 
                                id="featured-upload"
                                disabled={!vehicleId}
                              />
                              <label 
                                htmlFor="featured-upload" 
                                className={`btn-primary cursor-pointer inline-block ${!vehicleId ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                Choose Image
                              </label>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Categorized Image Uploads */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'front', label: 'Front View', icon: '🚗' },
                      { key: 'rear', label: 'Rear View', icon: '🔙' },
                      { key: 'side', label: 'Side Views', icon: '↔️' },
                      { key: 'interior', label: 'Interior', icon: '🪑' },
                      { key: 'dashboard', label: 'Dashboard', icon: '⚙️' },
                      { key: 'engine', label: 'Engine Bay', icon: '🔧' },
                    ].map(({ key, label, icon }) => (
                      <div key={key} className="border rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-3">
                          {icon} {label}
                        </label>
                        
                        {/* Preview Images */}
                        {uploadedImages[key] && uploadedImages[key].length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {uploadedImages[key].map((img: any, idx: number) => (
                              <div key={img.id || idx} className="relative group">
                                <img 
                                  src={img.image_url} 
                                  alt={`${label}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                {img.id && (
                                  <button
                                    onClick={() => removeImage(key, img.id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                    disabled={uploadingImages[key]}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {uploadingImages[key] && (
                          <div className="flex items-center justify-center gap-2 p-3 mb-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-xs text-gray-600">Uploading...</span>
                          </div>
                        )}
                        
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(key, e.target.files)}
                          className="hidden" 
                          id={`${key}-upload`}
                          disabled={!vehicleId || uploadingImages[key]}
                        />
                        <label 
                          htmlFor={`${key}-upload`} 
                          className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:border-primary cursor-pointer transition text-sm text-gray-600 hover:text-primary ${(!vehicleId || uploadingImages[key]) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Upload className="w-4 h-4" />
                          Add Images ({uploadedImages[key]?.length || 0})
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Other Images */}
                  <div className="border rounded-lg p-4">
                    <label className="block text-sm font-semibold mb-3">📸 Other Images</label>
                    {uploadedImages.other && uploadedImages.other.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {uploadedImages.other.map((img: any, idx: number) => (
                          <div key={img.id || idx} className="relative group">
                            <img 
                              src={img.image_url} 
                              alt="Other"
                              className="w-full h-20 object-cover rounded"
                            />
                            {img.id && (
                              <button
                                onClick={() => removeImage('other', img.id)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                disabled={uploadingImages.other}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {uploadingImages.other && (
                      <div className="flex items-center justify-center gap-2 p-3 mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-xs text-gray-600">Uploading...</span>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload('other', e.target.files)}
                      className="hidden" 
                      id="other-upload"
                      disabled={!vehicleId || uploadingImages.other}
                    />
                    <label 
                      htmlFor="other-upload" 
                      className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-primary cursor-pointer transition text-sm text-gray-600 hover:text-primary ${(!vehicleId || uploadingImages.other) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-5 h-5" />
                      Add More Images ({uploadedImages.other?.length || 0})
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Vehicle Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe the vehicle condition, features, and highlights..."
                      rows={6}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Highlight Features</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['ABS', 'Airbags', 'Sunroof', 'Leather Seats', 'Alloy Wheels', 'Music System'].map(feature => (
                        <label key={feature} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-1 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="input-field"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                      </select>
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input 
                      type="checkbox"
                      checked={formData.networkVisible}
                      onChange={(e) => handleChange('networkVisible', e.target.checked)}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-semibold text-sm">Make visible on network</p>
                      <p className="text-xs text-gray-600">Other dealers can see this listing</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button 
                    onClick={handleNext} 
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Vehicle'}
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Financial Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="font-semibold">₹{Number(formData.purchasePrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reconditioning</span>
                  <span className="font-semibold">₹{Number(formData.reconditioningCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accessories</span>
                  <span className="font-semibold">₹{Number(formData.accessoriesCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other Expenses</span>
                  <span className="font-semibold">₹{Number(formData.otherExpenses || 0).toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total Investment</span>
                    <span className="text-primary">₹{totalCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Expected Selling</span>
                    <span className="font-semibold">₹{Number(formData.expectedSellingPrice || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getProfitColor()}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Expected Profit</span>
                      <span className="text-xl font-bold">₹{expectedProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Margin</span>
                      <span className="text-lg font-bold">{profitMargin.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSaveDraft}
                disabled={loading || !vehicleId}
                className="w-full btn-secondary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
