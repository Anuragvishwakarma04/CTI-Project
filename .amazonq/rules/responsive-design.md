# Responsive Design Guidelines

## Mobile-First Approach

All designs use Tailwind's mobile-first breakpoints:
- **Default**: Mobile (< 640px)
- **sm**: Small devices (≥ 640px)
- **md**: Medium devices (≥ 768px)
- **lg**: Large devices (≥ 1024px)
- **xl**: Extra large (≥ 1280px)

## Responsive Patterns

### Typography
```tsx
// Headings scale with screen size
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">

// Body text
<p className="text-sm sm:text-base md:text-lg">
```

### Spacing
```tsx
// Padding/Margin
<div className="py-12 sm:py-16 md:py-20">
<div className="gap-4 sm:gap-6 md:gap-8">
```

### Grids
```tsx
// 1 col mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

// 2 col mobile, 4 desktop
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
```

### Buttons
```tsx
// Responsive padding and text
<button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">
```

### Flex Layouts
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### Hide/Show Elements
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="block md:hidden">
```

## Component Responsiveness

### Cards
- Smaller padding on mobile
- Reduced border radius on mobile
- Full width on mobile, grid on desktop

### Forms
- Stack inputs on mobile
- Side-by-side on desktop
- Smaller input padding on mobile

### Modals
- Full screen on mobile
- Centered with max-width on desktop
- Responsive padding

### Navigation
- Hamburger menu on mobile
- Full nav on desktop
- Collapsible sections

## Testing Breakpoints

Test on these common devices:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px (Laptop)
- Large: 1920px (Desktop)

## Best Practices

1. **Always start with mobile design**
2. **Use responsive images** with Next.js Image
3. **Test touch targets** (min 44x44px)
4. **Avoid horizontal scroll**
5. **Use relative units** (rem, %, vh/vw)
6. **Optimize font sizes** for readability
7. **Stack complex layouts** on mobile
8. **Reduce whitespace** on small screens
9. **Make CTAs prominent** on all sizes
10. **Test on real devices**
