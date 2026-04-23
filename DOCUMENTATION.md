# CarTrade - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Components](#components)
8. [State Management](#state-management)
9. [Authentication](#authentication)
10. [Deployment](#deployment)

---

## Overview

CarTrade is a modern, secure second-hand car marketplace built with Next.js 14. It connects car buyers with verified dealers, offering features like car listings, dealer showrooms, services, and warranty plans.

**Live Demo:** [Your URL]  
**Repository:** [GitHub URL]

---

## Features

### Core Features
- 🔐 **Mobile OTP Authentication** - Secure login with OTP
- 🚗 **Car Listings** - Browse with advanced filters
- 🏪 **Dealer Showrooms** - Dedicated dealer pages
- ❤️ **Favorites** - Save cars for later
- 🔔 **Notifications** - Real-time updates
- 📊 **Dashboard** - User profile with analytics
- 🛡️ **Warranty Plans** - Extended warranty options
- 🔧 **Services** - RC transfer, inspection, etc.
- 📱 **Responsive Design** - Mobile-first approach

### Security Features
- JWT authentication with httpOnly cookies
- Rate limiting (100 req/15min)
- Input validation & sanitization
- XSS & SQL injection protection
- CORS configuration
- Security headers (OWASP compliant)

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB/PostgreSQL** - Database
- **Redis** - Caching & rate limiting
- **Jose** - JWT authentication

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD

---

## Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
MongoDB or PostgreSQL
Redis (optional, for rate limiting)
```

### Installation

1. **Clone repository**
```bash
git clone <repo-url>
cd ctiweb
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

### Docker Setup
```bash
npm run docker:run
```

---

## Project Structure

```
ctiweb/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── cars/                 # Car CRUD operations
│   │   └── dealers/              # Dealer operations
│   ├── cars/                     # Car pages
│   │   ├── [id]/                 # Car detail page
│   │   └── page.tsx              # Car listing page
│   ├── dealers/                  # Dealer pages
│   ├── login/                    # Login page
│   ├── profile/                  # User dashboard
│   ├── services/                 # Services page
│   ├── warranty/                 # Warranty page
│   ├── upload-car/               # Car upload form
│   ├── notifications/            # Notifications page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── auth/                     # Auth components
│   ├── car/                      # Car components
│   │   ├── CarCard.tsx           # Car card component
│   │   └── FilterPanel.tsx       # Filter sidebar
│   ├── dealer/                   # Dealer components
│   │   └── DealerCard.tsx        # Dealer card
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Footer
│   └── ui/                       # Reusable UI components
│
├── lib/                          # Utilities
│   ├── auth.ts                   # Authentication utilities
│   ├── api-utils.ts              # API helpers
│   ├── db.ts                     # Database config
│   ├── utils.ts                  # Helper functions
│   └── mockData.ts               # Mock data
│
├── store/                        # State management
│   └── useStore.ts               # Zustand store
│
├── types/                        # TypeScript types
│   └── index.ts                  # Type definitions
│
├── .amazonq/rules/               # Development rules
├── middleware.ts                 # Next.js middleware
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── Dockerfile                    # Docker config
├── docker-compose.yml            # Docker Compose
└── package.json                  # Dependencies
```

---

## API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

### Authentication

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456",
  "role": "customer"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
```

### Cars

#### List Cars
```http
GET /api/cars?page=1&limit=10&brand=Maruti&minPrice=100000&maxPrice=500000

Response:
{
  "success": true,
  "data": {
    "cars": [...],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Car Details
```http
GET /api/cars/:id

Response:
{
  "success": true,
  "data": { car object }
}
```

#### Create Car (Dealer only)
```http
POST /api/cars
Authorization: Bearer {token}
Content-Type: application/json

{
  "brand": "Maruti",
  "model": "Swift",
  "year": 2020,
  "price": 450000,
  "mileage": 25000,
  "fuelType": "Petrol",
  "transmission": "Manual",
  "owners": 1,
  "location": "Mumbai",
  "description": "Well maintained car",
  "features": ["ABS", "Airbags"],
  "images": ["url1", "url2"]
}

Response:
{
  "success": true,
  "data": { car object }
}
```

#### Update Car
```http
PUT /api/cars/:id
Authorization: Bearer {token}

{
  "price": 440000,
  "description": "Updated description"
}
```

#### Delete Car
```http
DELETE /api/cars/:id
Authorization: Bearer {token}

Response:
{
  "success": true
}
```

### Dealers

#### List Dealers
```http
GET /api/dealers

Response:
{
  "success": true,
  "data": { dealers: [...] }
}
```

#### Follow Dealer
```http
POST /api/dealers/:id/follow
Authorization: Bearer {token}
```

---

## Components

### CarCard
**Location:** `components/car/CarCard.tsx`

```tsx
import CarCard from '@/components/car/CarCard';

<CarCard car={carObject} />
```

**Props:**
- `car: Car` - Car object

**Features:**
- Image display
- Price, year, mileage
- Like button
- Click to view details

### FilterPanel
**Location:** `components/car/FilterPanel.tsx`

```tsx
import FilterPanel from '@/components/car/FilterPanel';

<FilterPanel 
  onFilterChange={(filters) => console.log(filters)}
  onClose={() => setShowFilters(false)}
/>
```

**Props:**
- `onFilterChange: (filters: FilterOptions) => void`
- `onClose?: () => void`

### DealerCard
**Location:** `components/dealer/DealerCard.tsx`

```tsx
import DealerCard from '@/components/dealer/DealerCard';

<DealerCard dealer={dealerObject} />
```

---

## State Management

### Zustand Store
**Location:** `store/useStore.ts`

```tsx
import { useStore } from '@/store/useStore';

function Component() {
  const { user, setUser, notifications } = useStore();
  
  // Use state
  console.log(user);
  
  // Update state
  setUser(newUser);
}
```

**Available State:**
- `user: User | null` - Current user
- `notifications: Notification[]` - User notifications
- `filters: FilterOptions` - Active filters

**Available Actions:**
- `setUser(user)` - Set current user
- `addNotification(notification)` - Add notification
- `markNotificationRead(id)` - Mark as read
- `setFilters(filters)` - Update filters
- `followDealer(dealerId)` - Follow dealer
- `unfollowDealer(dealerId)` - Unfollow dealer

---

## Authentication

### Login Flow
1. User enters mobile number
2. System sends OTP
3. User enters OTP
4. System verifies and creates session
5. JWT token stored in httpOnly cookie
6. User redirected to homepage

### Protected Routes
Routes requiring authentication:
- `/profile`
- `/upload-car`
- `/notifications`

### Middleware
**Location:** `middleware.ts`

Automatically protects routes and adds security headers.

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Docker
```bash
npm run docker:build
npm run docker:run
```

### Manual Deployment
```bash
npm run build
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Environment Variables

Required variables:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Security
JWT_SECRET=your-secret-key-min-32-chars

# Database
MONGODB_URI=mongodb://localhost:27017/cartrade

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OTP Provider
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token

# Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

# Payment
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run docker:build # Build Docker image
npm run docker:run   # Run with Docker Compose
npm run docker:stop  # Stop Docker containers
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- API Response: < 200ms

---

## Security

- OWASP Top 10 compliant
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- SQL injection prevention
- HTTPS enforced

See [SECURITY.md](./SECURITY.md) for details.

---

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## License

MIT License - See LICENSE file

---

## Support

- Documentation: [Link]
- Issues: [GitHub Issues]
- Email: support@cartrade.com

---

## Changelog

### v1.0.0 (2024)
- Initial release
- Mobile OTP authentication
- Car listings with filters
- Dealer showrooms
- User dashboard
- Services & warranty
- Docker support
- Security implementation
