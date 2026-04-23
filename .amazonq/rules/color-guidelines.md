# Color Guidelines

## Color Palette

### Primary Colors
```css
--primary: #3b82f6;        /* Blue - Main brand color */
--primary-dark: #2563eb;   /* Darker blue - Hover states */
```

**Usage:**
- Primary buttons: `bg-primary hover:bg-primary-dark`
- Links: `text-primary hover:text-primary-dark`
- Icons: `text-primary`
- Borders: `border-primary`

### Secondary Colors
```css
--secondary: #10b981;      /* Green - Success, positive actions */
```

**Usage:**
- Success messages: `bg-secondary text-white`
- Positive indicators: `text-secondary`
- Secondary buttons: `bg-secondary hover:bg-secondary-600`

### Status Colors
```css
--danger: #ef4444;         /* Red - Errors, delete actions */
--warning: #f59e0b;        /* Orange - Warnings, alerts */
```

**Usage:**
- Error messages: `text-danger bg-red-50 border-danger`
- Delete buttons: `bg-danger hover:bg-danger-600`
- Warning alerts: `text-warning bg-yellow-50`

### Neutral Colors
```css
--light: #f8fafc;          /* Light gray - Backgrounds */
--gray: #6b7280;           /* Medium gray - Text, borders */
--gray-light: #e5e7eb;     /* Light gray - Dividers */
--dark: #1f2937;           /* Dark gray - Headings */
```

**Usage:**
- Page background: `bg-gray-50` or `bg-light`
- Text: `text-gray-600`, `text-gray-700`, `text-dark`
- Borders: `border-gray-300`, `border-gray-light`
- Disabled states: `bg-gray-100 text-gray-400`

## Component Color Patterns

### Buttons
```tsx
// Primary
<button className="bg-primary text-white hover:bg-primary-dark">

// Secondary
<button className="bg-secondary text-white hover:bg-secondary-600">

// Danger
<button className="bg-danger text-white hover:bg-danger-600">

// Outline
<button className="border-2 border-primary text-primary hover:bg-primary-50">
```

### Cards
```tsx
<div className="bg-white border border-gray-200 hover:border-primary">
```

### Inputs
```tsx
<input className="border-gray-300 focus:border-primary focus:ring-primary" />

// Error state
<input className="border-danger focus:ring-danger" />
```

### Alerts
```tsx
// Success
<div className="bg-secondary-50 border-secondary text-secondary-700">

// Error
<div className="bg-red-50 border-danger text-red-700">

// Warning
<div className="bg-yellow-50 border-warning text-yellow-700">

// Info
<div className="bg-blue-50 border-primary text-blue-700">
```

### Text
```tsx
// Headings
<h1 className="text-dark">

// Body
<p className="text-gray-700">

// Muted
<span className="text-gray-500">

// Links
<a className="text-primary hover:text-primary-dark">
```

### Badges
```tsx
// Success
<span className="bg-secondary text-white">

// Warning
<span className="bg-warning text-white">

// Danger
<span className="bg-danger text-white">

// Info
<span className="bg-primary text-white">
```

## Tailwind Class Reference

### Background Colors
- `bg-primary` - #3b82f6
- `bg-primary-dark` - #2563eb
- `bg-secondary` - #10b981
- `bg-danger` - #ef4444
- `bg-warning` - #f59e0b
- `bg-gray-50` - #f8fafc
- `bg-white` - #ffffff

### Text Colors
- `text-primary` - #3b82f6
- `text-secondary` - #10b981
- `text-danger` - #ef4444
- `text-warning` - #f59e0b
- `text-gray-600` - #6b7280
- `text-dark` - #1f2937

### Border Colors
- `border-primary` - #3b82f6
- `border-secondary` - #10b981
- `border-danger` - #ef4444
- `border-gray-300` - #e5e7eb

## Best Practices

1. **Consistency**: Use primary color for main actions, secondary for positive feedback
2. **Contrast**: Ensure text has sufficient contrast (WCAG AA minimum)
3. **Hover States**: Always darken colors on hover (use -dark variants)
4. **Disabled States**: Use gray-400 for disabled text, gray-100 for backgrounds
5. **Focus States**: Use ring-primary for focus indicators
6. **Semantic Colors**: Use danger for destructive actions, warning for caution, secondary for success

## Quick Reference

```tsx
// Common patterns
className="bg-primary text-white hover:bg-primary-dark"
className="text-primary hover:text-primary-dark"
className="border-primary focus:ring-primary"
className="bg-red-50 border-danger text-red-700"
className="bg-secondary-50 text-secondary-700"
```
