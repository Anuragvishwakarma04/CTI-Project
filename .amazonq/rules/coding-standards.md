# Reusable Coding Rules

## General Rules

### Code Style
- Use TypeScript for all files
- Use 'use client' for client components
- Use async/await over promises
- Prefer const over let
- Use arrow functions
- Max line length: 100 characters
- Use single quotes for strings
- Add semicolons

### Naming Conventions
- Components: PascalCase (e.g., `CarCard.tsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PRICE`)
- Files: kebab-case for utils (e.g., `api-utils.ts`)
- Interfaces: PascalCase with 'I' prefix optional

### File Organization
```
feature/
├── components/     # Feature components
├── hooks/         # Custom hooks
├── utils/         # Helper functions
└── types/         # Type definitions
```

---

## Component Rules

### Component Structure
```tsx
'use client'; // if needed

import { useState } from 'react';
import { ExternalLib } from 'external';
import { InternalUtil } from '@/lib/utils';
import ComponentA from '@/components/ComponentA';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export default function Component({ prop1, prop2 = 0 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState('');
  
  // 2. Functions
  const handleClick = () => {};
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Render
  return <div>{prop1}</div>;
}
```

### Component Best Practices
- One component per file
- Export default for main component
- Props interface above component
- Destructure props in parameters
- Use TypeScript for all props
- Keep components under 200 lines
- Extract logic to custom hooks
- Use memo for expensive renders

---

## State Management Rules

### Zustand Store Pattern
```tsx
// store/useFeatureStore.ts
import { create } from 'zustand';

interface FeatureState {
  data: any[];
  loading: boolean;
  setData: (data: any[]) => void;
  fetchData: () => Promise<void>;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  data: [],
  loading: false,
  setData: (data) => set({ data }),
  fetchData: async () => {
    set({ loading: true });
    // fetch logic
    set({ loading: false });
  },
}));
```

### State Rules
- Use Zustand for global state
- Use useState for local state
- Use useReducer for complex state
- Avoid prop drilling (use context/store)
- Keep state minimal
- Derive data, don't store it

---

## API Rules

### API Route Structure
```tsx
// app/api/resource/route.ts
import { NextRequest } from 'next/server';
import { apiResponse, apiError, requireAuth } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication
    const { error, user } = await requireAuth(request);
    if (error) return error;
    
    // 2. Validation
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return apiError('ID required', 400);
    
    // 3. Business logic
    const data = await fetchData(id);
    
    // 4. Response
    return apiResponse(data);
  } catch (err) {
    return apiError('Internal error', 500);
  }
}
```

### API Best Practices
- Always use try-catch
- Validate all inputs
- Sanitize user data
- Use apiResponse/apiError wrappers
- Return proper HTTP status codes
- Add rate limiting
- Log errors (don't expose to client)
- Use TypeScript for request/response

---

## Database Rules

### Query Pattern
```tsx
// lib/db/queries.ts
export async function getCarById(id: string) {
  const db = await connectDB();
  return await db.collection('cars').findOne({ _id: id });
}

export async function createCar(data: Car) {
  const db = await connectDB();
  return await db.collection('cars').insertOne(data);
}
```

### Database Best Practices
- Use connection pooling
- Create indexes for queries
- Use transactions for multiple operations
- Validate before insert/update
- Use parameterized queries
- Handle connection errors
- Close connections properly
- Cache frequent queries

---

## Security Rules

### Input Validation
```tsx
import { validators, sanitizeObject } from '@/lib/api-utils';

// Validate
if (!validators.mobile(mobile)) {
  return apiError('Invalid mobile', 400);
}

// Sanitize
const cleanData = sanitizeObject(body, ['name', 'email']);
```

### Security Checklist
- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use parameterized queries
- ✅ Implement rate limiting
- ✅ Add CSRF protection
- ✅ Use httpOnly cookies
- ✅ Enable CORS properly
- ✅ Add security headers
- ✅ Hash passwords (bcrypt)
- ✅ Use HTTPS in production

---

## Styling Rules

### Tailwind Patterns
```tsx
// Responsive
<div className="px-4 sm:px-6 lg:px-8">

// Conditional
<div className={`base-class ${condition ? 'active' : 'inactive'}`}>

// Dynamic
<div className={clsx('base', { 'active': isActive })}>
```

### Styling Best Practices
- Use Tailwind utility classes
- Create custom classes for repeated patterns
- Use responsive breakpoints (sm, md, lg, xl)
- Keep className readable (max 5-6 utilities)
- Extract complex styles to CSS
- Use CSS variables for themes
- Mobile-first approach

---

## Error Handling Rules

### Frontend Error Handling
```tsx
const [error, setError] = useState('');

try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Failed');
  const data = await response.json();
} catch (err) {
  setError(err.message);
  console.error('Error:', err);
}
```

### Backend Error Handling
```tsx
try {
  // logic
} catch (err) {
  console.error('Error:', err);
  return apiError('Operation failed', 500);
}
```

### Error Best Practices
- Always use try-catch for async
- Show user-friendly messages
- Log detailed errors server-side
- Don't expose internal errors
- Use error boundaries for React
- Handle network errors
- Provide fallback UI

---

## Testing Rules

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });
});
```

### Testing Best Practices
- Test user behavior, not implementation
- Use data-testid for complex selectors
- Mock external dependencies
- Test error states
- Test loading states
- Test edge cases
- Aim for 80%+ coverage

---

## Performance Rules

### Optimization Techniques
```tsx
// Lazy loading
const Component = lazy(() => import('./Component'));

// Memoization
const memoizedValue = useMemo(() => compute(a, b), [a, b]);
const memoizedCallback = useCallback(() => {}, []);

// Image optimization
<Image src={url} alt="desc" width={500} height={300} />
```

### Performance Best Practices
- Use Next.js Image component
- Lazy load components
- Implement pagination
- Use React.memo for expensive components
- Debounce search inputs
- Cache API responses
- Optimize images (WebP, AVIF)
- Code splitting
- Remove console.logs in production

---

## Git Rules

### Commit Messages
```
feat: add car filter functionality
fix: resolve mobile validation bug
docs: update API documentation
style: format code with prettier
refactor: simplify auth logic
test: add unit tests for CarCard
chore: update dependencies
```

### Branch Naming
```
feature/car-filters
bugfix/mobile-validation
hotfix/security-patch
refactor/auth-logic
```

### Git Best Practices
- Commit often, push daily
- Write descriptive commit messages
- Use conventional commits
- Create feature branches
- Review before merging
- Keep commits atomic
- Don't commit secrets
- Use .gitignore

---

## Documentation Rules

### Code Comments
```tsx
// Good: Explain WHY
// Using setTimeout to debounce API calls and reduce server load
setTimeout(() => fetchData(), 300);

// Bad: Explain WHAT (code is self-explanatory)
// Set loading to true
setLoading(true);
```

### Documentation Best Practices
- Comment complex logic
- Document public APIs
- Add JSDoc for functions
- Keep README updated
- Document environment variables
- Add inline examples
- Update changelog
- Write clear error messages

---

## Accessibility Rules

### A11y Best Practices
```tsx
// Semantic HTML
<button onClick={handleClick}>Click</button>

// Alt text
<img src={url} alt="Car image" />

// ARIA labels
<button aria-label="Close modal">×</button>

// Keyboard navigation
<div role="button" tabIndex={0} onKeyPress={handleKey}>
```

### Accessibility Checklist
- ✅ Use semantic HTML
- ✅ Add alt text to images
- ✅ Ensure keyboard navigation
- ✅ Use ARIA labels
- ✅ Maintain color contrast
- ✅ Add focus indicators
- ✅ Support screen readers
- ✅ Test with accessibility tools

---

## Environment Rules

### Environment Variables
```env
# Public (accessible in browser)
NEXT_PUBLIC_API_URL=https://api.example.com

# Private (server-side only)
DATABASE_URL=postgresql://...
JWT_SECRET=secret123
```

### Environment Best Practices
- Prefix public vars with NEXT_PUBLIC_
- Never commit .env files
- Use .env.example for templates
- Validate required env vars on startup
- Use different values per environment
- Document all variables
- Rotate secrets regularly

---

## Deployment Rules

### Pre-deployment Checklist
- ✅ Run tests
- ✅ Build successfully
- ✅ Update environment variables
- ✅ Check security headers
- ✅ Enable HTTPS
- ✅ Set up monitoring
- ✅ Configure backups
- ✅ Test in staging
- ✅ Update documentation
- ✅ Create deployment plan

### Deployment Best Practices
- Use CI/CD pipeline
- Deploy to staging first
- Run smoke tests
- Monitor after deployment
- Have rollback plan
- Keep deployment logs
- Use blue-green deployment
- Automate as much as possible

---

## Code Review Rules

### Review Checklist
- ✅ Code follows style guide
- ✅ Tests are included
- ✅ No console.logs
- ✅ No hardcoded values
- ✅ Error handling present
- ✅ Security considerations
- ✅ Performance optimized
- ✅ Documentation updated
- ✅ Accessible
- ✅ Mobile responsive

### Review Best Practices
- Be constructive
- Explain reasoning
- Suggest alternatives
- Approve quickly
- Test locally if needed
- Check for security issues
- Verify tests pass
- Ensure documentation updated


## Loading States Pattern

### Circular Loader
Always show a circular loading spinner when fetching data from API:

```tsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// Display loader
{loading ? (
  <div className="flex justify-center items-center py-16">
    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
  <div>Content</div>
)}
```

### Loading States Best Practices
- Always set loading to true before API call
- Use finally block to ensure loading is set to false
- Show spinner in center with appropriate padding
- Use primary color for spinner
- Add loading state for all async operations
- Disable buttons during loading with `disabled={loading}`
- Show loading text on buttons: `{loading ? 'Loading...' : 'Submit'}`

