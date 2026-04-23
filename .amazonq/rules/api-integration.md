# API Integration Guidelines

## API Structure

### Response Format
```typescript
{
  success: boolean;
  data: any;
  message: string;
}
```

### Error Format
```typescript
{
  success: false;
  error: string;
  message: string;
}
```

## API Endpoints

### Authentication
```
POST /api/auth/send-otp
Body: { mobile: string }

POST /api/auth/verify-otp
Body: { mobile: string, otp: string, role: 'customer' | 'dealer' }
Response: { user, token }
```

### Cars
```
GET /api/cars?brand=&minPrice=&maxPrice=&fuelType=&transmission=
Response: { cars: Car[] }

GET /api/cars/:id
Response: { car: Car }

POST /api/cars
Body: Car data
Response: { car: Car }

PUT /api/cars/:id
Body: Partial<Car>
Response: { car: Car }

DELETE /api/cars/:id
Response: { success: true }
```

### Dealers
```
GET /api/dealers
Response: { dealers: Dealer[] }

GET /api/dealers/:id
Response: { dealer: Dealer }

POST /api/dealers/:id/follow
Response: { success: true }

POST /api/dealers/:id/unfollow
Response: { success: true }
```

### Services
```
GET /api/services
Response: { services: Service[] }

POST /api/services/book
Body: { serviceId, carId, date }
Response: { booking: Booking }
```

### Warranties
```
GET /api/warranties
Response: { warranties: Warranty[] }

POST /api/warranties/purchase
Body: { warrantyId, carId }
Response: { purchase: Purchase }
```

### Notifications
```
GET /api/notifications
Response: { notifications: Notification[] }

PUT /api/notifications/:id/read
Response: { success: true }
```

## Making API Calls

### Fetch Example
```typescript
const response = await fetch('/api/cars', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const { success, data, message } = await response.json();
```

### POST Example
```typescript
const response = await fetch('/api/cars', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(carData),
});

const { success, data, message } = await response.json();
```

## Error Handling
```typescript
try {
  const response = await fetch('/api/cars');
  if (!response.ok) throw new Error('Failed to fetch');
  const { data } = await response.json();
  return data;
} catch (error) {
  console.error('Error:', error);
  // Show error to user
}
```

## API Validation Errors
When API returns validation errors in format:
```json
{
  "success": false,
  "errors": {
    "email": ["The email has already been taken."],
    "phone": ["Invalid phone number"]
  }
}
```

Handle them like this:
```typescript
if (response.errors) {
  // Set field-specific errors
  const fieldErrors: any = {};
  Object.keys(response.errors).forEach(key => {
    fieldErrors[key] = response.errors[key][0]; // Get first error
  });
  setErrors(fieldErrors);
  
  // Show general error with all messages
  const errorMessages = Object.values(response.errors).flat().join(', ');
  setErrors(prev => ({ ...prev, general: errorMessages }));
}
```

Display field errors:
```tsx
<input
  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
/>
{errors.email && (
  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
)}
```

## Authentication Token
Store JWT token in:
- localStorage (client-side)
- httpOnly cookie (server-side)

```typescript
// Save token
localStorage.setItem('token', token);

// Get token
const token = localStorage.getItem('token');

// Remove token
localStorage.removeItem('token');
```

## Image Upload
```typescript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { url } = await response.json();
```

## Replacing Mock Data

### Before (Mock)
```typescript
import { mockCars } from '@/lib/mockData';
const cars = mockCars;
```

### After (API)
```typescript
const response = await fetch('/api/cars');
const { data: cars } = await response.json();
```

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Usage:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const response = await fetch(`${API_URL}/api/cars`);
```

## Backend API Base URL
All API calls should use the base URL from environment variable:
- Development: `http://127.0.0.1:8000`
- Production: Set in `.env.local` or deployment environment

```typescript
// In lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = {
  async sendOTP(phone: string, type: 'customer' | 'dealer') {
    const res = await fetch(`${API_BASE_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, type }),
    });
    return res.json();
  },
};


## Loading States
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/cars');
    const { data } = await response.json();
    setCars(data);
  } finally {
    setLoading(false);
  }
};
```

## Pagination
```
GET /api/cars?page=1&limit=10
Response: { cars: Car[], total: number, page: number }
```
