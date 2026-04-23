# Dealers API Integration

## Setup

1. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

2. Ensure Laravel backend is running on port 8000

## API Client

Location: `lib/api/dealers.ts`

### Methods

#### `dealersApi.getAll(filters)`
Fetch all dealers with optional filters.

**Parameters:**
```typescript
{
  search?: string;      // Search by name, showroom, location
  city?: string;        // Filter by city
  sort?: 'rating' | 'total_cars' | 'followers' | 'newest';
  per_page?: number;    // Items per page (default: 15)
  page?: number;        // Page number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    dealers: Dealer[],
    total: number
  },
  pagination: {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number
  }
}
```

#### `dealersApi.getById(id)`
Fetch single dealer details.

**Parameters:**
- `id`: Dealer code (e.g., "DLR001") or customer_id

**Response:**
```typescript
{
  success: true,
  data: {
    dealer: Dealer
  }
}
```

## Usage Examples

### Dealers List Page
```typescript
import { dealersApi } from '@/lib/api/dealers';

const response = await dealersApi.getAll({
  city: 'Mumbai',
  sort: 'rating',
  per_page: 15
});

if (response.success) {
  setDealers(response.data.dealers);
}
```

### Dealer Details Page
```typescript
const response = await dealersApi.getById('DLR001');

if (response.success) {
  setDealer(response.data.dealer);
}
```

### Search Dealers
```typescript
const response = await dealersApi.getAll({
  search: 'motors',
  city: 'Delhi',
  sort: 'total_cars'
});
```

## Updated Components

### `/app/dealers/page.tsx`
- Fetches dealers from API on mount
- Refetches when city or sort changes
- Search functionality with Enter key support
- Loading states
- Empty states

### `/app/dealers/[id]/page.tsx`
- Simplified to pass dealer ID only

### `/app/dealers/[id]/DealerShowroomClient.tsx`
- Fetches dealer data from API
- Loading and error states
- TODO: Integrate with cars API for dealer's cars

## Testing

1. Start Laravel backend:
```bash
cd /path/to/laravel
php artisan serve
```

2. Start Next.js frontend:
```bash
cd /Users/suraj/Documents/node/ctiweb
npm run dev
```

3. Visit:
- http://localhost:3000/dealers - All dealers
- http://localhost:3000/dealers/DLR001 - Specific dealer

## Error Handling

All API calls include try-catch blocks:
```typescript
try {
  const response = await dealersApi.getAll();
  if (response.success) {
    // Handle success
  }
} catch (error) {
  console.error('Error:', error);
  // Show error to user
}
```

## Next Steps

1. Create `.env.local` file with API URL
2. Test dealers list page
3. Test dealer details page
4. Integrate cars API for dealer's vehicles
5. Add follow/unfollow functionality
6. Add contact dealer functionality
