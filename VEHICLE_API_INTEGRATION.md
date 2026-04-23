# Vehicle Listing API - Complete Integration Guide

## Overview
Multi-step vehicle listing system with draft management. Vehicles progress through: **draft → pending → under_review → approved → live**

## Base URL
```
http://127.0.0.1:8000
```

## Authentication
All endpoints require Bearer token:
```
Authorization: Bearer {token}
```

---

## Step 1: Vehicle Details (Creates Draft)

### Endpoint
```
POST /api/vehicles/step1
```

### Request Body
```json
{
  "brand": "Maruti Suzuki",
  "model": "Swift",
  "variant": "VXi",
  "year": 2020,
  "registration_number": "MH12AB1234",
  "fuel_type": "petrol",
  "transmission": "manual",
  "kilometers": 50000,
  "ownership": "1st owner",
  "color": "White",
  "body_type": "hatchback"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Step 1 completed - Vehicle details saved",
  "vehicle_id": "ABC-20260204-5678",
  "data": {
    "id": 1,
    "vehicle_id": "ABC-20260204-5678",
    "brand": "Maruti Suzuki",
    "model": "Swift",
    "year": 2020,
    "status": "draft"
  }
}
```

---

## Step 2: Financial Information

### Endpoint
```
PUT /api/vehicles/{vehicle_id}/step2
```

### Request Body
```json
{
  "purchase_price": 500000,
  "reconditioning_cost": 25000,
  "accessories_cost": 15000,
  "other_expenses": 10000,
  "expected_selling_price": 600000,
  "minimum_selling_price": 550000
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Step 2 completed - Financial information saved",
  "vehicle_id": "ABC-20260204-5678",
  "data": {
    "id": 1,
    "vehicle_id": "ABC-20260204-5678",
    "purchase_price": 500000,
    "expected_selling_price": 600000,
    "status": "draft"
  }
}
```

---

## Step 3: Legal & Documents

### Endpoint
```
PUT /api/vehicles/{vehicle_id}/step3
```

### Content-Type
```
multipart/form-data
```

### Form Fields
```
engine_number: ABC123456
chassis_number: MA3ERLF3S00123456
has_insurance: true
insurance_expiry: 2025-12-31
rc_document: [file]
insurance_document: [file]
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Step 3 completed - Legal & documents saved",
  "vehicle_id": "ABC-20260204-5678",
  "data": {
    "id": 1,
    "vehicle_id": "ABC-20260204-5678",
    "engine_number": "ABC123456",
    "chassis_number": "MA3ERLF3S00123456",
    "has_insurance": true,
    "status": "draft"
  }
}
```

---

## Step 4: Media & Listing (Final - Changes to Pending)

### Endpoint
```
PUT /api/vehicles/{vehicle_id}/step4
```

### Content-Type
```
multipart/form-data
```

### Form Fields
```
featured_image: [file]
front_images[]: [file, file, ...]
rear_images[]: [file, file, ...]
side_images[]: [file, file, ...]
interior_images[]: [file, file, ...]
dashboard_images[]: [file, file, ...]
engine_images[]: [file, file, ...]
other_images[]: [file, file, ...]
description: "Well maintained car with full service history"
features[]: ["ABS", "Airbags", "Sunroof", "Leather Seats"]
status: "available"
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Step 4 completed - Listing submitted for review",
  "vehicle_id": "ABC-20260204-5678",
  "data": {
    "id": 1,
    "vehicle_id": "ABC-20260204-5678",
    "brand": "Maruti Suzuki",
    "model": "Swift",
    "featured_image_url": "https://example.com/storage/vehicles/featured/abc123.jpg",
    "status": "pending"
  }
}
```

---

## Get Vehicle Details

### Endpoint
```
GET /api/vehicles/{vehicle_id}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicle_id": "ABC-20260204-5678",
    "brand": "Maruti Suzuki",
    "model": "Swift",
    "variant": "VXi",
    "year": 2020,
    "registration_number": "MH12AB1234",
    "fuel_type": "petrol",
    "transmission": "manual",
    "kilometers": 50000,
    "ownership": "1st owner",
    "color": "White",
    "body_type": "hatchback",
    "engine_number": "ABC123456",
    "chassis_number": "MA3ERLF3S00123456",
    "purchase_price": 500000,
    "reconditioning_cost": 25000,
    "accessories_cost": 15000,
    "other_expenses": 10000,
    "expected_selling_price": 600000,
    "minimum_selling_price": 550000,
    "has_insurance": true,
    "insurance_expiry": "2025-12-31",
    "featured_image_url": "https://example.com/storage/vehicles/featured/abc123.jpg",
    "description": "Well maintained car with full service history",
    "status": "pending",
    "images": {
      "front": [
        {"id": 1, "image_url": "https://example.com/storage/vehicles/front/img1.jpg"},
        {"id": 2, "image_url": "https://example.com/storage/vehicles/front/img2.jpg"}
      ],
      "rear": [...],
      "side": [...],
      "interior": [...],
      "dashboard": [...],
      "engine": [...],
      "other": [...]
    },
    "features": ["ABS", "Airbags", "Sunroof", "Leather Seats"]
  }
}
```

---

## Get All Vehicles (Dealer's Vehicles)

### Endpoint
```
GET /api/vehicles?status={status}
```

### Query Parameters
- `status` (optional): Filter by status (draft, pending, under_review, approved, live)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vehicle_id": "ABC-20260204-5678",
      "brand": "Maruti Suzuki",
      "model": "Swift",
      "year": 2020,
      "status": "draft",
      "created_at": "2026-02-04T10:30:00Z",
      "updated_at": "2026-02-04T11:45:00Z"
    }
  ]
}
```

---

## Status Flow

```
draft → pending → under_review → approved → live
```

| Status | Description |
|--------|-------------|
| `draft` | Initial creation (Step 1) |
| `pending` | Submitted for review (After Step 4) |
| `under_review` | Admin reviewing |
| `approved` | Admin approved |
| `live` | Published on platform |

---

## Vehicle ID Format

```
ABC-20260204-5678
```

- **ABC**: Random 3 alphanumeric characters
- **20260204**: Date (YYYYMMDD)
- **5678**: Random 4-digit number

---

## Frontend Integration

### lib/api.ts
```typescript
// Step 1: Create vehicle draft
async createVehicleStep1(token: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/step1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Step 2: Update financial info
async updateVehicleStep2(token: string, vehicleId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/step2`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Step 3: Update legal & documents
async updateVehicleStep3(token: string, vehicleId: string, formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/step3`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

// Step 4: Upload media and finalize
async updateVehicleStep4(token: string, vehicleId: string, formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/step4`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

// Get vehicle details
async getVehicle(token: string, vehicleId: string) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

// Get all vehicles
async getVehicles(token: string, status?: string) {
  const url = status 
    ? `${API_BASE_URL}/api/vehicles?status=${status}`
    : `${API_BASE_URL}/api/vehicles`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}
```

---

## Error Handling

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

### General Errors
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

## Key Features

✅ Multi-step form with draft saving  
✅ Auto-generated unique vehicle_id  
✅ Status tracking (draft → pending → approved → live)  
✅ Categorized image uploads  
✅ Feature tracking  
✅ Document management  
✅ Financial information tracking  
✅ Resume editing from drafts  

---

## Testing with cURL

### Step 1
```bash
curl -X POST http://localhost:8000/api/vehicles/step1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"brand":"Maruti Suzuki","model":"Swift","year":2020,"registration_number":"MH12AB1234","fuel_type":"petrol","transmission":"manual","kilometers":50000,"ownership":"1st owner","body_type":"hatchback"}'
```

### Step 2
```bash
curl -X PUT http://localhost:8000/api/vehicles/ABC-20260204-5678/step2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"purchase_price":500000,"expected_selling_price":600000}'
```

### Get Drafts
```bash
curl -X GET http://localhost:8000/api/vehicles?status=draft \
  -H "Authorization: Bearer {token}"
```
