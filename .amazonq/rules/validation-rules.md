# Validation Rules

## Input Validation

### Mobile Number
```typescript
// Pattern: 10 digits starting with 6-9
const validateMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};

// Error messages
- "Mobile number is required"
- "Mobile number must be 10 digits"
- "Mobile number must start with 6-9"
```

### Email
```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Error messages
- "Email is required"
- "Invalid email format"
```

### OTP
```typescript
const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Error messages
- "OTP is required"
- "OTP must be 6 digits"
```

### Price
```typescript
const validatePrice = (price: number): boolean => {
  return price > 0 && price < 100000000;
};

// Error messages
- "Price is required"
- "Price must be greater than 0"
- "Price must be less than 10 crores"
```

### Year
```typescript
const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 2000 && year <= currentYear;
};

// Error messages
- "Year is required"
- "Year must be between 2000 and current year"
```

### Mileage
```typescript
const validateMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage < 1000000;
};

// Error messages
- "Mileage is required"
- "Mileage must be 0 or greater"
- "Mileage seems too high"
```

### Name
```typescript
const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name);
};

// Error messages
- "Name is required"
- "Name must be at least 2 characters"
- "Name must be less than 50 characters"
- "Name can only contain letters and spaces"
```

### Password
```typescript
const validatePassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

// Error messages
- "Password is required"
- "Password must be at least 8 characters"
- "Password must contain uppercase letter"
- "Password must contain lowercase letter"
- "Password must contain number"
```

### URL
```typescript
const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Error messages
- "URL is required"
- "Invalid URL format"
```

### Pincode (India)
```typescript
const validatePincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode);
};

// Error messages
- "Pincode is required"
- "Pincode must be 6 digits"
```

### PAN Card (India)
```typescript
const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

// Error messages
- "PAN is required"
- "Invalid PAN format (e.g., ABCDE1234F)"
```

### Aadhaar (India)
```typescript
const validateAadhaar = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar);
};

// Error messages
- "Aadhaar is required"
- "Aadhaar must be 12 digits"
```

### Vehicle Number (India)
```typescript
const validateVehicleNumber = (number: string): boolean => {
  return /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(number);
};

// Error messages
- "Vehicle number is required"
- "Invalid vehicle number format (e.g., MH12AB1234)"
```

## Form Validation Patterns

### Real-time Validation
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const handleChange = (field: string, value: string) => {
  // Clear error on change
  if (errors[field]) {
    setErrors({ ...errors, [field]: '' });
  }
  
  // Update value
  setFormData({ ...formData, [field]: value });
};

const validateField = (field: string, value: any): string => {
  switch (field) {
    case 'mobile':
      return validateMobile(value) ? '' : 'Invalid mobile number';
    case 'email':
      return validateEmail(value) ? '' : 'Invalid email';
    default:
      return '';
  }
};
```

### Submit Validation
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const newErrors: Record<string, string> = {};
  
  // Validate all fields
  if (!formData.mobile) {
    newErrors.mobile = 'Mobile is required';
  } else if (!validateMobile(formData.mobile)) {
    newErrors.mobile = 'Invalid mobile number';
  }
  
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    newErrors.email = 'Invalid email';
  }
  
  // Check if any errors
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit form
  submitForm(formData);
};
```

### Display Errors
```tsx
<input
  value={formData.mobile}
  onChange={(e) => handleChange('mobile', e.target.value)}
  className={`input-field ${errors.mobile ? 'border-red-500' : ''}`}
/>
{errors.mobile && (
  <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
)}
```

## API Validation

### Request Validation
```typescript
// app/api/resource/route.ts
import { validators, sanitizeObject } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Sanitize
  const data = sanitizeObject(body, ['name', 'mobile', 'email']);
  
  // Validate
  if (!validators.mobile(data.mobile)) {
    return apiError('Invalid mobile number', 400);
  }
  
  if (!validators.email(data.email)) {
    return apiError('Invalid email', 400);
  }
  
  // Process
  return apiResponse(data);
}
```

### Query Parameter Validation
```typescript
const { searchParams } = new URL(request.url);

const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

if (searchParams.get('price')) {
  const price = parseInt(searchParams.get('price') || '0');
  if (!validators.price(price)) {
    return apiError('Invalid price', 400);
  }
}
```

## File Upload Validation

### Image Validation
```typescript
const validateImage = (file: File): string => {
  // Check type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }
  
  // Check size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'Image must be less than 5MB';
  }
  
  return '';
};
```

### Multiple Files
```typescript
const validateFiles = (files: FileList): string => {
  if (files.length === 0) {
    return 'At least one image is required';
  }
  
  if (files.length > 10) {
    return 'Maximum 10 images allowed';
  }
  
  for (let i = 0; i < files.length; i++) {
    const error = validateImage(files[i]);
    if (error) return error;
  }
  
  return '';
};
```

## Custom Validators

### Create Reusable Validator
```typescript
// lib/validators.ts
export const createValidator = (
  pattern: RegExp,
  errorMessage: string
) => {
  return (value: string): string => {
    return pattern.test(value) ? '' : errorMessage;
  };
};

// Usage
const validateGST = createValidator(
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  'Invalid GST number'
);
```

### Async Validator
```typescript
const validateUniqueEmail = async (email: string): Promise<string> => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const data = await response.json();
  return data.exists ? 'Email already registered' : '';
};
```

## Validation Library Integration

### Zod Example
```typescript
import { z } from 'zod';

const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(2000).max(new Date().getFullYear()),
  price: z.number().positive().max(100000000),
  mileage: z.number().nonnegative().max(1000000),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile'),
});

// Validate
const result = carSchema.safeParse(data);
if (!result.success) {
  const errors = result.error.flatten().fieldErrors;
  return apiError('Validation failed', 400);
}
```

## Best Practices

1. **Validate on both client and server**
2. **Show errors immediately** (real-time validation)
3. **Clear errors on input change**
4. **Use consistent error messages**
5. **Sanitize all inputs**
6. **Validate file uploads**
7. **Check data types**
8. **Limit input lengths**
9. **Use regex for patterns**
10. **Test edge cases**
