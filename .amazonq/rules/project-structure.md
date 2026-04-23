# CarTrade Project Rules

## Project Structure

### Directory Organization
```
ctiweb/
├── app/                      # Next.js App Router pages
│   ├── cars/                # Car listings and details
│   ├── dealers/             # Dealer listings and showrooms
│   ├── login/               # Authentication
│   ├── profile/             # User dashboard
│   ├── services/            # Services page
│   ├── warranty/            # Warranty plans
│   ├── upload-car/          # Car upload form
│   ├── notifications/       # Notifications page
│   └── api/                 # API routes
├── components/              # React components
│   ├── layout/             # Header, Footer
│   ├── car/                # CarCard, FilterPanel
│   ├── dealer/             # DealerCard
│   ├── auth/               # Auth components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
│   ├── mockData.ts         # Mock data
│   └── utils.ts            # Helper functions
├── store/                  # Zustand state management
│   └── useStore.ts         # Global store
├── types/                  # TypeScript definitions
│   └── index.ts            # All type definitions
└── public/                 # Static assets
```

## Coding Standards

### Component Structure
- Use 'use client' for client components
- Keep components in appropriate directories
- Export default for page components
- Use named exports for utility components

### State Management
- Use Zustand store in `store/useStore.ts`
- Global state: user, notifications, filters
- Actions: setUser, followDealer, unfollowDealer, etc.

### Styling
- Use Tailwind CSS utility classes
- Custom utilities: `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`
- Responsive: mobile-first approach
- Colors: primary-* scale for brand colors

### TypeScript
- All types in `types/index.ts`
- Main types: User, Dealer, Car, Service, Warranty, Notification
- Use proper typing for all props and functions

### API Routes
- Location: `app/api/[resource]/route.ts`
- Return NextResponse.json()
- Structure: { success, data, message }
- Use proper HTTP methods: GET, POST, PUT, DELETE

### Images
- Use Next.js Image component
- Unsplash for placeholder images
- Optimize with fill and object-cover

## File Naming
- Pages: `page.tsx`
- Components: PascalCase (e.g., `CarCard.tsx`)
- Utils: camelCase (e.g., `utils.ts`)
- Types: `index.ts` in types folder

## Key Features

### Authentication
- Mobile-based OTP login
- Dual roles: Customer/Dealer
- Store user in Zustand

### Car Management
- Browse with filters
- Upload multi-step form
- Approval workflow (pending → approved)
- Price calculator
- Inspection request

### Dealer Features
- Showroom pages
- Follow/Unfollow system
- Notifications for new cars

### Services & Warranty
- Service booking
- Warranty purchase
- Pricing display

## Mock Data
- Location: `lib/mockData.ts`
- Replace with API calls for production
- Current: mockCars, mockDealers, mockServices, mockWarranties

## Future Enhancements
- Real-time chat
- AI recommendations
- 360° car tours
- Loan calculator
- Compare cars
- Review system
- Admin dashboard

## Development Guidelines
- Keep code minimal and clean
- Use existing components when possible
- Follow established patterns
- Maintain responsive design
- Test on mobile devices
- Use TypeScript strictly
