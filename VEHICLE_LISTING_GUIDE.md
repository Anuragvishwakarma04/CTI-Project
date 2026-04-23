# Multi-Step Vehicle Listing - Complete Guide

## Overview

The vehicle listing system allows dealers to add vehicles through a 4-step process with automatic draft saving. Vehicles can be saved at any step and resumed later.

## Features

✅ **Multi-Step Form**: 4 clear steps for complete vehicle information  
✅ **Auto-Save Drafts**: Automatically saves progress after each step  
✅ **Resume Editing**: Continue from where you left off  
✅ **Status Tracking**: Track vehicle through approval workflow  
✅ **Image Management**: Categorized image uploads (front, rear, side, etc.)  
✅ **Financial Calculator**: Real-time profit margin calculation  
✅ **Validation**: Client and server-side validation  

---

## User Flow

### 1. Add New Vehicle
- Navigate to `/dealer/add-vehicle`
- Complete Step 1: Vehicle Details
- System creates draft with unique `vehicle_id`
- Continue through steps 2-4

### 2. Save as Draft
- Click "Save as Draft" at any step
- Vehicle saved with status: `draft`
- Access later from Drafts page

### 3. Resume Draft
- Navigate to `/dealer/drafts`
- Click "Continue Editing" on any draft
- Form loads with saved data
- Continue from any step

### 4. Submit Vehicle
- Complete all 4 steps
- Click "Submit Vehicle" on Step 4
- Status changes from `draft` to `pending`
- Admin reviews and approves

---

## Step-by-Step Process

### Step 1: Vehicle Details
**Creates draft with status: `draft`**

Fields:
- Brand (required)
- Model (required)
- Variant
- Year (required)
- Registration Number (required)
- Fuel Type (required)
- Transmission (required)
- Kilometers Driven (required)
- Ownership (required)
- Color
- Body Type (required)

API Call:
```typescript
POST /api/vehicles/step1
```

Response includes `vehicle_id` for subsequent steps.

---

### Step 2: Financial Information
**Updates draft**

Fields:
- Purchase Price (required)
- Reconditioning Cost
- Accessories Cost
- Other Expenses
- Expected Selling Price (required)
- Minimum Selling Price

Features:
- Real-time profit calculation
- Profit margin percentage
- Color-coded profit indicator

API Call:
```typescript
PUT /api/vehicles/{vehicle_id}/step2
```

---

### Step 3: Legal & Documents
**Updates draft**

Fields:
- Engine Number
- Chassis Number / VIN
- Insurance Status (Yes/No)
- Insurance Expiry Date (if applicable)
- RC Document Upload
- Insurance Document Upload

API Call:
```typescript
PUT /api/vehicles/{vehicle_id}/step3
```

---

### Step 4: Media & Listing
**Finalizes and changes status to `pending`**

Fields:
- Featured Image (required)
- Categorized Images:
  - Front View
  - Rear View
  - Side Views
  - Interior
  - Dashboard
  - Engine Bay
  - Other Images
- Vehicle Description
- Highlight Features (checkboxes)
- Status (Available/Reserved)
- Network Visibility

API Call:
```typescript
PUT /api/vehicles/{vehicle_id}/step4
```

After this step, vehicle status changes to `pending` for admin review.

---

## Status Workflow

```
draft → pending → under_review → approved → live
```

| Status | Description | User Action |
|--------|-------------|-------------|
| `draft` | Incomplete listing | Continue editing |
| `pending` | Submitted for review | Wait for admin |
| `under_review` | Admin reviewing | Wait for admin |
| `approved` | Admin approved | Vehicle goes live |
| `live` | Published on platform | Visible to buyers |

---

## Pages

### 1. Add Vehicle Page
**Route**: `/dealer/add-vehicle`

Features:
- 4-step form with progress indicator
- Financial summary sidebar
- Save as draft button
- Form validation
- Error/success messages
- Loading states

### 2. Drafts Page
**Route**: `/dealer/drafts`

Features:
- List all draft vehicles
- Show last updated date
- Continue editing button
- Empty state with CTA

### 3. Dashboard
**Route**: `/dealer/dashboard`

Shows:
- All vehicles (draft, pending, approved, live)
- Quick stats
- Recent activity

---

## API Integration

### lib/api.ts

```typescript
// Step 1: Create vehicle draft
async createVehicleStep1(token: string, data: any)

// Step 2: Update financial info
async updateVehicleStep2(token: string, vehicleId: string, data: any)

// Step 3: Update legal & documents
async updateVehicleStep3(token: string, vehicleId: string, formData: FormData)

// Step 4: Upload media and finalize
async updateVehicleStep4(token: string, vehicleId: string, formData: FormData)

// Get vehicle details
async getVehicle(token: string, vehicleId: string)

// Get all vehicles
async getVehicles(token: string, status?: string)
```

---

## Data Flow

### Step 1 (Create Draft)
```
User fills form → Submit → API creates draft → Returns vehicle_id → Store in state
```

### Steps 2-3 (Update Draft)
```
User fills form → Submit → API updates draft → Success message → Next step
```

### Step 4 (Finalize)
```
User uploads images → Submit → API updates + changes status → Redirect to dashboard
```

### Load Draft
```
User clicks "Continue Editing" → API fetches vehicle → Populate form → User continues
```

---

## Form Validation

### Client-Side
- Required field validation
- Format validation (registration number, etc.)
- File type validation (images, documents)
- File size validation (max 5MB)

### Server-Side
- All client validations
- Database constraints
- Business logic validation
- Duplicate registration check

---

## Image Management

### Categories
1. **Featured Image**: Main display image (required)
2. **Front View**: Front angle photos
3. **Rear View**: Back angle photos
4. **Side Views**: Left/right side photos
5. **Interior**: Cabin and seats
6. **Dashboard**: Dashboard and controls
7. **Engine Bay**: Engine compartment
8. **Other**: Additional photos

### Upload Specs
- Format: JPG, PNG, WebP
- Max Size: 5MB per image
- Multiple images per category
- Preview before upload
- Remove uploaded images

---

## Financial Calculator

### Calculation
```
Total Investment = Purchase Price + Reconditioning + Accessories + Other Expenses
Expected Profit = Expected Selling Price - Total Investment
Profit Margin = (Expected Profit / Total Investment) × 100
```

### Color Coding
- Green: Profit margin ≥ 10%
- Orange: Profit margin 5-10%
- Red: Profit margin < 5%

---

## Error Handling

### Network Errors
```typescript
try {
  const response = await api.createVehicleStep1(token, data);
  if (response.success) {
    // Handle success
  } else {
    throw new Error(response.message);
  }
} catch (err) {
  setError(err.message);
}
```

### Validation Errors
```json
{
  "success": false,
  "errors": {
    "brand": ["The brand field is required."],
    "year": ["The year must be between 2000 and 2026."]
  }
}
```

Display field-specific errors below inputs.

---

## Testing

### Manual Testing Checklist

**Step 1**
- [ ] Create new vehicle
- [ ] Verify vehicle_id generated
- [ ] Check draft saved in database
- [ ] Verify required field validation

**Step 2**
- [ ] Update financial info
- [ ] Verify profit calculation
- [ ] Check draft updated

**Step 3**
- [ ] Upload documents
- [ ] Verify file upload
- [ ] Check insurance toggle

**Step 4**
- [ ] Upload featured image
- [ ] Upload categorized images
- [ ] Submit vehicle
- [ ] Verify status changed to pending

**Drafts**
- [ ] View all drafts
- [ ] Load draft
- [ ] Verify form populated
- [ ] Continue editing

---

## Future Enhancements

- [ ] Auto-save on field change
- [ ] Image compression before upload
- [ ] Bulk image upload
- [ ] Video upload support
- [ ] 360° image viewer
- [ ] AI-powered description generator
- [ ] Price suggestion based on market
- [ ] Duplicate vehicle detection
- [ ] Export vehicle data
- [ ] Print vehicle details

---

## Troubleshooting

### Vehicle ID not generated
- Check API response
- Verify token is valid
- Check network connection

### Images not uploading
- Check file size (max 5MB)
- Verify file format (JPG, PNG, WebP)
- Check network connection
- Verify FormData construction

### Draft not loading
- Verify vehicle_id is correct
- Check user permissions
- Verify API endpoint

### Status not changing
- Complete all required fields
- Verify Step 4 submission
- Check API response

---

## Support

For issues or questions:
1. Check API documentation: `VEHICLE_API_INTEGRATION.md`
2. Review error messages
3. Check browser console
4. Contact backend team

---

## Quick Reference

### Routes
- Add Vehicle: `/dealer/add-vehicle`
- Drafts: `/dealer/drafts`
- Dashboard: `/dealer/dashboard`

### API Endpoints
- Step 1: `POST /api/vehicles/step1`
- Step 2: `PUT /api/vehicles/{id}/step2`
- Step 3: `PUT /api/vehicles/{id}/step3`
- Step 4: `PUT /api/vehicles/{id}/step4`
- Get Vehicle: `GET /api/vehicles/{id}`
- Get All: `GET /api/vehicles?status=draft`

### Status Values
- `draft` - Incomplete
- `pending` - Awaiting review
- `under_review` - Being reviewed
- `approved` - Approved by admin
- `live` - Published
