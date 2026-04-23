# CarTrade India - Car Listing/Upload Flow Design Specifications

## 🎯 Overview

Multi-step form for dealers to list their cars for sale. The flow includes 5 steps: Basic Info, Car Details, Photos, Pricing, and Review.

---

## 📱 Flow Structure

```
Step 1: Basic Information
   ↓
Step 2: Car Details
   ↓
Step 3: Upload Photos
   ↓
Step 4: Pricing & Location
   ↓
Step 5: Review & Submit
   ↓
Success Screen
```

---

## 🎨 Progress Indicator

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━○━━━━○━━━━○━━━━○             │
│  1    2    3    4    5              │
│  Basic Details Photos Price Review  │
└─────────────────────────────────────┘
```

### Progress Schema

```json
{
  "component": "ProgressStepper",
  "totalSteps": 5,
  "currentStep": 1,
  "steps": [
    { "id": 1, "label": "Basic", "icon": "📝" },
    { "id": 2, "label": "Details", "icon": "🚗" },
    { "id": 3, "label": "Photos", "icon": "📷" },
    { "id": 4, "label": "Price", "icon": "💰" },
    { "id": 5, "label": "Review", "icon": "✓" }
  ],
  "styling": {
    "height": "60px",
    "padding": "16px",
    "background": "#ffffff",
    "borderBottom": "1px solid #e5e7eb"
  },
  "dotStyle": {
    "size": "12px",
    "activeColor": "#3b82f6",
    "inactiveColor": "#e5e7eb",
    "completedColor": "#10b981"
  },
  "lineStyle": {
    "height": "2px",
    "activeColor": "#3b82f6",
    "inactiveColor": "#e5e7eb"
  }
}
```

---

## 📝 Step 1: Basic Information

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━○━━━━○━━━━○━━━━○             │
│  Step 1 of 5: Basic Information     │
│                                     │
│  Brand *                            │
│  ┌─────────────────────────────┐   │
│  │ Select Brand            ▼   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Model *                            │
│  ┌─────────────────────────────┐   │
│  │ Select Model            ▼   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Variant                            │
│  ┌─────────────────────────────┐   │
│  │ Select Variant          ▼   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Year *                             │
│  ┌─────────────────────────────┐   │
│  │ 2020                    ▼   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Registration Number *              │
│  ┌─────────────────────────────┐   │
│  │ MH12AB1234                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Next: Car Details  →   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Schema

**Brand Field:**
```json
{
  "fieldName": "brand",
  "type": "dropdown",
  "label": "Brand",
  "required": true,
  "placeholder": "Select Brand",
  "options": [
    "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra",
    "Toyota", "Ford", "Renault", "Nissan", "Volkswagen",
    "Skoda", "Kia", "MG", "Jeep", "BMW", "Mercedes-Benz",
    "Audi", "Volvo", "Jaguar", "Land Rover"
  ],
  "searchable": true,
  "validation": {
    "required": true,
    "errorMessage": "Please select a brand"
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "border": "1px solid #e5e7eb"
  }
}
```

**Model Field:**
```json
{
  "fieldName": "model",
  "type": "dropdown",
  "label": "Model",
  "required": true,
  "placeholder": "Select Model",
  "dependsOn": "brand",
  "dynamicOptions": true,
  "searchable": true,
  "validation": {
    "required": true,
    "errorMessage": "Please select a model"
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Variant Field:**
```json
{
  "fieldName": "variant",
  "type": "dropdown",
  "label": "Variant",
  "required": false,
  "placeholder": "Select Variant (Optional)",
  "dependsOn": "model",
  "dynamicOptions": true,
  "searchable": true,
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Year Field:**
```json
{
  "fieldName": "year",
  "type": "dropdown",
  "label": "Year",
  "required": true,
  "placeholder": "Select Year",
  "options": "generateYears(2000, 2025)",
  "validation": {
    "required": true,
    "min": 2000,
    "max": 2025,
    "errorMessage": "Please select a valid year"
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Registration Number Field:**
```json
{
  "fieldName": "registrationNumber",
  "type": "text",
  "label": "Registration Number",
  "required": true,
  "placeholder": "MH12AB1234",
  "maxLength": 10,
  "textTransform": "uppercase",
  "validation": {
    "required": true,
    "pattern": "^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$",
    "errorMessages": {
      "required": "Registration number is required",
      "pattern": "Enter valid registration number (e.g., MH12AB1234)"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

---

## 🚗 Step 2: Car Details

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━●━━━━○━━━━○━━━━○             │
│  Step 2 of 5: Car Details           │
│                                     │
│  Fuel Type *                        │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │Petrol │ │Diesel │ │  CNG  │    │
│  └───────┘ └───────┘ └───────┘    │
│  ┌───────┐ ┌───────┐              │
│  │Electric│ │Hybrid │              │
│  └───────┘ └───────┘              │
│                                     │
│  Transmission *                     │
│  ┌─────────────┐ ┌─────────────┐  │
│  │   Manual    │ │  Automatic  │  │
│  └─────────────┘ └─────────────┘  │
│                                     │
│  Kilometers Driven *                │
│  ┌─────────────────────────────┐   │
│  │ 25000                       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Number of Owners *                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │ 1st│ │ 2nd│ │ 3rd│ │ 4+ │      │
│  └────┘ └────┘ └────┘ └────┘      │
│                                     │
│  Color                              │
│  ┌─────────────────────────────┐   │
│  │ White                   ▼   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Insurance Valid Till               │
│  ┌─────────────────────────────┐   │
│  │ 📅 Select Date              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Next: Upload Photos  →   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Schema

**Fuel Type Field:**
```json
{
  "fieldName": "fuelType",
  "type": "buttonGroup",
  "label": "Fuel Type",
  "required": true,
  "options": [
    { "value": "petrol", "label": "Petrol", "icon": "⛽" },
    { "value": "diesel", "label": "Diesel", "icon": "⛽" },
    { "value": "cng", "label": "CNG", "icon": "🔋" },
    { "value": "electric", "label": "Electric", "icon": "⚡" },
    { "value": "hybrid", "label": "Hybrid", "icon": "🔋" }
  ],
  "layout": "grid",
  "columns": 3,
  "validation": {
    "required": true,
    "errorMessage": "Please select fuel type"
  },
  "styling": {
    "buttonHeight": "56px",
    "fontSize": "14px",
    "borderRadius": "12px",
    "gap": "12px"
  },
  "states": {
    "default": {
      "background": "#ffffff",
      "border": "1px solid #e5e7eb",
      "color": "#1f2937"
    },
    "selected": {
      "background": "#eff6ff",
      "border": "2px solid #3b82f6",
      "color": "#3b82f6"
    }
  }
}
```

**Transmission Field:**
```json
{
  "fieldName": "transmission",
  "type": "buttonGroup",
  "label": "Transmission",
  "required": true,
  "options": [
    { "value": "manual", "label": "Manual", "icon": "🔧" },
    { "value": "automatic", "label": "Automatic", "icon": "⚙️" }
  ],
  "layout": "horizontal",
  "validation": {
    "required": true,
    "errorMessage": "Please select transmission type"
  },
  "styling": {
    "buttonHeight": "56px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "gap": "12px"
  }
}
```

**Kilometers Driven Field:**
```json
{
  "fieldName": "mileage",
  "type": "number",
  "label": "Kilometers Driven",
  "required": true,
  "placeholder": "25000",
  "suffix": "km",
  "validation": {
    "required": true,
    "min": 0,
    "max": 1000000,
    "errorMessages": {
      "required": "Kilometers driven is required",
      "min": "Must be 0 or greater",
      "max": "Value seems too high"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Number of Owners Field:**
```json
{
  "fieldName": "owners",
  "type": "buttonGroup",
  "label": "Number of Owners",
  "required": true,
  "options": [
    { "value": 1, "label": "1st Owner" },
    { "value": 2, "label": "2nd Owner" },
    { "value": 3, "label": "3rd Owner" },
    { "value": 4, "label": "4+ Owners" }
  ],
  "layout": "horizontal",
  "validation": {
    "required": true,
    "errorMessage": "Please select number of owners"
  },
  "styling": {
    "buttonHeight": "56px",
    "fontSize": "14px",
    "borderRadius": "12px",
    "gap": "8px"
  }
}
```

**Color Field:**
```json
{
  "fieldName": "color",
  "type": "dropdown",
  "label": "Color",
  "required": false,
  "placeholder": "Select Color",
  "options": [
    "White", "Black", "Silver", "Grey", "Red",
    "Blue", "Brown", "Green", "Yellow", "Orange"
  ],
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Insurance Valid Till Field:**
```json
{
  "fieldName": "insuranceValidTill",
  "type": "date",
  "label": "Insurance Valid Till",
  "required": false,
  "placeholder": "Select Date",
  "minDate": "today",
  "maxDate": "+5years",
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

---

## 📷 Step 3: Upload Photos

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━●━━━━●━━━━○━━━━○             │
│  Step 3 of 5: Upload Photos         │
│                                     │
│  Add at least 5 photos              │
│  (Max 20 photos, 5MB each)          │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │  [📷]  │ │  [IMG]  │ │  [IMG]  ││
│  │ Upload  │ │   [×]   │ │   [×]   ││
│  └─────────┘ └─────────┘ └─────────┘│
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │  [IMG]  │ │  [IMG]  │ │  [+]    ││
│  │   [×]   │ │   [×]   │ │  Add    ││
│  └─────────┘ └─────────┘ └─────────┘│
│                                     │
│  Tips for better photos:            │
│  • Clean the car before photos      │
│  • Take photos in good lighting     │
│  • Include all angles               │
│  • Show interior and exterior       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Next: Pricing & Location →│   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Photo Upload Schema

```json
{
  "component": "PhotoUploader",
  "minPhotos": 5,
  "maxPhotos": 20,
  "maxFileSize": 5242880,
  "acceptedFormats": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  "validation": {
    "minPhotos": {
      "value": 5,
      "errorMessage": "Please upload at least 5 photos"
    },
    "maxPhotos": {
      "value": 20,
      "errorMessage": "Maximum 20 photos allowed"
    },
    "fileSize": {
      "value": 5242880,
      "errorMessage": "Each photo must be less than 5MB"
    },
    "format": {
      "errorMessage": "Only JPEG, PNG, and WebP formats allowed"
    }
  },
  "features": {
    "camera": true,
    "gallery": true,
    "reorder": true,
    "delete": true,
    "compress": true,
    "preview": true
  },
  "styling": {
    "gridColumns": 3,
    "gap": "12px",
    "thumbnailSize": "100px",
    "borderRadius": "12px"
  },
  "uploadButton": {
    "icon": "📷",
    "label": "Upload Photo",
    "background": "#f8fafc",
    "border": "2px dashed #d1d5db",
    "hoverBackground": "#eff6ff"
  },
  "thumbnail": {
    "deleteButton": {
      "icon": "×",
      "position": "top-right",
      "size": "24px",
      "background": "rgba(0, 0, 0, 0.6)",
      "color": "#ffffff"
    },
    "dragHandle": true
  }
}
```

---

## 💰 Step 4: Pricing & Location

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━●━━━━●━━━━●━━━━○             │
│  Step 4 of 5: Pricing & Location    │
│                                     │
│  Asking Price *                     │
│  ┌─────────────────────────────┐   │
│  │ ₹ 545000                    │   │
│  └─────────────────────────────┘   │
│  💡 Suggested: ₹5,20,000 - ₹5,70,000│
│                                     │
│  Negotiable?                        │
│  ┌──────────┐ ┌──────────┐         │
│  │   Yes    │ │    No    │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  City *                             │
│  ┌─────────────────────────────┐   │
│  │ 📍 Mumbai              ▼    │   │
│  └─────────────────────────────┘   │
│                                     │
│  Description                        │
│  ┌─────────────────────────────┐   │
│  │ Well maintained car...      │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│  0/500 characters                   │
│                                     │
│  Features (Optional)                │
│  ☐ ABS  ☐ Airbags  ☐ AC           │
│  ☐ Power Steering  ☐ Sunroof       │
│  ☐ Alloy Wheels  ☐ Parking Sensors │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Next: Review & Submit  →  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Schema

**Asking Price Field:**
```json
{
  "fieldName": "price",
  "type": "number",
  "label": "Asking Price",
  "required": true,
  "placeholder": "545000",
  "prefix": "₹",
  "format": "currency",
  "validation": {
    "required": true,
    "min": 10000,
    "max": 100000000,
    "errorMessages": {
      "required": "Price is required",
      "min": "Price must be at least ₹10,000",
      "max": "Price must be less than ₹10 crores"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "18px",
    "fontWeight": "600",
    "borderRadius": "12px"
  },
  "helper": {
    "type": "suggestion",
    "text": "Suggested: ₹{min} - ₹{max}",
    "icon": "💡",
    "color": "#3b82f6"
  }
}
```

**Negotiable Field:**
```json
{
  "fieldName": "negotiable",
  "type": "buttonGroup",
  "label": "Negotiable?",
  "required": false,
  "options": [
    { "value": true, "label": "Yes" },
    { "value": false, "label": "No" }
  ],
  "default": true,
  "layout": "horizontal",
  "styling": {
    "buttonHeight": "48px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "gap": "12px"
  }
}
```

**City Field:**
```json
{
  "fieldName": "city",
  "type": "dropdown",
  "label": "City",
  "required": true,
  "placeholder": "Select City",
  "icon": "📍",
  "searchable": true,
  "options": "fetchCitiesFromAPI",
  "validation": {
    "required": true,
    "errorMessage": "Please select a city"
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Description Field:**
```json
{
  "fieldName": "description",
  "type": "textarea",
  "label": "Description",
  "required": false,
  "placeholder": "Describe your car's condition, service history, etc.",
  "maxLength": 500,
  "showCounter": true,
  "validation": {
    "maxLength": 500
  },
  "styling": {
    "height": "120px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "resize": "vertical"
  }
}
```

**Features Field:**
```json
{
  "fieldName": "features",
  "type": "checkbox",
  "label": "Features (Optional)",
  "required": false,
  "options": [
    { "value": "abs", "label": "ABS" },
    { "value": "airbags", "label": "Airbags" },
    { "value": "ac", "label": "Air Conditioning" },
    { "value": "powerSteering", "label": "Power Steering" },
    { "value": "sunroof", "label": "Sunroof" },
    { "value": "alloyWheels", "label": "Alloy Wheels" },
    { "value": "parkingSensors", "label": "Parking Sensors" },
    { "value": "reverseCamera", "label": "Reverse Camera" },
    { "value": "bluetooth", "label": "Bluetooth" },
    { "value": "musicSystem", "label": "Music System" }
  ],
  "layout": "grid",
  "columns": 2,
  "styling": {
    "gap": "12px",
    "fontSize": "14px"
  }
}
```

---

*Continued in next part...*


## ✓ Step 5: Review & Submit

### Visual Design

```
┌─────────────────────────────────────┐
│  ●━━━━●━━━━●━━━━●━━━━●             │
│  Step 5 of 5: Review & Submit       │
│                                     │
│  Review Your Listing                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Photo Gallery Preview]    │   │
│  │  ← 1/5 →                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  Basic Information          [Edit]  │
│  ────────────────────────────────   │
│  Maruti Swift VXI                   │
│  2020 • Petrol • Manual             │
│  MH12AB1234                         │
│                                     │
│  Car Details                [Edit]  │
│  ────────────────────────────────   │
│  25,000 km • 1st Owner              │
│  White • Insurance: Dec 2024        │
│                                     │
│  Pricing & Location         [Edit]  │
│  ────────────────────────────────   │
│  ₹5,45,000 (Negotiable)            │
│  📍 Mumbai                          │
│                                     │
│  ☐ I agree to Terms & Conditions    │
│  ☐ I confirm all details are correct│
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Submit for Approval       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⓘ Your listing will be reviewed    │
│     within 24 hours                 │
│                                     │
└─────────────────────────────────────┘
```

### Review Screen Schema

```json
{
  "component": "ReviewScreen",
  "sections": [
    {
      "id": "photos",
      "title": "Photos",
      "component": "PhotoGallery",
      "editable": true,
      "editStep": 3
    },
    {
      "id": "basicInfo",
      "title": "Basic Information",
      "editable": true,
      "editStep": 1,
      "fields": [
        { "label": "Car", "value": "{brand} {model} {variant}" },
        { "label": "Year", "value": "{year}" },
        { "label": "Fuel", "value": "{fuelType}" },
        { "label": "Transmission", "value": "{transmission}" },
        { "label": "Registration", "value": "{registrationNumber}" }
      ]
    },
    {
      "id": "carDetails",
      "title": "Car Details",
      "editable": true,
      "editStep": 2,
      "fields": [
        { "label": "Kilometers", "value": "{mileage} km" },
        { "label": "Owners", "value": "{owners}" },
        { "label": "Color", "value": "{color}" },
        { "label": "Insurance", "value": "{insuranceValidTill}" }
      ]
    },
    {
      "id": "pricing",
      "title": "Pricing & Location",
      "editable": true,
      "editStep": 4,
      "fields": [
        { "label": "Price", "value": "₹{price}", "highlight": true },
        { "label": "Negotiable", "value": "{negotiable}" },
        { "label": "Location", "value": "{city}" },
        { "label": "Description", "value": "{description}" },
        { "label": "Features", "value": "{features}" }
      ]
    }
  ],
  "agreements": [
    {
      "id": "terms",
      "label": "I agree to Terms & Conditions",
      "required": true,
      "link": "/terms"
    },
    {
      "id": "accuracy",
      "label": "I confirm all details are correct",
      "required": true
    }
  ],
  "submitButton": {
    "label": "Submit for Approval",
    "action": "submitListing",
    "styling": {
      "height": "56px",
      "background": "#3b82f6",
      "color": "#ffffff",
      "fontSize": "16px",
      "fontWeight": "600",
      "borderRadius": "12px"
    },
    "loadingText": "Submitting...",
    "disabledUntil": "allAgreementsChecked"
  },
  "infoBox": {
    "icon": "ⓘ",
    "text": "Your listing will be reviewed within 24 hours",
    "styling": {
      "background": "#eff6ff",
      "color": "#3b82f6",
      "padding": "12px",
      "borderRadius": "8px",
      "fontSize": "14px"
    }
  }
}
```

---

## ✅ Success Screen

### Visual Design

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ✓                        │
│         ━━━━━━━                     │
│                                     │
│    Listing Submitted!               │
│                                     │
│  Your car listing has been          │
│  submitted for approval             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Maruti Swift VXI           │   │
│  │  2020 • ₹5,45,000          │   │
│  │  Status: Pending Review     │   │
│  └─────────────────────────────┘   │
│                                     │
│  What happens next?                 │
│  1. Our team reviews your listing   │
│  2. You'll get notified in 24 hours │
│  3. Once approved, it goes live     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   View My Listings          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   List Another Car          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Success Screen Schema

```json
{
  "component": "SuccessScreen",
  "icon": "✓",
  "iconColor": "#10b981",
  "iconSize": "80px",
  "title": "Listing Submitted!",
  "message": "Your car listing has been submitted for approval",
  "carSummary": {
    "show": true,
    "fields": [
      "{brand} {model} {variant}",
      "{year} • ₹{price}",
      "Status: Pending Review"
    ],
    "styling": {
      "background": "#f8fafc",
      "padding": "16px",
      "borderRadius": "12px",
      "border": "1px solid #e5e7eb"
    }
  },
  "timeline": {
    "title": "What happens next?",
    "steps": [
      "Our team reviews your listing",
      "You'll get notified in 24 hours",
      "Once approved, it goes live"
    ],
    "styling": {
      "fontSize": "14px",
      "color": "#6b7280",
      "lineHeight": "1.8"
    }
  },
  "actions": [
    {
      "label": "View My Listings",
      "action": "navigate",
      "route": "/profile/listings",
      "type": "primary",
      "styling": {
        "height": "56px",
        "background": "#3b82f6",
        "color": "#ffffff",
        "borderRadius": "12px"
      }
    },
    {
      "label": "List Another Car",
      "action": "navigate",
      "route": "/upload-car",
      "type": "secondary",
      "styling": {
        "height": "56px",
        "background": "#ffffff",
        "color": "#3b82f6",
        "border": "2px solid #3b82f6",
        "borderRadius": "12px"
      }
    }
  ]
}
```

---

## 🎨 Common Components

### Navigation Buttons

```json
{
  "component": "NavigationButtons",
  "layout": "fixed-bottom",
  "buttons": {
    "back": {
      "label": "← Back",
      "show": "step > 1",
      "action": "previousStep",
      "styling": {
        "height": "56px",
        "width": "48%",
        "background": "#ffffff",
        "color": "#1f2937",
        "border": "1px solid #e5e7eb",
        "borderRadius": "12px"
      }
    },
    "next": {
      "label": "Next →",
      "show": "step < 5",
      "action": "nextStep",
      "disabled": "!isStepValid",
      "styling": {
        "height": "56px",
        "width": "48%",
        "background": "#3b82f6",
        "color": "#ffffff",
        "borderRadius": "12px"
      }
    },
    "submit": {
      "label": "Submit",
      "show": "step === 5",
      "action": "submitForm",
      "disabled": "!allAgreementsChecked",
      "styling": {
        "height": "56px",
        "width": "100%",
        "background": "#3b82f6",
        "color": "#ffffff",
        "borderRadius": "12px"
      }
    }
  },
  "styling": {
    "position": "fixed",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "padding": "16px",
    "background": "#ffffff",
    "borderTop": "1px solid #e5e7eb",
    "gap": "12px"
  }
}
```

### Save Draft Button

```json
{
  "component": "SaveDraftButton",
  "label": "💾 Save Draft",
  "position": "top-right",
  "action": "saveDraft",
  "styling": {
    "height": "40px",
    "padding": "8px 16px",
    "background": "#f8fafc",
    "color": "#6b7280",
    "border": "1px solid #e5e7eb",
    "borderRadius": "8px",
    "fontSize": "14px"
  },
  "behavior": {
    "autoSave": true,
    "autoSaveInterval": 30000,
    "showToast": true,
    "toastMessage": "Draft saved"
  }
}
```

---

## 📋 Validation Rules

### Step-by-Step Validation

```json
{
  "step1": {
    "required": ["brand", "model", "year", "registrationNumber"],
    "canProceed": "allRequiredFieldsFilled"
  },
  "step2": {
    "required": ["fuelType", "transmission", "mileage", "owners"],
    "canProceed": "allRequiredFieldsFilled"
  },
  "step3": {
    "required": ["photos"],
    "minPhotos": 5,
    "canProceed": "photos.length >= 5"
  },
  "step4": {
    "required": ["price", "city"],
    "canProceed": "allRequiredFieldsFilled"
  },
  "step5": {
    "required": ["agreements"],
    "canProceed": "allAgreementsChecked"
  }
}
```

---

## 💾 Data Persistence

### Auto-Save Schema

```json
{
  "feature": "AutoSave",
  "enabled": true,
  "interval": 30000,
  "storage": "localStorage",
  "key": "carListingDraft_{userId}",
  "events": [
    "onFieldChange",
    "onStepChange",
    "onAppBackground"
  ],
  "recovery": {
    "enabled": true,
    "prompt": "You have an unsaved draft. Continue?",
    "actions": ["Continue", "Start Fresh"]
  }
}
```

---

## 🎭 Animations

### Step Transitions

```css
.step-enter {
  animation: slideInRight 0.3s ease-out;
}

.step-exit {
  animation: slideOutLeft 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
```

### Success Animation

```css
.success-icon {
  animation: scaleIn 0.5s ease-out, pulse 2s infinite 0.5s;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

---

## 📱 Platform-Specific Features

### iOS
- Native photo picker
- Haptic feedback on step completion
- Swipe back gesture
- Native date picker

### Android
- Material Design bottom sheets
- Native photo picker
- Vibration feedback
- Material date picker

---

## 🔒 Security & Privacy

### Data Handling

```json
{
  "security": {
    "imageCompression": true,
    "maxImageSize": 5242880,
    "stripMetadata": true,
    "encryptDraft": false,
    "validateOnServer": true
  },
  "privacy": {
    "hidePersonalInfo": true,
    "blurRegistrationNumber": false,
    "requireConsent": true
  }
}
```

---

## 📊 Analytics Events

```json
{
  "events": [
    {
      "name": "listing_started",
      "trigger": "step1_loaded"
    },
    {
      "name": "step_completed",
      "trigger": "step_next_clicked",
      "params": ["step_number", "time_spent"]
    },
    {
      "name": "listing_submitted",
      "trigger": "submit_success",
      "params": ["car_brand", "car_model", "price"]
    },
    {
      "name": "listing_abandoned",
      "trigger": "app_closed",
      "params": ["last_step", "completion_percentage"]
    }
  ]
}
```

---

*Car Listing Flow Design Specifications for CarTrade India Mobile App*
