# Component Guidelines

## Component Patterns

### Page Components
```typescript
// app/[feature]/page.tsx
'use client'; // if using hooks/state

export default function FeaturePage() {
  return <div>Content</div>;
}
```

### Reusable Components
```typescript
// components/[category]/ComponentName.tsx
'use client'; // if needed

interface ComponentProps {
  // props
}

export default function ComponentName({ }: ComponentProps) {
  return <div>Content</div>;
}
```

## Common Components

### CarCard
- Location: `components/car/CarCard.tsx`
- Props: `{ car: Car }`
- Features: Image, price, specs, like button

### FilterPanel
- Location: `components/car/FilterPanel.tsx`
- Props: `{ onFilterChange, onClose? }`
- Features: Brand, price, fuel, transmission filters

### DealerCard
- Location: `components/dealer/DealerCard.tsx`
- Props: `{ dealer: Dealer }`
- Features: Avatar, stats, follow button

### Header
- Location: `components/layout/Header.tsx`
- Features: Navigation, user menu, notifications

### Footer
- Location: `components/layout/Footer.tsx`
- Features: Links, social media

## Styling Patterns

### Buttons
```tsx
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
```

### Cards
```tsx
<div className="card p-6">Content</div>
```

### Inputs
```tsx
<input className="input-field" />
```

### Responsive Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

## State Management

### Using Store
```typescript
import { useStore } from '@/store/useStore';

const { user, setUser, followDealer } = useStore();
```

### Available State
- user: User | null
- notifications: Notification[]
- filters: FilterOptions

### Available Actions
- setUser(user)
- addNotification(notification)
- markNotificationRead(id)
- setFilters(filters)
- followDealer(dealerId)
- unfollowDealer(dealerId)

## Icons
Use lucide-react:
```typescript
import { Car, Heart, User, Bell } from 'lucide-react';
```

## Images
```typescript
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  fill
  className="object-cover"
/>
```

## Navigation
```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/path">Link</Link>

const router = useRouter();
router.push('/path');
```

## Forms
```typescript
const [formData, setFormData] = useState({});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form
};
```

## Conditional Rendering
```typescript
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

## Lists
```typescript
{items.map((item) => (
  <Component key={item.id} item={item} />
))}
```
