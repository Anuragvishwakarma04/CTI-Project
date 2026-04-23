# Enhanced My Garage Design - Implementation Guide

## Changes Needed in `/app/dashboard/page.tsx`

### 1. Add Image State to Vehicle Form

Replace the vehicleForm state initialization (around line 28) with:

```typescript
const [vehicleForm, setVehicleForm] = useState({
  vehicle_number: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  registration_date: '',
  insurance_expiry: '',
  pollution_expiry: '',
  has_warranty: false,
  warranty_expiry: '',
  last_service_date: '',
  next_service_date: '',
  notes: '',
  vehicle_image: null as File | null,  // ADD THIS LINE
});
const [imagePreview, setImagePreview] = useState<string | null>(null);  // ADD THIS LINE
```

### 2. Update handleAddVehicle Function

Replace the handleAddVehicle function with:

```typescript
const handleAddVehicle = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = auth.getToken();
  if (!token) return;

  setVehicleMessage('');
  try {
    const formData = new FormData();
    Object.entries(vehicleForm).forEach(([key, value]) => {
      if (key === 'vehicle_image' && value instanceof File) {
        formData.append('vehicle_image', value);
      } else if (value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });

    const response = await garageApi.createWithImage(token, formData);
    if (response.success) {
      setVehicleMessage('Vehicle added successfully!');
      setTimeout(() => {
        setShowAddVehicleModal(false);
        setVehicleForm({
          vehicle_number: '',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          registration_date: '',
          insurance_expiry: '',
          pollution_expiry: '',
          has_warranty: false,
          warranty_expiry: '',
          last_service_date: '',
          next_service_date: '',
          notes: '',
          vehicle_image: null,
        });
        setImagePreview(null);
        fetchGarageVehicles();
        setVehicleMessage('');
      }, 2000);
    } else {
      setVehicleMessage(response.message || 'Failed to add vehicle');
    }
  } catch (error) {
    setVehicleMessage('Failed to add vehicle');
  }
};
```

### 3. Replace Garage Tab Content

Find the `{activeTab === 'garage' && (` section and replace with:

```typescript
{activeTab === 'garage' && (
  <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-2xl font-bold">My Garage</h3>
        <p className="text-sm text-gray-600 mt-1">Track your vehicles and maintenance</p>
      </div>
      <button onClick={() => setShowAddVehicleModal(true)} className="btn-primary flex items-center gap-2">
        <Car className="w-4 h-4" />
        Add Vehicle
      </button>
    </div>
    {garageLoading ? (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : garageVehicles.length === 0 ? (
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-12 text-center border-2 border-indigo-100">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="w-12 h-12 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No vehicles in garage</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">Add your vehicles to track maintenance schedules, insurance, and service history</p>
        <button onClick={() => setShowAddVehicleModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Car className="w-4 h-4" />
          Add Your First Vehicle
        </button>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {garageVehicles.map((vehicle) => {
          const getDaysRemaining = (date: string) => {
            const diff = new Date(date).getTime() - new Date().getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
          };
          
          const insuranceDays = vehicle.insurance_expiry ? getDaysRemaining(vehicle.insurance_expiry) : null;
          const pucDays = vehicle.pollution_expiry ? getDaysRemaining(vehicle.pollution_expiry) : null;
          const serviceDays = vehicle.next_service_date ? getDaysRemaining(vehicle.next_service_date) : null;

          return (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
              {/* Vehicle Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-blue-100">
                {vehicle.vehicle_image ? (
                  <Image src={vehicle.vehicle_image} alt={vehicle.vehicle_number} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-20 h-20 text-indigo-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <p className="text-xs font-bold text-gray-900">{vehicle.vehicle_number}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{vehicle.brand} {vehicle.model}</h4>
                    <p className="text-sm text-gray-600">{vehicle.year}</p>
                  </div>
                  <button onClick={() => handleDeleteVehicle(vehicle.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Status Badges */}
                <div className="space-y-2 mb-4">
                  {serviceDays !== null && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      serviceDays < 0 ? 'bg-red-100 text-red-700' :
                      serviceDays <= 7 ? 'bg-red-100 text-red-700' :
                      serviceDays <= 30 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      <Wrench className="w-4 h-4" />
                      <span>Service {serviceDays < 0 ? 'Overdue' : `in ${serviceDays}d`}</span>
                    </div>
                  )}
                  {insuranceDays !== null && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      insuranceDays < 0 ? 'bg-red-100 text-red-700' :
                      insuranceDays <= 7 ? 'bg-red-100 text-red-700' :
                      insuranceDays <= 30 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      <FileText className="w-4 h-4" />
                      <span>Insurance {insuranceDays < 0 ? 'Expired' : `in ${insuranceDays}d`}</span>
                    </div>
                  )}
                  {pucDays !== null && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      pucDays < 0 ? 'bg-red-100 text-red-700' :
                      pucDays <= 7 ? 'bg-red-100 text-red-700' :
                      pucDays <= 30 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      <Shield className="w-4 h-4" />
                      <span>PUC {pucDays < 0 ? 'Expired' : `in ${pucDays}d`}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {vehicle.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 line-clamp-2">{vehicle.notes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}
```

### 4. Update Add Vehicle Modal

Find the Add Vehicle Modal section and add image upload field after the year field:

```typescript
<div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image</label>
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition">
    {imagePreview ? (
      <div className="relative">
        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-3" />
        <button
          type="button"
          onClick={() => {
            setVehicleForm({ ...vehicleForm, vehicle_image: null });
            setImagePreview(null);
          }}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ) : (
      <>
        <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setVehicleForm({ ...vehicleForm, vehicle_image: file });
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="hidden"
          id="vehicle-image"
        />
        <label htmlFor="vehicle-image" className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Click to upload vehicle image
        </label>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
      </>
    )}
  </div>
</div>
```

### 5. Update API Helper

Add to `/lib/api/garage.ts`:

```typescript
async createWithImage(token: string, formData: FormData): Promise<{ success: boolean; vehicle: GarageVehicle; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/garage/vehicles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
},
```

### 6. Update GarageVehicle Interface

In `/lib/api/garage.ts`, add to the interface:

```typescript
export interface GarageVehicle {
  id: number;
  vehicle_number: string;
  brand?: string;
  model?: string;
  year?: number;
  registration_date?: string;
  insurance_expiry?: string;
  pollution_expiry?: string;
  has_warranty: boolean;
  warranty_expiry?: string;
  last_service_date?: string;
  next_service_date?: string;
  notes?: string;
  vehicle_image?: string;  // ADD THIS LINE
  created_at: string;
}
```

## Summary of Enhancements

✅ Modern card-based design with gradient backgrounds
✅ Vehicle image upload with preview
✅ Color-coded status badges (red/yellow/green)
✅ Days remaining calculation for reminders
✅ Hover effects and smooth transitions
✅ Better empty state with call-to-action
✅ Improved visual hierarchy
✅ Responsive grid layout
