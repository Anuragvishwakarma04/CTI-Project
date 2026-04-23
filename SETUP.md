# Setup Instructions

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

This is a complete Next.js application for a second-hand car marketplace with the following features:

### User Features
- Mobile-based OTP authentication
- Dual roles: Customer & Dealer
- Browse cars with advanced filters
- View detailed car information
- Follow dealers for notifications
- Purchase services and warranties

### Dealer Features
- Upload car listings with images
- Multi-step car submission form
- Price calculator
- Inspection request
- Manage listings (pending/approved)
- Dedicated showroom page

### Design
- Modern, clean UI inspired by Cars24
- Fully responsive design
- Smooth animations
- Card-based layouts
- Professional color scheme

## Current State

The application is built with:
- **Mock Data**: All data is currently from `lib/mockData.ts`
- **No Backend**: API routes are placeholders
- **No Database**: Using in-memory state management
- **Placeholder Images**: Using Unsplash images

## Next Steps for Production

### 1. Backend Integration

Replace mock data with real API calls:

```typescript
// Example: Fetch cars from API
const response = await fetch('/api/cars');
const { data } = await response.json();
```

### 2. Database Setup

Choose and setup a database:
- PostgreSQL with Prisma
- MongoDB with Mongoose
- Supabase
- Firebase

### 3. Authentication

Implement real OTP authentication:
- Integrate Twilio for SMS
- Or use AWS SNS
- Or use Firebase Auth
- Implement JWT tokens

### 4. Image Upload

Setup cloud storage:
- Cloudinary
- AWS S3
- Firebase Storage

### 5. Payment Integration

For services and warranties:
- Razorpay
- Stripe
- PayPal

### 6. Notifications

Implement real-time notifications:
- Firebase Cloud Messaging
- WebSockets
- Server-Sent Events

## File Structure Explained

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout with Header/Footer
├── cars/
│   ├── page.tsx         # Car listings
│   └── [id]/page.tsx    # Car details
├── dealers/
│   ├── page.tsx         # Dealer listings
│   └── [id]/page.tsx    # Dealer showroom
├── login/page.tsx       # Authentication
├── profile/page.tsx     # User dashboard
├── upload-car/page.tsx  # Car upload form
├── services/page.tsx    # Services page
├── warranty/page.tsx    # Warranty plans
└── api/                 # API routes (placeholders)

components/
├── layout/              # Header, Footer
├── car/                 # CarCard, FilterPanel
└── dealer/              # DealerCard

lib/
├── mockData.ts          # Mock data for development
└── utils.ts             # Helper functions

store/
└── useStore.ts          # Zustand global state

types/
└── index.ts             # TypeScript types
```

## Key Components

### CarCard
Displays car information in a card format with image, price, and specs.

### FilterPanel
Advanced filtering for cars by brand, price, fuel type, etc.

### DealerCard
Shows dealer information with follow functionality.

### Header
Navigation with user menu and notifications.

## State Management

Using Zustand for global state:
- User authentication
- Notifications
- Filters
- Followed dealers

## Styling

Tailwind CSS with custom utilities:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container
- `.input-field` - Form input style

## API Routes Structure

All API routes are in `app/api/`:
- `/api/cars` - Car CRUD operations
- `/api/auth/send-otp` - Send OTP
- `/api/auth/verify-otp` - Verify OTP
- `/api/dealers` - Dealer operations

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

## Testing

To test the application:
1. Run `npm run dev`
2. Navigate to login page
3. Enter any mobile number
4. Click "Send OTP"
5. Enter any 6-digit code
6. Select role (Customer/Dealer)
7. Explore the application

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

## Support

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
