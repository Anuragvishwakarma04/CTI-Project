# Add Vehicle API Documentation

## API Endpoint
```
POST /api/vehicles
```

## Headers
```json
{
  "Content-Type": "multipart/form-data",
  "Accept": "application/json",
  "Authorization": "Bearer {token}"
}
```

## Request Body (Form Data)

### Step 1: Vehicle Details

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `brand` | string | Yes | Vehicle manufacturer/brand | "Maruti Suzuki" |
| `model` | string | Yes | Vehicle model name | "Swift" |
| `variant` | string | No | Specific variant of the model | "VXi" |
| `year` | integer | Yes | Manufacturing year | 2020 |
| `registration_number` | string | Yes | Vehicle registration number (auto-uppercase) | "MH12AB1234" |
| `fuel_type` | string | Yes | Type of fuel | "Petrol", "Diesel", "CNG", "Electric", "Hybrid" |
| `transmission` | string | Yes | Transmission type | "Manual", "Automatic", "AMT", "CVT", "DCT" |
| `kilometers` | integer | Yes | Kilometers driven | 50000 |
| `ownership` | string | Yes | Ownership status | "1st Owner", "2nd Owner", "3rd Owner", "4th Owner" |
| `color` | string | No | Vehicle color | "White", "Black", "Silver" |
| `body_type` | string | Yes | Body type of vehicle | "Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Convertible" |
| `engine_number` | string | No | Engine number (auto-uppercase) | "ABC123456" |
| `chassis_number` | string | No | Chassis/VIN number (auto-uppercase) | "MA3ERLF3S00123456" |

### Step 2: Financial Information

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `purchase_price` | decimal | Yes | Price at which vehicle was purchased | 500000 |
| `reconditioning_cost` | decimal | No | Cost spent on reconditioning | 25000 |
| `accessories_cost` | decimal | No | Cost of added accessories | 15000 |
| `other_expenses` | decimal | No | Any other expenses | 10000 |
| `expected_selling_price` | decimal | Yes | Expected selling price | 600000 |
| `minimum_selling_price` | decimal | No | Minimum acceptable selling price | 550000 |

**Auto-Calculated Fields (Frontend):**
- `total_cost` = purchase_price + reconditioning_cost + accessories_cost + other_expenses
- `expected_profit` = expected_selling_price - total_cost
- `profit_margin` = (expected_profit / total_cost) × 100

### Step 3: Documentation

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `has_insurance` | boolean | Yes | Whether vehicle has valid insurance | true/false |
| `insurance_expiry` | date | Conditional | Insurance expiry date (required if has_insurance = true) | "2025-12-31" |
| `rc_document` | file | No | Registration Certificate (PDF/JPG/PNG, Max 5MB) | File upload |
| `insurance_document` | file | Conditional | Insurance copy (required if has_insurance = true) | File upload |

### Step 4: Media & Listing

#### Images (Categorized)

| Field | Type | Required | Description | Max Files |
|-------|------|----------|-------------|-----------|
| `featured_image` | file | Yes | Main display image for listings | 1 |
| `front_images[]` | file[] | No | Front view photos | Multiple |
| `rear_images[]` | file[] | No | Rear view photos | Multiple |
| `side_images[]` | file[] | No | Side view photos | Multiple |
| `interior_images[]` | file[] | No | Interior photos | Multiple |
| `dashboard_images[]` | file[] | No | Dashboard photos | Multiple |
| `engine_images[]` | file[] | No | Engine bay photos | Multiple |
| `other_images[]` | file[] | No | Additional photos | Multiple |

**Image Requirements:**
- Format: JPG, JPEG, PNG
- Max size per image: 5MB
- Recommended resolution: 1920x1080 or higher

#### Other Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `description` | text | No | Detailed vehicle description | "Well maintained car with full service history..." |
| `features` | array | No | Selected features | ["ABS", "Airbags", "Sunroof", "Leather Seats"] |
| `status` | string | Yes | Vehicle availability status | "available", "reserved" |
| `network_visible` | boolean | Yes | Whether visible to other dealers | true/false |

## Complete Request Example

```javascript
const formData = new FormData();

// Step 1: Vehicle Details
formData.append('brand', 'Maruti Suzuki');
formData.append('model', 'Swift');
formData.append('variant', 'VXi');
formData.append('year', '2020');
formData.append('registration_number', 'MH12AB1234');
formData.append('fuel_type', 'Petrol');
formData.append('transmission', 'Manual');
formData.append('kilometers', '50000');
formData.append('ownership', '1st Owner');
formData.append('color', 'White');
formData.append('body_type', 'Hatchback');
formData.append('engine_number', 'ABC123456');
formData.append('chassis_number', 'MA3ERLF3S00123456');

// Step 2: Financial Information
formData.append('purchase_price', '500000');
formData.append('reconditioning_cost', '25000');
formData.append('accessories_cost', '15000');
formData.append('other_expenses', '10000');
formData.append('expected_selling_price', '600000');
formData.append('minimum_selling_price', '550000');

// Step 3: Documentation
formData.append('has_insurance', 'true');
formData.append('insurance_expiry', '2025-12-31');
formData.append('rc_document', rcFile); // File object
formData.append('insurance_document', insuranceFile); // File object

// Step 4: Media & Listing
formData.append('featured_image', featuredImageFile); // File object
formData.append('front_images[]', frontImage1); // File object
formData.append('front_images[]', frontImage2); // File object
formData.append('rear_images[]', rearImage1); // File object
formData.append('side_images[]', sideImage1); // File object
formData.append('interior_images[]', interiorImage1); // File object
formData.append('dashboard_images[]', dashboardImage1); // File object
formData.append('engine_images[]', engineImage1); // File object
formData.append('other_images[]', otherImage1); // File object

formData.append('description', 'Well maintained car with full service history...');
formData.append('features[]', 'ABS');
formData.append('features[]', 'Airbags');
formData.append('features[]', 'Sunroof');
formData.append('status', 'available');
formData.append('network_visible', 'true');

// API Call
const response = await fetch('http://3.7.31.197/api/vehicles', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    // Note: Don't set Content-Type for FormData, browser sets it automatically
  },
  body: formData
});

const result = await response.json();
```

## Expected Response

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Vehicle added successfully",
  "data": {
    "id": 123,
    "brand": "Maruti Suzuki",
    "model": "Swift",
    "variant": "VXi",
    "year": 2020,
    "registration_number": "MH12AB1234",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "kilometers": 50000,
    "ownership": "1st Owner",
    "color": "White",
    "body_type": "Hatchback",
    "purchase_price": 500000,
    "expected_selling_price": 600000,
    "status": "available",
    "featured_image_url": "https://example.com/images/featured.jpg",
    "created_at": "2024-12-03T10:30:00Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "brand": ["The brand field is required."],
    "registration_number": ["The registration number has already been taken."],
    "featured_image": ["The featured image must be an image file."]
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Unauthenticated",
  "error": "Token is invalid or expired"
}
```

## Validation Rules

### Required Fields
- brand
- model
- year
- registration_number
- fuel_type
- transmission
- kilometers
- ownership
- body_type
- purchase_price
- expected_selling_price
- has_insurance
- featured_image
- status
- network_visible

### Conditional Required Fields
- `insurance_expiry`: Required when `has_insurance = true`
- `insurance_document`: Required when `has_insurance = true`

### Field Constraints
- `year`: Between 2000 and current year
- `kilometers`: Minimum 0, Maximum 1000000
- `purchase_price`: Minimum 0
- `expected_selling_price`: Minimum 0
- `registration_number`: Unique, alphanumeric
- `featured_image`: Image file (jpg, jpeg, png), max 5MB
- All image arrays: Image files (jpg, jpeg, png), max 5MB per file
- `rc_document`: PDF/Image file, max 5MB
- `insurance_document`: PDF/Image file, max 5MB

## Business Logic Notes

1. **Profit Calculation**: Frontend calculates and displays profit margin to help dealers make informed pricing decisions
2. **Image Categories**: Organized image uploads ensure comprehensive vehicle documentation
3. **Insurance Validation**: System only requires insurance details if vehicle has valid insurance
4. **Status Management**: Vehicles can be marked as "available" or "reserved"
5. **Network Visibility**: Dealers can choose to share listings with other dealers in the network
6. **Auto-uppercase**: Registration number, engine number, and chassis number are automatically converted to uppercase

## Frontend Implementation Notes

### Form Submission Code
```javascript
const handleSubmit = async () => {
  const formData = new FormData();
  
  // Add all text fields
  Object.keys(formData).forEach(key => {
    if (key !== 'images' && formData[key]) {
      formData.append(key, formData[key]);
    }
  });
  
  // Add featured image
  if (formData.images.featured) {
    formData.append('featured_image', formData.images.featured);
  }
  
  // Add categorized images
  ['front', 'rear', 'side', 'interior', 'dashboard', 'engine', 'other'].forEach(category => {
    formData.images[category].forEach(file => {
      formData.append(`${category}_images[]`, file);
    });
  });
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://3.7.31.197/api/vehicles', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Success - redirect to dashboard
      router.push('/dealer/dashboard');
    } else {
      // Handle validation errors
      setErrors(result.errors);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
```

## Database Schema Suggestion

```sql
CREATE TABLE vehicles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  dealer_id BIGINT NOT NULL,
  
  -- Vehicle Details
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  variant VARCHAR(100),
  year INT NOT NULL,
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  transmission VARCHAR(20) NOT NULL,
  kilometers INT NOT NULL,
  ownership VARCHAR(20) NOT NULL,
  color VARCHAR(50),
  body_type VARCHAR(50) NOT NULL,
  engine_number VARCHAR(50),
  chassis_number VARCHAR(50),
  
  -- Financial
  purchase_price DECIMAL(10,2) NOT NULL,
  reconditioning_cost DECIMAL(10,2) DEFAULT 0,
  accessories_cost DECIMAL(10,2) DEFAULT 0,
  other_expenses DECIMAL(10,2) DEFAULT 0,
  expected_selling_price DECIMAL(10,2) NOT NULL,
  minimum_selling_price DECIMAL(10,2),
  
  -- Documentation
  has_insurance BOOLEAN NOT NULL DEFAULT true,
  insurance_expiry DATE,
  rc_document_url VARCHAR(255),
  insurance_document_url VARCHAR(255),
  
  -- Media
  featured_image_url VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Inventory
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  network_visible BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dealer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  category VARCHAR(20) NOT NULL, -- front, rear, side, interior, dashboard, engine, other
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_features (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  feature VARCHAR(100) NOT NULL,
  
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
```

## Testing Checklist

- [ ] Test with all required fields
- [ ] Test with missing required fields (should return validation errors)
- [ ] Test with invalid file types
- [ ] Test with files exceeding size limit
- [ ] Test with duplicate registration number
- [ ] Test insurance = false (should not require insurance_expiry)
- [ ] Test insurance = true (should require insurance_expiry)
- [ ] Test with multiple images in each category
- [ ] Test with unauthorized token
- [ ] Test with expired token
- [ ] Test profit margin calculations
- [ ] Test auto-uppercase for registration/engine/chassis numbers
