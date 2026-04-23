# CarTrade India - Buy/Browse Cars Page Design Specifications

## 🎨 Page Overview

The Buy Cars page is the main browsing interface where users discover and filter used cars. It includes search, filters, sorting, and car listings in a card-based layout.

---

## 📱 Screen Layout

```
┌─────────────────────────────────────┐
│  [Header with Search & Location]    │
├─────────────────────────────────────┤
│  [Filter Chips Row - Scrollable]    │
├─────────────────────────────────────┤
│  [Sort & View Toggle]               │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     [Car Card 1]            │   │
│  │  Image | Details | Price    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     [Car Card 2]            │   │
│  │  Image | Details | Price    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     [Car Card 3]            │   │
│  │  Image | Details | Price    │   │
│  └─────────────────────────────┘   │
│                                     │
│         [Load More]                 │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔍 Section 1: Search Header

### Visual Design

```
┌─────────────────────────────────────┐
│  📍 Mumbai ▼    🔔 [3]    👤        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Search cars, brands...   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Component Schema

**Location Selector:**
```json
{
  "component": "LocationButton",
  "icon": "📍",
  "text": "Mumbai",
  "action": "openLocationModal",
  "styling": {
    "height": "40px",
    "padding": "8px 12px",
    "fontSize": "14px",
    "fontWeight": "600",
    "color": "#1f2937",
    "background": "#f8fafc",
    "borderRadius": "8px"
  }
}
```

**Search Bar:**
```json
{
  "component": "SearchInput",
  "placeholder": "Search cars, brands, models...",
  "type": "text",
  "icon": "🔍",
  "styling": {
    "height": "48px",
    "padding": "0 16px 0 48px",
    "fontSize": "16px",
    "background": "#f8fafc",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb"
  },
  "behavior": {
    "autoComplete": true,
    "debounce": 300,
    "showSuggestions": true,
    "recentSearches": true
  }
}
```

**Notification Badge:**
```json
{
  "component": "NotificationBell",
  "icon": "🔔",
  "badgeCount": 3,
  "styling": {
    "iconSize": "24px",
    "badgeBackground": "#ef4444",
    "badgeColor": "#ffffff",
    "badgeSize": "18px",
    "badgeFontSize": "11px"
  }
}
```

---

## 🎛️ Section 2: Filter Chips

### Visual Design

```
┌─────────────────────────────────────┐
│  [🎚️ All Filters]  [Brand ▼]       │
│  [Price ▼]  [Fuel ▼]  [Year ▼]     │
│  ← → (Horizontal Scroll)            │
└─────────────────────────────────────┘
```

### Filter Chip Schema

**All Filters Button:**
```json
{
  "component": "FilterButton",
  "label": "All Filters",
  "icon": "🎚️",
  "action": "openFilterModal",
  "styling": {
    "height": "40px",
    "padding": "8px 16px",
    "fontSize": "14px",
    "fontWeight": "600",
    "background": "#3b82f6",
    "color": "#ffffff",
    "borderRadius": "20px",
    "marginRight": "8px"
  }
}
```

**Filter Chips:**
```json
{
  "component": "FilterChip",
  "variants": [
    {
      "id": "brand",
      "label": "Brand",
      "icon": "▼",
      "options": ["Maruti", "Hyundai", "Honda", "Tata", "Mahindra"],
      "multiSelect": true
    },
    {
      "id": "price",
      "label": "Price",
      "icon": "▼",
      "type": "range",
      "min": 0,
      "max": 10000000,
      "step": 50000
    },
    {
      "id": "fuel",
      "label": "Fuel",
      "icon": "▼",
      "options": ["Petrol", "Diesel", "CNG", "Electric"],
      "multiSelect": true
    },
    {
      "id": "transmission",
      "label": "Transmission",
      "icon": "▼",
      "options": ["Manual", "Automatic"],
      "multiSelect": false
    },
    {
      "id": "year",
      "label": "Year",
      "icon": "▼",
      "type": "range",
      "min": 2010,
      "max": 2025
    }
  ],
  "styling": {
    "height": "40px",
    "padding": "8px 12px",
    "fontSize": "14px",
    "background": "#ffffff",
    "color": "#1f2937",
    "border": "1px solid #e5e7eb",
    "borderRadius": "20px",
    "marginRight": "8px"
  },
  "activeState": {
    "background": "#eff6ff",
    "color": "#3b82f6",
    "border": "1px solid #3b82f6"
  }
}
```

---

## 📊 Section 3: Sort & View Toggle

### Visual Design

```
┌─────────────────────────────────────┐
│  1,234 Cars Found                   │
│                                     │
│  Sort: Price Low to High ▼  [⊞][≡] │
└─────────────────────────────────────┘
```

### Component Schema

**Results Count:**
```json
{
  "component": "ResultsCount",
  "text": "{count} Cars Found",
  "styling": {
    "fontSize": "16px",
    "fontWeight": "600",
    "color": "#1f2937",
    "marginBottom": "12px"
  }
}
```

**Sort Dropdown:**
```json
{
  "component": "SortDropdown",
  "label": "Sort:",
  "options": [
    { "value": "price_low", "label": "Price: Low to High" },
    { "value": "price_high", "label": "Price: High to Low" },
    { "value": "year_new", "label": "Year: Newest First" },
    { "value": "year_old", "label": "Year: Oldest First" },
    { "value": "mileage_low", "label": "Mileage: Low to High" },
    { "value": "popular", "label": "Most Popular" }
  ],
  "styling": {
    "height": "36px",
    "padding": "6px 12px",
    "fontSize": "14px",
    "background": "#f8fafc",
    "borderRadius": "8px",
    "border": "1px solid #e5e7eb"
  }
}
```

**View Toggle:**
```json
{
  "component": "ViewToggle",
  "options": [
    { "value": "grid", "icon": "⊞" },
    { "value": "list", "icon": "≡" }
  ],
  "default": "list",
  "styling": {
    "height": "36px",
    "width": "72px",
    "background": "#f8fafc",
    "borderRadius": "8px",
    "border": "1px solid #e5e7eb"
  },
  "activeState": {
    "background": "#3b82f6",
    "color": "#ffffff"
  }
}
```

---

## 🚗 Section 4: Car Card (List View)

### Visual Design

```
┌─────────────────────────────────────┐
│  ┌─────────┐                        │
│  │  [IMG]  │  Maruti Swift VXI      │
│  │         │  2020 • 25,000 km      │
│  │  [♡]   │  Petrol • Manual        │
│  └─────────┘                        │
│              ₹5,45,000              │
│              📍 Mumbai              │
│              [View Details →]       │
└─────────────────────────────────────┘
```

### Car Card Schema

```json
{
  "component": "CarCard",
  "layout": "list",
  "data": {
    "id": "car-123",
    "image": "url",
    "brand": "Maruti",
    "model": "Swift VXI",
    "year": 2020,
    "mileage": 25000,
    "fuelType": "Petrol",
    "transmission": "Manual",
    "price": 545000,
    "location": "Mumbai",
    "liked": false,
    "verified": true
  },
  "styling": {
    "height": "140px",
    "padding": "12px",
    "background": "#ffffff",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb",
    "marginBottom": "12px",
    "shadow": "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  "sections": {
    "image": {
      "width": "120px",
      "height": "100%",
      "borderRadius": "8px",
      "objectFit": "cover",
      "position": "left"
    },
    "details": {
      "padding": "0 12px",
      "flex": 1
    },
    "title": {
      "fontSize": "16px",
      "fontWeight": "600",
      "color": "#1f2937",
      "marginBottom": "4px"
    },
    "specs": {
      "fontSize": "14px",
      "color": "#6b7280",
      "marginBottom": "2px"
    },
    "price": {
      "fontSize": "18px",
      "fontWeight": "700",
      "color": "#3b82f6",
      "marginTop": "8px"
    },
    "location": {
      "fontSize": "12px",
      "color": "#6b7280",
      "marginTop": "4px"
    }
  },
  "actions": {
    "like": {
      "icon": "♡",
      "activeIcon": "♥",
      "position": "top-right",
      "size": "32px",
      "background": "#ffffff",
      "shadow": "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    "viewDetails": {
      "label": "View Details",
      "icon": "→",
      "action": "navigate",
      "route": "/cars/{id}"
    }
  }
}
```

---

## 🚗 Section 5: Car Card (Grid View)

### Visual Design

```
┌─────────────────┐  ┌─────────────────┐
│   [Image]       │  │   [Image]       │
│   [♡]          │  │   [♡]          │
│                 │  │                 │
│ Maruti Swift    │  │ Hyundai i20     │
│ 2020 • 25K km   │  │ 2019 • 30K km   │
│ ₹5,45,000      │  │ ₹6,20,000      │
│ 📍 Mumbai      │  │ 📍 Delhi       │
└─────────────────┘  └─────────────────┘
```

### Grid Card Schema

```json
{
  "component": "CarCard",
  "layout": "grid",
  "styling": {
    "width": "48%",
    "marginBottom": "12px",
    "background": "#ffffff",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb",
    "shadow": "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  "sections": {
    "image": {
      "height": "140px",
      "width": "100%",
      "borderRadius": "12px 12px 0 0",
      "objectFit": "cover"
    },
    "content": {
      "padding": "12px"
    },
    "title": {
      "fontSize": "14px",
      "fontWeight": "600",
      "color": "#1f2937",
      "marginBottom": "4px",
      "lines": 1,
      "overflow": "ellipsis"
    },
    "specs": {
      "fontSize": "12px",
      "color": "#6b7280",
      "marginBottom": "8px"
    },
    "price": {
      "fontSize": "16px",
      "fontWeight": "700",
      "color": "#3b82f6"
    },
    "location": {
      "fontSize": "11px",
      "color": "#6b7280",
      "marginTop": "4px"
    }
  }
}
```

---

## 🎚️ Section 6: Filter Modal (Bottom Sheet)

### Visual Design

```
┌─────────────────────────────────────┐
│         ━━━━━━━                     │
│                                     │
│  Filters                    [Clear] │
│  ─────────────────────────────────  │
│                                     │
│  Brand                              │
│  ☐ Maruti  ☐ Hyundai  ☐ Honda     │
│  ☐ Tata    ☐ Mahindra              │
│                                     │
│  Price Range                        │
│  ₹2L ━━━━●━━━━━━━━━━━━━━━ ₹10L    │
│                                     │
│  Fuel Type                          │
│  ☐ Petrol  ☐ Diesel  ☐ CNG        │
│                                     │
│  Transmission                       │
│  ○ Manual  ○ Automatic  ○ Both     │
│                                     │
│  Year                               │
│  2015 ━━━━━━━●━━━━━━━━━━ 2024     │
│                                     │
│  Mileage                            │
│  0 km ━━━━━━━━━●━━━━━━━ 100K km   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Apply Filters (234)       │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Filter Modal Schema

```json
{
  "component": "FilterModal",
  "type": "bottomSheet",
  "height": "85vh",
  "styling": {
    "background": "#ffffff",
    "borderRadius": "24px 24px 0 0",
    "padding": "24px"
  },
  "header": {
    "title": "Filters",
    "clearButton": {
      "label": "Clear",
      "action": "clearAllFilters",
      "color": "#3b82f6"
    }
  },
  "filters": [
    {
      "type": "checkbox",
      "label": "Brand",
      "options": [
        { "value": "maruti", "label": "Maruti", "count": 450 },
        { "value": "hyundai", "label": "Hyundai", "count": 320 },
        { "value": "honda", "label": "Honda", "count": 280 },
        { "value": "tata", "label": "Tata", "count": 210 },
        { "value": "mahindra", "label": "Mahindra", "count": 180 }
      ],
      "layout": "grid",
      "columns": 2
    },
    {
      "type": "range",
      "label": "Price Range",
      "min": 0,
      "max": 10000000,
      "step": 50000,
      "format": "currency",
      "showLabels": true,
      "styling": {
        "trackColor": "#e5e7eb",
        "activeTrackColor": "#3b82f6",
        "thumbColor": "#3b82f6",
        "thumbSize": "24px"
      }
    },
    {
      "type": "checkbox",
      "label": "Fuel Type",
      "options": [
        { "value": "petrol", "label": "Petrol", "count": 680 },
        { "value": "diesel", "label": "Diesel", "count": 420 },
        { "value": "cng", "label": "CNG", "count": 120 },
        { "value": "electric", "label": "Electric", "count": 45 }
      ],
      "layout": "grid",
      "columns": 2
    },
    {
      "type": "radio",
      "label": "Transmission",
      "options": [
        { "value": "manual", "label": "Manual", "count": 890 },
        { "value": "automatic", "label": "Automatic", "count": 340 },
        { "value": "both", "label": "Both", "count": 1234 }
      ],
      "layout": "horizontal"
    },
    {
      "type": "range",
      "label": "Year",
      "min": 2010,
      "max": 2025,
      "step": 1,
      "showLabels": true
    },
    {
      "type": "range",
      "label": "Mileage",
      "min": 0,
      "max": 100000,
      "step": 5000,
      "format": "km",
      "showLabels": true
    }
  ],
  "footer": {
    "button": {
      "label": "Apply Filters ({count})",
      "action": "applyFilters",
      "styling": {
        "height": "56px",
        "background": "#3b82f6",
        "color": "#ffffff",
        "borderRadius": "12px",
        "fontSize": "16px",
        "fontWeight": "600"
      }
    }
  }
}
```

---

## 🔄 Section 7: Loading States

### Skeleton Card

```
┌─────────────────────────────────────┐
│  ┌─────────┐                        │
│  │░░░░░░░░░│  ░░░░░░░░░░░░░        │
│  │░░░░░░░░░│  ░░░░░░░░░░           │
│  │░░░░░░░░░│  ░░░░░░░░             │
│  └─────────┘                        │
│              ░░░░░░░░░              │
│              ░░░░░░░                │
└─────────────────────────────────────┘
```

### Loading Schema

```json
{
  "component": "SkeletonCard",
  "count": 5,
  "styling": {
    "background": "#f8fafc",
    "shimmer": true,
    "shimmerColor": "#e5e7eb",
    "animationDuration": "1.5s"
  }
}
```

---

## 🚫 Section 8: Empty States

### No Results

```
┌─────────────────────────────────────┐
│                                     │
│           🔍                        │
│                                     │
│      No Cars Found                  │
│                                     │
│   Try adjusting your filters        │
│   or search criteria                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Clear Filters           │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Empty State Schema

```json
{
  "component": "EmptyState",
  "icon": "🔍",
  "title": "No Cars Found",
  "description": "Try adjusting your filters or search criteria",
  "action": {
    "label": "Clear Filters",
    "callback": "clearFilters"
  },
  "styling": {
    "padding": "64px 24px",
    "textAlign": "center",
    "iconSize": "64px",
    "titleSize": "20px",
    "titleColor": "#1f2937",
    "descriptionSize": "14px",
    "descriptionColor": "#6b7280"
  }
}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
```json
{
  "layout": "single-column",
  "cardLayout": "list",
  "filterChips": "horizontal-scroll",
  "padding": "16px",
  "cardsPerPage": 10
}
```

### Tablet (768px - 1024px)
```json
{
  "layout": "two-column",
  "cardLayout": "grid",
  "gridColumns": 2,
  "padding": "24px",
  "cardsPerPage": 20
}
```

---

## 🎯 Interactions & Gestures

### Swipe Actions
```json
{
  "swipeLeft": {
    "action": "like",
    "icon": "♥",
    "color": "#ef4444"
  },
  "swipeRight": {
    "action": "viewDetails",
    "icon": "→",
    "color": "#3b82f6"
  }
}
```

### Pull to Refresh
```json
{
  "enabled": true,
  "threshold": 80,
  "animation": "spinner",
  "color": "#3b82f6"
}
```

### Infinite Scroll
```json
{
  "enabled": true,
  "threshold": 200,
  "loadMoreCount": 10,
  "showLoader": true
}
```

---

## 🎨 Color Scheme Summary

```css
/* Primary */
--primary: #3b82f6;
--primary-dark: #2563eb;
--primary-light: #eff6ff;

/* Text */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-muted: #9ca3af;

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;

/* Border */
--border-light: #e5e7eb;
--border-medium: #d1d5db;

/* Status */
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
```

---

*Design specifications for CarTrade India Buy/Browse Cars page - Mobile App*
