# CarTrade India - Dealers Section Design Specifications

## 🎯 Overview

The Dealers section allows users to browse verified dealers, view their showrooms, follow dealers, and see their car inventory.

---

## 📱 Section Structure

```
1. Dealers List Page
   ├── Search & Filters
   ├── Dealer Cards
   └── Pagination
   
2. Dealer Profile/Showroom Page
   ├── Dealer Header
   ├── Stats & Info
   ├── Car Inventory
   └── Contact Section
   
3. Follow/Unfollow System
```

---

## 🏪 Page 1: Dealers List

### Visual Design

```
┌─────────────────────────────────────┐
│  [Header: Dealers]                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Search dealers...        │   │
│  └─────────────────────────────┘   │
│                                     │
│  [All] [Mumbai] [Delhi] [Verified] │
│  ← → (Horizontal Scroll)            │
│                                     │
│  234 Verified Dealers               │
│  Sort: Rating ▼                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Avatar]  Dealer Name      │   │
│  │  ⭐ 4.8 • 45 Cars          │   │
│  │  📍 Mumbai • ✓ Verified    │   │
│  │  [Follow] [View Showroom]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Avatar]  Dealer Name      │   │
│  │  ⭐ 4.6 • 32 Cars          │   │
│  │  📍 Delhi • ✓ Verified     │   │
│  │  [Following] [View Showroom]│   │
│  └─────────────────────────────┘   │
│                                     │
│  [Load More]                        │
│                                     │
└─────────────────────────────────────┘
```

### Search Bar Schema

```json
{
  "component": "SearchBar",
  "placeholder": "Search dealers by name or location...",
  "icon": "🔍",
  "styling": {
    "height": "48px",
    "padding": "0 16px 0 48px",
    "fontSize": "16px",
    "background": "#f8fafc",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb",
    "marginBottom": "16px"
  },
  "behavior": {
    "debounce": 300,
    "minChars": 2,
    "showSuggestions": true,
    "clearButton": true
  }
}
```

### Filter Chips Schema

```json
{
  "component": "FilterChips",
  "chips": [
    {
      "id": "all",
      "label": "All",
      "default": true
    },
    {
      "id": "location",
      "label": "Location",
      "type": "dropdown",
      "options": ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"]
    },
    {
      "id": "verified",
      "label": "Verified Only",
      "type": "toggle"
    },
    {
      "id": "rating",
      "label": "Rating 4+",
      "type": "toggle"
    }
  ],
  "styling": {
    "height": "40px",
    "padding": "8px 16px",
    "fontSize": "14px",
    "borderRadius": "20px",
    "gap": "8px",
    "marginBottom": "16px"
  },
  "activeStyle": {
    "background": "#eff6ff",
    "color": "#3b82f6",
    "border": "1px solid #3b82f6"
  }
}
```

### Dealer Card Schema

```json
{
  "component": "DealerCard",
  "layout": "list",
  "data": {
    "id": "dealer-123",
    "name": "Premium Auto Sales",
    "avatar": "url",
    "rating": 4.8,
    "totalCars": 45,
    "location": "Mumbai",
    "verified": true,
    "followers": 1234,
    "isFollowing": false,
    "dealerCode": "DLR0001234"
  },
  "styling": {
    "padding": "16px",
    "background": "#ffffff",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb",
    "marginBottom": "12px",
    "shadow": "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  "sections": {
    "header": {
      "avatar": {
        "size": "56px",
        "borderRadius": "50%",
        "border": "2px solid #e5e7eb"
      },
      "name": {
        "fontSize": "18px",
        "fontWeight": "600",
        "color": "#1f2937",
        "marginBottom": "4px"
      },
      "badge": {
        "show": "verified",
        "icon": "✓",
        "text": "Verified",
        "background": "#10b981",
        "color": "#ffffff",
        "fontSize": "11px",
        "padding": "2px 8px",
        "borderRadius": "12px"
      }
    },
    "stats": {
      "layout": "horizontal",
      "items": [
        {
          "icon": "⭐",
          "value": "{rating}",
          "color": "#f59e0b"
        },
        {
          "icon": "🚗",
          "value": "{totalCars} Cars",
          "color": "#6b7280"
        },
        {
          "icon": "📍",
          "value": "{location}",
          "color": "#6b7280"
        }
      ],
      "fontSize": "14px",
      "gap": "12px",
      "marginTop": "8px"
    },
    "actions": {
      "layout": "horizontal",
      "gap": "8px",
      "marginTop": "12px",
      "buttons": [
        {
          "id": "follow",
          "label": "Follow",
          "labelFollowing": "Following",
          "icon": "➕",
          "iconFollowing": "✓",
          "action": "toggleFollow",
          "styling": {
            "height": "40px",
            "padding": "8px 16px",
            "fontSize": "14px",
            "fontWeight": "600",
            "borderRadius": "8px"
          },
          "states": {
            "default": {
              "background": "#eff6ff",
              "color": "#3b82f6",
              "border": "1px solid #3b82f6"
            },
            "following": {
              "background": "#10b981",
              "color": "#ffffff",
              "border": "none"
            }
          }
        },
        {
          "id": "viewShowroom",
          "label": "View Showroom",
          "icon": "→",
          "action": "navigate",
          "route": "/dealers/{id}",
          "styling": {
            "height": "40px",
            "padding": "8px 16px",
            "fontSize": "14px",
            "fontWeight": "600",
            "background": "#3b82f6",
            "color": "#ffffff",
            "borderRadius": "8px"
          }
        }
      ]
    }
  }
}
```

---

## 🏢 Page 2: Dealer Profile/Showroom

### Visual Design

```
┌─────────────────────────────────────┐
│  [← Back]                    [⋮]    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     [Cover Image]           │   │
│  │                             │   │
│  │  [Avatar]                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Premium Auto Sales                 │
│  ✓ Verified Dealer                  │
│  ⭐ 4.8 (234 reviews)              │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 45   │ │ 1.2K │ │ 98%  │       │
│  │ Cars │ │Follow│ │ Happy│       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  [Following ✓] [📞 Call] [💬 Chat] │
│                                     │
│  About                              │
│  ────────────────────────────────   │
│  Trusted dealer since 2015...       │
│  [Read More]                        │
│                                     │
│  Location                           │
│  ────────────────────────────────   │
│  📍 Andheri West, Mumbai            │
│  [View on Map]                      │
│                                     │
│  Dealer Code: DLR0001234            │
│  [QR Code] [Share]                  │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                     │
│  Cars Available (45)                │
│  [All] [Sedan] [SUV] [Hatchback]   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Car Card 1]               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Car Card 2]               │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Dealer Header Schema

```json
{
  "component": "DealerHeader",
  "sections": {
    "coverImage": {
      "height": "180px",
      "defaultImage": "gradient",
      "overlay": true
    },
    "avatar": {
      "size": "80px",
      "position": "bottom-left",
      "offset": "-40px",
      "border": "4px solid #ffffff",
      "borderRadius": "50%"
    },
    "info": {
      "name": {
        "fontSize": "24px",
        "fontWeight": "700",
        "color": "#1f2937",
        "marginTop": "48px"
      },
      "verified": {
        "show": true,
        "icon": "✓",
        "text": "Verified Dealer",
        "color": "#10b981",
        "fontSize": "14px",
        "fontWeight": "600"
      },
      "rating": {
        "show": true,
        "icon": "⭐",
        "value": "{rating}",
        "reviewCount": "({reviewCount} reviews)",
        "fontSize": "14px",
        "color": "#6b7280"
      }
    }
  }
}
```

### Stats Cards Schema

```json
{
  "component": "StatsCards",
  "layout": "grid",
  "columns": 3,
  "gap": "12px",
  "cards": [
    {
      "id": "totalCars",
      "value": "{totalCars}",
      "label": "Cars",
      "icon": "🚗",
      "color": "#3b82f6"
    },
    {
      "id": "followers",
      "value": "{followers}",
      "label": "Followers",
      "icon": "👥",
      "color": "#10b981"
    },
    {
      "id": "satisfaction",
      "value": "{satisfaction}%",
      "label": "Happy Customers",
      "icon": "😊",
      "color": "#f59e0b"
    }
  ],
  "styling": {
    "height": "80px",
    "padding": "12px",
    "background": "#f8fafc",
    "borderRadius": "12px",
    "textAlign": "center"
  },
  "valueStyle": {
    "fontSize": "24px",
    "fontWeight": "700",
    "color": "#1f2937"
  },
  "labelStyle": {
    "fontSize": "12px",
    "color": "#6b7280",
    "marginTop": "4px"
  }
}
```

### Action Buttons Schema

```json
{
  "component": "ActionButtons",
  "layout": "horizontal",
  "gap": "8px",
  "buttons": [
    {
      "id": "follow",
      "label": "Following",
      "icon": "✓",
      "action": "toggleFollow",
      "type": "primary",
      "styling": {
        "flex": 1,
        "height": "48px",
        "background": "#10b981",
        "color": "#ffffff",
        "borderRadius": "12px",
        "fontSize": "16px",
        "fontWeight": "600"
      }
    },
    {
      "id": "call",
      "icon": "📞",
      "action": "makeCall",
      "type": "secondary",
      "styling": {
        "width": "48px",
        "height": "48px",
        "background": "#eff6ff",
        "color": "#3b82f6",
        "borderRadius": "12px",
        "border": "1px solid #3b82f6"
      }
    },
    {
      "id": "chat",
      "icon": "💬",
      "action": "openChat",
      "type": "secondary",
      "styling": {
        "width": "48px",
        "height": "48px",
        "background": "#eff6ff",
        "color": "#3b82f6",
        "borderRadius": "12px",
        "border": "1px solid #3b82f6"
      }
    }
  ]
}
```

### About Section Schema

```json
{
  "component": "AboutSection",
  "title": "About",
  "content": "{description}",
  "maxLines": 3,
  "expandable": true,
  "expandText": "Read More",
  "collapseText": "Show Less",
  "styling": {
    "padding": "16px 0",
    "fontSize": "14px",
    "lineHeight": "1.6",
    "color": "#6b7280"
  },
  "fields": [
    {
      "label": "Established",
      "value": "{establishedYear}",
      "icon": "📅"
    },
    {
      "label": "Specialization",
      "value": "{specialization}",
      "icon": "🎯"
    },
    {
      "label": "Languages",
      "value": "{languages}",
      "icon": "🗣️"
    }
  ]
}
```

### Location Section Schema

```json
{
  "component": "LocationSection",
  "title": "Location",
  "address": "{fullAddress}",
  "city": "{city}",
  "coordinates": {
    "latitude": "{latitude}",
    "longitude": "{longitude}"
  },
  "styling": {
    "padding": "16px 0"
  },
  "mapPreview": {
    "show": true,
    "height": "150px",
    "borderRadius": "12px",
    "interactive": false
  },
  "actions": [
    {
      "label": "View on Map",
      "icon": "🗺️",
      "action": "openMap"
    },
    {
      "label": "Get Directions",
      "icon": "🧭",
      "action": "getDirections"
    }
  ]
}
```

### Dealer Code & QR Section Schema

```json
{
  "component": "DealerCodeSection",
  "dealerCode": "{dealerCode}",
  "styling": {
    "padding": "16px",
    "background": "#f8fafc",
    "borderRadius": "12px",
    "marginTop": "16px"
  },
  "codeDisplay": {
    "label": "Dealer Code",
    "value": "{dealerCode}",
    "fontSize": "18px",
    "fontWeight": "700",
    "fontFamily": "monospace",
    "copyButton": true
  },
  "qrCode": {
    "show": true,
    "size": "120px",
    "action": "showQRModal"
  },
  "shareButton": {
    "label": "Share Profile",
    "icon": "📤",
    "action": "shareProfile"
  }
}
```

### Car Inventory Section Schema

```json
{
  "component": "CarInventory",
  "title": "Cars Available",
  "count": "{totalCars}",
  "filters": [
    { "id": "all", "label": "All", "default": true },
    { "id": "sedan", "label": "Sedan" },
    { "id": "suv", "label": "SUV" },
    { "id": "hatchback", "label": "Hatchback" },
    { "id": "luxury", "label": "Luxury" }
  ],
  "layout": "list",
  "carCard": {
    "component": "CarCard",
    "layout": "compact",
    "showDealerInfo": false
  },
  "pagination": {
    "type": "infiniteScroll",
    "itemsPerPage": 10
  }
}
```

---

## 👥 Follow/Unfollow System

### Follow Button States

```json
{
  "component": "FollowButton",
  "states": {
    "notFollowing": {
      "label": "Follow",
      "icon": "➕",
      "background": "#eff6ff",
      "color": "#3b82f6",
      "border": "1px solid #3b82f6"
    },
    "following": {
      "label": "Following",
      "icon": "✓",
      "background": "#10b981",
      "color": "#ffffff",
      "border": "none"
    },
    "loading": {
      "label": "...",
      "disabled": true,
      "showSpinner": true
    }
  },
  "hapticFeedback": true,
  "animation": "scale"
}
```

### Follow Confirmation Toast

```json
{
  "component": "Toast",
  "type": "success",
  "message": "You're now following {dealerName}",
  "icon": "✓",
  "duration": 3000,
  "position": "bottom",
  "styling": {
    "background": "#10b981",
    "color": "#ffffff",
    "borderRadius": "12px",
    "padding": "12px 16px"
  }
}
```

---

## 🔔 Notifications for Followed Dealers

### Notification Schema

```json
{
  "component": "DealerNotification",
  "types": {
    "newCar": {
      "title": "{dealerName} added a new car",
      "message": "{carBrand} {carModel} • ₹{price}",
      "icon": "🚗",
      "action": "viewCar",
      "actionLabel": "View Car"
    },
    "priceUpdate": {
      "title": "Price drop on {carBrand} {carModel}",
      "message": "Now ₹{newPrice} (was ₹{oldPrice})",
      "icon": "💰",
      "action": "viewCar",
      "actionLabel": "Check Now"
    },
    "newOffer": {
      "title": "{dealerName} has a special offer",
      "message": "{offerDescription}",
      "icon": "🎉",
      "action": "viewDealer",
      "actionLabel": "View Offer"
    }
  },
  "styling": {
    "padding": "12px",
    "background": "#ffffff",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb",
    "shadow": "0 2px 4px rgba(0, 0, 0, 0.1)"
  }
}
```

---

## 📊 Dealer Reviews Section

### Visual Design

```
┌─────────────────────────────────────┐
│  Reviews (234)                      │
│  ────────────────────────────────   │
│                                     │
│  ⭐ 4.8 out of 5                   │
│  ★★★★★ 180                         │
│  ★★★★☆  40                         │
│  ★★★☆☆   8                         │
│  ★★☆☆☆   4                         │
│  ★☆☆☆☆   2                         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  👤 John Doe                │   │
│  │  ⭐⭐⭐⭐⭐ 2 days ago       │   │
│  │  Great service! Bought...   │   │
│  │  [Read More]                │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Load More Reviews]                │
│                                     │
└─────────────────────────────────────┘
```

### Reviews Schema

```json
{
  "component": "ReviewsSection",
  "title": "Reviews",
  "totalReviews": "{reviewCount}",
  "averageRating": "{rating}",
  "ratingDistribution": {
    "5": 180,
    "4": 40,
    "3": 8,
    "2": 4,
    "1": 2
  },
  "reviewCard": {
    "avatar": {
      "size": "40px",
      "borderRadius": "50%"
    },
    "name": {
      "fontSize": "16px",
      "fontWeight": "600",
      "color": "#1f2937"
    },
    "rating": {
      "icon": "⭐",
      "size": "14px"
    },
    "date": {
      "fontSize": "12px",
      "color": "#9ca3af"
    },
    "comment": {
      "fontSize": "14px",
      "color": "#6b7280",
      "maxLines": 3,
      "expandable": true
    }
  },
  "pagination": {
    "type": "loadMore",
    "itemsPerPage": 5
  }
}
```

---

## 🎨 Color Scheme

```css
/* Dealer Section Colors */
--dealer-primary: #3b82f6;
--dealer-verified: #10b981;
--dealer-rating: #f59e0b;
--dealer-background: #f8fafc;
--dealer-card-bg: #ffffff;
--dealer-border: #e5e7eb;
--dealer-text: #1f2937;
--dealer-text-light: #6b7280;
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
```json
{
  "dealerCard": {
    "layout": "vertical",
    "avatarSize": "56px",
    "padding": "16px"
  },
  "statsCards": {
    "columns": 3,
    "fontSize": "small"
  },
  "actionButtons": {
    "layout": "horizontal",
    "iconOnly": false
  }
}
```

### Tablet (768px+)
```json
{
  "dealerCard": {
    "layout": "horizontal",
    "avatarSize": "72px",
    "padding": "20px"
  },
  "statsCards": {
    "columns": 4,
    "fontSize": "medium"
  }
}
```

---

*Dealers Section Design Specifications for CarTrade India Mobile App*
