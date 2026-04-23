# Car Trust India - Second Hand Car Marketplace

A modern Next.js application for buying and selling second-hand cars with dealer management, services, and warranty purchases.

## Features

### Core Features
- **Mobile-based Authentication** - Login using mobile OTP
- **Dual User Roles** - Customer and Dealer accounts
- **Car Listings** - Browse cars with advanced filters
- **Car Details** - Comprehensive car information with image gallery
- **Upload Cars** - Multi-step form for dealers to list cars
- **Inspection & Price Calculator** - Built-in tools for car valuation
- **Approval Workflow** - Admin approval system for listings
- **Dealer Showrooms** - Dedicated pages for each dealer
- **Follow Dealers** - Get notifications when dealers add new cars
- **Services** - Purchase inspection, RC transfer, and other services
- **Warranty Plans** - Extended warranty options

### Technical Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for modern styling
- Zustand for state management
- Responsive design
- Image optimization with Next.js Image
- Component-based architecture

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ctiweb/
├── app/                      # Next.js app router pages
│   ├── cars/                # Car listings and details
│   ├── dealers/             # Dealer listings and showrooms
│   ├── login/               # Authentication
│   ├── profile/             # User dashboard
│   ├── services/            # Services page
│   ├── warranty/            # Warranty plans
│   └── upload-car/          # Car upload form
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── car/                # Car-related components
│   ├── dealer/             # Dealer components
│   ├── layout/             # Layout components (Header, Footer)
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
│   ├── mockData.ts         # Mock data for development
│   └── utils.ts            # Helper functions
├── store/                  # Zustand state management
│   └── useStore.ts         # Global store
├── types/                  # TypeScript type definitions
│   └── index.ts            # Type definitions
└── public/                 # Static assets

```

## Key Pages

- **/** - Homepage with hero section and featured cars
- **/cars** - Browse all cars with filters
- **/cars/[id]** - Individual car details
- **/dealers** - List of verified dealers
- **/dealers/[id]** - Dealer showroom with their cars
- **/login** - Mobile-based authentication
- **/profile** - User dashboard
- **/upload-car** - Multi-step car upload form
- **/services** - Available services
- **/warranty** - Warranty plans

## API Integration

The application is built with mock data. To integrate with your backend:

1. Replace mock data in `lib/mockData.ts` with API calls
2. Update API endpoints in respective page components
3. Add authentication token management
4. Implement real-time notifications

### Example API Structure

```typescript
// GET /api/cars - Get all cars
// GET /api/cars/:id - Get car details
// POST /api/cars - Create new car listing
// PUT /api/cars/:id - Update car listing
// DELETE /api/cars/:id - Delete car listing

// GET /api/dealers - Get all dealers
// GET /api/dealers/:id - Get dealer details
// POST /api/dealers/:id/follow - Follow dealer

// POST /api/auth/send-otp - Send OTP
// POST /api/auth/verify-otp - Verify OTP and login

// GET /api/services - Get all services
// POST /api/services/book - Book a service

// GET /api/warranties - Get warranty plans
// POST /api/warranties/purchase - Purchase warranty
```

## Customization

### Colors
Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Images
Replace placeholder images from Unsplash with your own images in:
- `lib/utils.ts` - getCarImage function
- `lib/mockData.ts` - Mock data images

### Features
Add new features by:
1. Creating new components in `components/`
2. Adding new pages in `app/`
3. Updating types in `types/index.ts`
4. Adding state management in `store/useStore.ts`

## Build for Production

```bash
npm run build
npm start
```

## Design Reference

The design is inspired by Cars24 with modern improvements:
- Clean and minimal interface
- Card-based layouts
- Smooth animations
- Mobile-first responsive design
- Intuitive navigation
- Clear call-to-actions

## Future Enhancements

- Real-time chat between buyers and dealers
- Advanced search with AI recommendations
- Virtual car tours (360° images)
- Loan calculator and EMI options
- Compare cars feature
- Saved searches and alerts
- Review and rating system
- Admin dashboard for approvals
- Analytics and insights for dealers

## License

This project is created for demonstration purposes.
