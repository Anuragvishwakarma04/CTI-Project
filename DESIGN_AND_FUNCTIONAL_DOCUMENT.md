# Car Trust India - Design & Functional Document

## 1. Project Overview

**Project Name:** Car Trust India  
**Type:** Second-Hand Car Marketplace Platform  
**Technology Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand  
**Backend API:** Laravel (http://3.7.31.197)  
**Deployment:** Static Export (SSG)

### Purpose
A modern web platform connecting car buyers with verified dealers, enabling seamless buying, selling, and management of second-hand cars with integrated services like inspection, warranty, and financing.

---

## 2. User Roles

### 2.1 Customer
- Browse and search cars
- Save favorite cars
- Book appointments and services
- Manage garage (owned cars)
- View purchase history
- Access dashboard with personalized content

### 2.2 Dealer
- List and manage car inventory
- View analytics and insights
- Track views and engagement
- Manage business profile
- Access dealer dashboard
- Handle customer inquiries

---

## 3. System Architecture

### 3.1 Frontend Architecture
```
Next.js 14 (App Router)
├── Static Site Generation (SSG)
├── Client-Side State Management (Zustand)
├── API Integration (REST)
└── Responsive Design (Mobile-First)
```

### 3.2 Key Technologies
- **Framework:** Next.js 14.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **State Management:** Zustand
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image component
- **Authentication:** JWT Bearer Token

### 3.3 Design System

#### Color Palette
```css
Primary: #3b82f6 (Blue)
Primary Dark: #2563eb
Secondary: #10b981 (Green)
Danger: #ef4444 (Red)
Warning: #f59e0b (Orange)
Gray Scale: #f8fafc to #1f2937
```

#### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 4. Feature Specifications

### 4.1 Authentication System

#### Login Flow
1. **OTP-Based Authentication**
   - User enters mobile number
   - Selects role (Customer/Dealer)
   - Receives OTP via SMS
   - Verifies OTP
   - Redirects to complete profile (new users) or dashboard

#### API Endpoints
```
POST /api/send-otp
Body: { phone: string, type: 'customer' | 'dealer' }

POST /api/verify-otp
Body: { phone: string, otp: string, type: string }
Response: { success: boolean, token: string, user: object }
```

#### Profile Completion
- **Customer:** Name, Email
- **Dealer:** Name, Email, Business Name, GST Number, City, State, Pincode

### 4.2 Dashboard

#### Customer Dashboard
**Layout:** 20-80 split (Sidebar Menu | Main Content)

**Sidebar Menu:**
- My Appointments
- My Bookings
- My Orders
- My Garage
- Car PDI
- Settings
- Logout

**Main Content:**
- Profile card with avatar and details
- Stats grid (Active Listings, Views, Likes, Notifications)
- Tabs: Overview, My Listings, Favorites, Activity

#### Dealer Dashboard
**Layout:** Same 20-80 split

**Main Content:**
- Profile card with business details
- Stats grid (Active Listings, Total Views, Total Likes, Notifications)
- Tabs: Overview, My Listings, Analytics, Activity

**Analytics Tab:**
- Views trend chart (7 days)
- Top performing cars
- Engagement metrics

### 4.3 Car Management

#### Browse Cars
**Features:**
- Grid/List view
- Advanced filters (Brand, Price, Fuel Type, Transmission, Year)
- Search functionality
- Location-based filtering
- Pagination

**Car Card Display:**
- Thumbnail image
- Brand & Model
- Year & Mileage
- Price
- Location
- Like button
- Quick view

#### Car Details Page
**Sections:**
1. Image gallery with main image and thumbnails
2. Car specifications (Brand, Model, Year, Price, Mileage, Fuel, Transmission)
3. Features list
4. Dealer information
5. Similar cars
6. Contact dealer CTA

#### Upload Car (Dealers Only)
**Multi-Step Form:**
1. Basic Details (Brand, Model, Year, Price)
2. Specifications (Mileage, Fuel Type, Transmission, Color)
3. Features & Description
4. Images Upload (Multiple)
5. Review & Submit

**Validation:**
- All required fields
- Price range validation
- Year validation (2000 - current)
- Image format and size validation
- Approval workflow (Pending → Approved)

### 4.4 Dealer Management

#### Dealer Listing
- Grid of verified dealers
- Dealer card (Avatar, Name, Rating, Cars Count, Location)
- Follow/Unfollow functionality
- Filter by location

#### Dealer Showroom
- Dealer profile header
- Business information
- All cars by dealer
- Contact information
- Follow button

### 4.5 Services Module

**Available Services:**
1. Car Inspection
2. RC Transfer
3. Insurance Transfer
4. Loan Processing
5. Car Valuation

**Service Booking Flow:**
1. Select service
2. Choose date & time
3. Provide car details
4. Confirm booking
5. Payment (if applicable)

### 4.6 Warranty Module

**Warranty Plans:**
- Basic (6 months)
- Standard (1 year)
- Premium (2 years)

**Features:**
- Coverage details
- Price comparison
- Terms & conditions
- Purchase flow
- Claim process

---

## 5. API Integration

### 5.1 Base Configuration
```typescript
API_BASE_URL: http://3.7.31.197
Headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### 5.2 Response Format
```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```

### 5.3 Error Handling
```json
{
  "success": false,
  "errors": {
    "field": ["Error message"]
  }
}
```

**Implementation:**
- Field-specific error display
- Red border on invalid fields
- Error message below field
- General error alert at top

### 5.4 Key Endpoints

#### Authentication
```
POST /api/send-otp
POST /api/verify-otp
POST /api/complete-profile
GET /api/profile
PUT /api/profile
POST /api/logout
```

#### Cars
```
GET /api/cars?filters
GET /api/cars/:id
POST /api/cars (Dealer only)
PUT /api/cars/:id (Dealer only)
DELETE /api/cars/:id (Dealer only)
```

#### Dealers
```
GET /api/dealers
GET /api/dealers/:id
POST /api/dealers/:id/follow
POST /api/dealers/:id/unfollow
```

#### Services & Warranty
```
GET /api/services
POST /api/services/book
GET /api/warranties
POST /api/warranties/purchase
```

---

## 6. UI/UX Design

### 6.1 Design Principles
- **Mobile-First:** All designs start with mobile view
- **Modern & Clean:** Minimal clutter, focus on content
- **Consistent:** Unified color scheme and components
- **Accessible:** WCAG AA compliance
- **Fast:** Optimized images and lazy loading

### 6.2 Component Library

#### Buttons
```tsx
.btn-primary - Blue background, white text
.btn-secondary - White background, blue border
.btn-danger - Red background, white text
```

#### Cards
```tsx
.card - White background, shadow, rounded corners
Hover effect: Elevated shadow
```

#### Inputs
```tsx
.input-field - Border, rounded, focus ring
Error state: Red border + error message
```

#### Layout
- Max width: 1280px (7xl)
- Padding: Responsive (4-8)
- Gap: Consistent spacing (4-6)

### 6.3 Navigation

#### Header
**Desktop:**
- Logo (left)
- Search bar (center)
- User menu + Notifications (right)
- Secondary nav: Location, Buy Cars, Dealers, Services, Warranty, Sell Car

**Mobile:**
- Logo (left)
- Search icon + User menu (right)
- Expandable search bar
- Horizontal scroll navigation

#### Footer
- Quick links
- Social media
- Contact information
- Copyright

### 6.4 Responsive Design

**Mobile (< 640px):**
- Single column layout
- Stacked elements
- Hamburger menu
- Full-width buttons
- Smaller text and icons

**Tablet (640px - 1024px):**
- 2-column grid
- Visible navigation
- Medium-sized components

**Desktop (> 1024px):**
- Multi-column layouts
- Sidebar navigation
- Full feature set
- Hover effects

---

## 7. State Management

### 7.1 Zustand Store
```typescript
interface Store {
  user: User | null
  notifications: Notification[]
  filters: FilterOptions
  setUser: (user: User) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  setFilters: (filters: FilterOptions) => void
}
```

### 7.2 Local Storage
- JWT Token: `localStorage.getItem('token')`
- User Data: `localStorage.getItem('user')`
- Persists across sessions

---

## 8. Security Features

### 8.1 Authentication
- JWT Bearer Token
- Token stored in localStorage
- Auto-logout on token expiry
- Protected routes

### 8.2 Input Validation
- Client-side validation
- Server-side validation
- Sanitization of user inputs
- XSS prevention

### 8.3 API Security
- CORS enabled
- Rate limiting
- HTTPS in production
- Secure headers

---

## 9. Performance Optimization

### 9.1 Image Optimization
- Next.js Image component
- Lazy loading
- WebP format
- Responsive images

### 9.2 Code Splitting
- Dynamic imports
- Route-based splitting
- Component lazy loading

### 9.3 Caching
- Static page generation
- API response caching
- Browser caching

---

## 10. Deployment

### 10.1 Build Process
```bash
npm run build
# Generates static files in /out directory
```

### 10.2 Static Export Configuration
```javascript
// next.config.js
{
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

### 10.3 Hosting Options
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

---

## 11. Testing Strategy

### 11.1 Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Device testing (Mobile, Tablet, Desktop)
- User flow testing
- API integration testing

### 11.2 Validation Testing
- Form validation
- Error handling
- Edge cases
- Network failures

---

## 12. Future Enhancements

### Phase 2 Features
1. Real-time chat between buyers and dealers
2. AI-powered car recommendations
3. 360° car tours
4. Loan calculator with EMI options
5. Compare cars feature
6. Advanced search with AI filters
7. Review and rating system
8. Admin dashboard for approvals
9. Analytics dashboard for dealers
10. Mobile app (React Native)

### Phase 3 Features
1. Auction system
2. Trade-in valuation
3. Extended warranty marketplace
4. Car insurance integration
5. Service center network
6. Roadside assistance
7. Car history reports
8. Virtual test drives

---

## 13. Project Structure

```
ctiweb/
├── app/                          # Next.js pages
│   ├── cars/                    # Car listings & details
│   ├── dealers/                 # Dealer pages
│   ├── dashboard/               # User dashboard
│   ├── login/                   # Authentication
│   ├── complete-profile/        # Profile completion
│   ├── edit-profile/            # Profile editing
│   ├── upload-car/              # Car upload
│   ├── services/                # Services page
│   ├── warranty/                # Warranty page
│   └── api/                     # API routes (if needed)
├── components/                   # React components
│   ├── layout/                  # Header, Footer
│   ├── car/                     # Car components
│   ├── dealer/                  # Dealer components
│   ├── auth/                    # Auth components
│   └── location/                # Location selector
├── lib/                         # Utilities
│   ├── api.ts                   # API functions
│   ├── utils.ts                 # Helper functions
│   └── mockData.ts              # Mock data
├── store/                       # State management
│   └── useStore.ts              # Zustand store
├── types/                       # TypeScript types
│   └── index.ts                 # Type definitions
├── .amazonq/rules/              # Project rules
│   ├── api-integration.md
│   ├── coding-standards.md
│   ├── color-guidelines.md
│   ├── component-guidelines.md
│   ├── project-structure.md
│   ├── responsive-design.md
│   └── validation-rules.md
└── public/                      # Static assets
```

---

## 14. Development Guidelines

### 14.1 Code Standards
- TypeScript for all files
- ESLint + Prettier
- Functional components
- Hooks over classes
- Meaningful variable names

### 14.2 Git Workflow
```
main (production)
├── develop (staging)
    ├── feature/feature-name
    ├── bugfix/bug-name
    └── hotfix/critical-fix
```

### 14.3 Commit Convention
```
feat: Add car filter functionality
fix: Resolve mobile validation bug
docs: Update API documentation
style: Format code with prettier
refactor: Simplify auth logic
test: Add unit tests for CarCard
chore: Update dependencies
```

---

## 15. Support & Maintenance

### 15.1 Monitoring
- Error tracking
- Performance monitoring
- User analytics
- API health checks

### 15.2 Updates
- Security patches
- Dependency updates
- Feature releases
- Bug fixes

### 15.3 Documentation
- API documentation
- Component documentation
- User guides
- Developer guides

---

## 16. Contact & Resources

**Project Repository:** [GitHub URL]  
**API Documentation:** http://3.7.31.197/api/documentation  
**Design System:** Tailwind CSS + Custom Components  
**Support:** support@cartrustindia.com

---

## Appendix A: API Response Examples

### Successful Login
```json
{
  "success": true,
  "token": "16|RYx4QpD13cRHT3jhhEjEXGj5Fn50sEj3Z31BCXVzc15f61e1",
  "user": {
    "uuid": "189b3f7e-ffd6-49df-9d88-8c2851e7d1ec",
    "name": "Sumit",
    "email": "test@gmail.com",
    "phone": "9999999999",
    "user_type": "customer",
    "status": "active"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "errors": {
    "email": ["The email has already been taken."],
    "phone": ["Invalid phone number"]
  }
}
```

### Profile Data
```json
{
  "success": true,
  "user": {
    "uuid": "189b3f7e-ffd6-49df-9d88-8c2851e7d1ec",
    "name": "Sumit",
    "email": "test@gmail.com",
    "phone": "9999999999",
    "address": "test",
    "city_id": 146,
    "city_name": "ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201020",
    "user_type": "customer",
    "business_name": null,
    "gst_number": null,
    "status": "active",
    "created_at": "2026-01-29T03:20:38.000000Z",
    "updated_at": "2026-02-01T18:50:00.000000Z"
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** February 2, 2024  
**Author:** Development Team
