# Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run linter

# Docker
npm run docker:build           # Build Docker image
npm run docker:run             # Start all services
npm run docker:stop            # Stop all services

# Database
redis-server                   # Start Redis
mongod                         # Start MongoDB
```

## 📁 File Locations

| What | Where |
|------|-------|
| Pages | `app/*/page.tsx` |
| API Routes | `app/api/*/route.ts` |
| Components | `components/` |
| Utilities | `lib/` |
| Types | `types/index.ts` |
| Store | `store/useStore.ts` |
| Styles | `app/globals.css` |
| Config | `next.config.js` |

## 🎨 Tailwind Classes

```tsx
// Layout
<div className="container mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div className="flex items-center justify-between">

// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>

// Cards
<div className="card p-6">Content</div>

// Inputs
<input className="input-field" />

// Text
<h1 className="text-3xl font-bold">Heading</h1>
<p className="text-gray-600">Paragraph</p>

// Spacing
<div className="py-8 px-4 sm:px-6 lg:px-8">
<div className="space-y-4">
<div className="gap-4 sm:gap-6">

// Responsive
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🔧 Common Patterns

### Create New Page
```tsx
// app/feature/page.tsx
'use client';

export default function FeaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Feature</h1>
    </div>
  );
}
```

### Create API Route
```tsx
// app/api/resource/route.ts
import { NextRequest } from 'next/server';
import { apiResponse, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return apiResponse(data);
  } catch (error) {
    return apiError('Failed', 500);
  }
}
```

### Create Component
```tsx
// components/feature/Component.tsx
'use client';

interface ComponentProps {
  title: string;
}

export default function Component({ title }: ComponentProps) {
  return <div>{title}</div>;
}
```

### Fetch Data
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Form Handling
```tsx
const [formData, setFormData] = useState({ name: '', email: '' });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
};

<form onSubmit={handleSubmit}>
  <input
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</form>
```

## 🗄️ Store Usage

```tsx
import { useStore } from '@/store/useStore';

function Component() {
  const { user, setUser, notifications } = useStore();
  
  // Read state
  console.log(user);
  
  // Update state
  setUser(newUser);
}
```

## 🔐 Authentication

```tsx
// Check if logged in
const { user } = useStore();
if (!user) router.push('/login');

// Get session (server-side)
import { getSession } from '@/lib/auth';
const session = await getSession();

// Protect API route
import { requireAuth } from '@/lib/api-utils';
const { error, user } = await requireAuth(request);
if (error) return error;
```

## 🎯 Icons

```tsx
import { 
  Car, Heart, User, Bell, Search, Filter,
  ChevronRight, X, Check, AlertCircle 
} from 'lucide-react';

<Car className="w-6 h-6 text-primary-600" />
```

## 🖼️ Images

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  className="object-cover"
/>

// Fill container
<div className="relative h-64">
  <Image src={url} alt="desc" fill className="object-cover" />
</div>
```

## 🔗 Navigation

```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Link
<Link href="/cars">View Cars</Link>

// Programmatic
const router = useRouter();
router.push('/cars');
router.back();
```

## ✅ Validation

```tsx
import { validators } from '@/lib/api-utils';

// Mobile
if (!validators.mobile(mobile)) {
  setError('Invalid mobile number');
}

// Email
if (!validators.email(email)) {
  setError('Invalid email');
}

// Price
if (!validators.price(price)) {
  setError('Invalid price');
}
```

## 🎨 Color Palette

```
Primary: primary-50 to primary-900
Gray: gray-50 to gray-900
Red: red-50 to red-900
Green: green-50 to green-900
Blue: blue-50 to blue-900
Yellow: yellow-50 to yellow-900
```

## 📱 Responsive Breakpoints

```
sm:  640px   (tablet)
md:  768px   (small laptop)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

## 🐛 Debugging

```tsx
// Console log
console.log('Data:', data);

// React DevTools
// Install browser extension

// Network tab
// Check API calls in browser DevTools

// Error boundary
// Wrap components to catch errors
```

## 📦 Common Imports

```tsx
// React
import { useState, useEffect, useMemo, useCallback } from 'react';

// Next.js
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Store
import { useStore } from '@/store/useStore';

// Utils
import { cn } from '@/lib/utils';

// Icons
import { Car, Heart } from 'lucide-react';
```

## 🔥 Hot Tips

1. **Use TypeScript** - Catch errors early
2. **Mobile-first** - Design for mobile, enhance for desktop
3. **Validate inputs** - Never trust user input
4. **Handle errors** - Always use try-catch
5. **Optimize images** - Use Next.js Image component
6. **Cache data** - Reduce API calls
7. **Test locally** - Before pushing code
8. **Read docs** - When stuck
9. **Ask for help** - Don't waste time
10. **Keep it simple** - KISS principle

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [React Docs](https://react.dev)
- [Lucide Icons](https://lucide.dev)

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `lsof -ti:3000 \| xargs kill -9` |
| Build fails | `rm -rf .next && npm run build` |
| Types error | `rm -rf node_modules && npm install` |
| Image not loading | Check next.config.js domains |
| API not working | Check .env.local variables |
| Style not applying | Check Tailwind config |
