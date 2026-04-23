# CarTrade India - Login Page Design Specifications

## 🎨 Complete Design System

### Color Palette

#### Primary Colors
```css
--primary-blue: #3b82f6;
--primary-dark: #2563eb;
--primary-light: #60a5fa;
--primary-50: #eff6ff;
--primary-100: #dbeafe;
```

#### Status Colors
```css
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

#### Neutral Colors
```css
--white: #ffffff;
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography Scale

```css
/* Headings */
--h1: 32px / 700 / -0.5px
--h2: 28px / 700 / -0.3px
--h3: 24px / 600 / -0.2px
--h4: 20px / 600 / 0px

/* Body */
--body-large: 18px / 400 / 0px
--body: 16px / 400 / 0px
--body-small: 14px / 400 / 0px

/* Labels */
--label: 14px / 500 / 0px
--label-small: 12px / 500 / 0px

/* Buttons */
--button: 16px / 600 / 0px
--button-small: 14px / 600 / 0px
```

### Spacing System

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Border Radius

```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15)
```

---

## 📱 Screen 1: Welcome Screen

### Visual Design

```
┌─────────────────────────────────────┐
│                                     │
│              [Status Bar]           │
│                                     │
│         ╔═══════════════╗           │
│         ║   [C Logo]    ║           │
│         ║   Gradient    ║           │
│         ╚═══════════════╝           │
│                                     │
│         CarTrade India              │
│         ───────────────             │
│                                     │
│      India's #1 Used Car            │
│         Marketplace                 │
│                                     │
│                                     │
│    ┌─────────────────────────┐     │
│    │     👤 Customer         │     │
│    │                         │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │     🏪 Dealer           │     │
│    │                         │     │
│    └─────────────────────────┘     │
│                                     │
│                                     │
│    Continue with mobile number      │
│                                     │
│                                     │
│         [Illustration]              │
│                                     │
└─────────────────────────────────────┘
```

### Design Specifications

**Background:**
- Gradient: Linear from #eff6ff (top) to #ffffff (bottom)
- Safe area padding: 20px

**Logo:**
- Size: 80x80px
- Background: Gradient #3b82f6 to #2563eb
- Border radius: 16px
- Shadow: 0 10px 20px rgba(59, 130, 246, 0.3)

**Title:**
- Font: Bold, 32px
- Color: #1f2937
- Margin bottom: 8px

**Subtitle:**
- Font: Regular, 18px
- Color: #6b7280
- Margin bottom: 48px

**Role Buttons:**
- Width: 100%
- Height: 64px
- Border radius: 12px
- Background: #ffffff
- Border: 2px solid #e5e7eb
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
- Margin: 12px 0
- Active state: Border #3b82f6, Background #eff6ff

**Footer Text:**
- Font: Regular, 14px
- Color: #9ca3af
- Margin top: 24px

---

## 📱 Screen 2: Phone Number Entry

### Visual Design

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│                                     │
│    Enter Mobile Number              │
│    ──────────────────               │
│                                     │
│    We'll send you an OTP to         │
│    verify your number               │
│                                     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ 📱 +91 | 9999999999     │     │
│    └─────────────────────────┘     │
│                                     │
│    ⓘ Enter 10-digit mobile number  │
│                                     │
│                                     │
│                                     │
│    ┌─────────────────────────┐     │
│    │      Send OTP           │     │
│    └─────────────────────────┘     │
│                                     │
│                                     │
│    By continuing, you agree to our  │
│    Terms & Conditions and           │
│    Privacy Policy                   │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Form Field Schema

**Phone Input Field:**
```json
{
  "fieldName": "mobile",
  "type": "tel",
  "label": "Mobile Number",
  "placeholder": "Enter 10-digit number",
  "prefix": "+91",
  "maxLength": 10,
  "validation": {
    "required": true,
    "pattern": "^[6-9][0-9]{9}$",
    "errorMessages": {
      "required": "Mobile number is required",
      "pattern": "Enter valid 10-digit mobile number",
      "minLength": "Mobile number must be 10 digits",
      "invalidStart": "Mobile number must start with 6-9"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "18px",
    "borderRadius": "12px",
    "borderColor": "#e5e7eb",
    "focusBorderColor": "#3b82f6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "placeholderColor": "#9ca3af"
  },
  "states": {
    "default": {
      "border": "1px solid #e5e7eb",
      "background": "#ffffff"
    },
    "focus": {
      "border": "2px solid #3b82f6",
      "shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)"
    },
    "error": {
      "border": "2px solid #ef4444",
      "background": "#fef2f2"
    },
    "success": {
      "border": "2px solid #10b981",
      "background": "#f0fdf4"
    },
    "disabled": {
      "border": "1px solid #e5e7eb",
      "background": "#f9fafb",
      "opacity": 0.6
    }
  }
}
```

**Send OTP Button:**
```json
{
  "type": "primary",
  "label": "Send OTP",
  "styling": {
    "width": "100%",
    "height": "56px",
    "fontSize": "16px",
    "fontWeight": "600",
    "borderRadius": "12px",
    "backgroundColor": "#3b82f6",
    "textColor": "#ffffff",
    "marginTop": "24px"
  },
  "states": {
    "default": {
      "background": "#3b82f6",
      "shadow": "0 4px 6px rgba(59, 130, 246, 0.2)"
    },
    "hover": {
      "background": "#2563eb",
      "shadow": "0 6px 8px rgba(59, 130, 246, 0.3)"
    },
    "active": {
      "background": "#1d4ed8",
      "transform": "scale(0.98)"
    },
    "loading": {
      "background": "#60a5fa",
      "cursor": "not-allowed",
      "content": "Sending..."
    },
    "disabled": {
      "background": "#d1d5db",
      "cursor": "not-allowed",
      "opacity": 0.6
    }
  }
}
```

---

## 📱 Screen 3: OTP Verification

### Visual Design

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│                                     │
│    Enter OTP                        │
│    ─────────                        │
│                                     │
│    Sent to +91 9999999999           │
│    Change                           │
│                                     │
│                                     │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│    │ 9 │ │ 9 │ │ 9 │ │ 9 │ │ 9 │ │ 9 ││
│    └───┘ └───┘ └───┘ └───┘ └───┘ └───┘│
│                                     │
│                                     │
│    ⏱ Resend OTP in 00:28           │
│                                     │
│                                     │
│    ┌─────────────────────────┐     │
│    │   Verify & Login        │     │
│    └─────────────────────────┘     │
│                                     │
│                                     │
│    Didn't receive OTP?              │
│    Resend OTP                       │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Form Field Schema

**OTP Input Fields:**
```json
{
  "fieldName": "otp",
  "type": "otp",
  "length": 6,
  "autoFocus": true,
  "autoSubmit": true,
  "validation": {
    "required": true,
    "pattern": "^[0-9]{6}$",
    "errorMessages": {
      "required": "OTP is required",
      "pattern": "Enter valid 6-digit OTP",
      "invalid": "Invalid OTP. Please try again",
      "expired": "OTP expired. Please request new OTP"
    }
  },
  "styling": {
    "boxWidth": "48px",
    "boxHeight": "56px",
    "fontSize": "24px",
    "fontWeight": "600",
    "borderRadius": "12px",
    "gap": "12px",
    "borderColor": "#e5e7eb",
    "focusBorderColor": "#3b82f6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937"
  },
  "states": {
    "default": {
      "border": "2px solid #e5e7eb",
      "background": "#ffffff"
    },
    "focus": {
      "border": "2px solid #3b82f6",
      "shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)"
    },
    "filled": {
      "border": "2px solid #10b981",
      "background": "#f0fdf4"
    },
    "error": {
      "border": "2px solid #ef4444",
      "background": "#fef2f2",
      "animation": "shake 0.3s"
    }
  },
  "behavior": {
    "autoFocusNext": true,
    "autoFocusPrev": true,
    "pasteSupport": true,
    "clearOnError": false,
    "smsAutoRead": true
  }
}
```

**Resend Timer:**
```json
{
  "duration": 30,
  "format": "mm:ss",
  "styling": {
    "fontSize": "14px",
    "color": "#6b7280",
    "icon": "⏱"
  },
  "states": {
    "counting": {
      "text": "Resend OTP in {time}",
      "color": "#6b7280",
      "clickable": false
    },
    "expired": {
      "text": "Resend OTP",
      "color": "#3b82f6",
      "clickable": true,
      "underline": true
    }
  }
}
```

---

## 📱 Screen 4: Profile Completion

### Visual Design

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│    Complete Your Profile            │
│    ────────────────────             │
│                                     │
│    Help us know you better          │
│                                     │
│         ┌─────────┐                 │
│         │  [📷]   │                 │
│         │ Upload  │                 │
│         └─────────┘                 │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Full Name               │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Email                   │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Address                 │     │
│    └─────────────────────────┘     │
│                                     │
│    [Dealer Only - Conditional]      │
│    ┌─────────────────────────┐     │
│    │ Business Name           │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ GST Number              │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │   Complete Profile      │     │
│    └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Schema

**Full Name Field:**
```json
{
  "fieldName": "name",
  "type": "text",
  "label": "Full Name",
  "placeholder": "Enter your full name",
  "required": true,
  "validation": {
    "minLength": 2,
    "maxLength": 50,
    "pattern": "^[a-zA-Z\\s]+$",
    "errorMessages": {
      "required": "Name is required",
      "minLength": "Name must be at least 2 characters",
      "maxLength": "Name must be less than 50 characters",
      "pattern": "Name can only contain letters and spaces"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Email Field:**
```json
{
  "fieldName": "email",
  "type": "email",
  "label": "Email Address",
  "placeholder": "your@email.com",
  "required": true,
  "validation": {
    "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    "errorMessages": {
      "required": "Email is required",
      "pattern": "Enter valid email address"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**Address Field:**
```json
{
  "fieldName": "address",
  "type": "textarea",
  "label": "Address",
  "placeholder": "Enter your complete address",
  "required": true,
  "validation": {
    "minLength": 10,
    "maxLength": 200,
    "errorMessages": {
      "required": "Address is required",
      "minLength": "Address must be at least 10 characters"
    }
  },
  "styling": {
    "height": "96px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "resize": "vertical"
  }
}
```

**Business Name (Dealer Only):**
```json
{
  "fieldName": "business_name",
  "type": "text",
  "label": "Business Name",
  "placeholder": "Enter business name",
  "required": true,
  "conditional": "role === 'dealer'",
  "validation": {
    "minLength": 2,
    "maxLength": 100,
    "errorMessages": {
      "required": "Business name is required",
      "minLength": "Business name must be at least 2 characters"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px"
  }
}
```

**GST Number (Dealer Only):**
```json
{
  "fieldName": "gst_number",
  "type": "text",
  "label": "GST Number",
  "placeholder": "22AAAAA0000A1Z5",
  "required": true,
  "conditional": "role === 'dealer'",
  "validation": {
    "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    "errorMessages": {
      "required": "GST number is required",
      "pattern": "Enter valid GST number (e.g., 22AAAAA0000A1Z5)"
    }
  },
  "styling": {
    "height": "56px",
    "fontSize": "16px",
    "borderRadius": "12px",
    "textTransform": "uppercase"
  }
}
```

---

## 🎨 Component Library

### Button Variants

**Primary Button:**
```css
.btn-primary {
  background: #3b82f6;
  color: #ffffff;
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: #2563eb;
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  background: #1d4ed8;
  transform: scale(0.98);
}

.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: #ffffff;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #eff6ff;
}

.btn-secondary:active {
  background: #dbeafe;
}
```

### Input Field Variants

**Default Input:**
```css
.input-field {
  height: 56px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  color: #1f2937;
}

.input-field:focus {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.input-field.error {
  border: 2px solid #ef4444;
  background: #fef2f2;
}

.input-field.success {
  border: 2px solid #10b981;
  background: #f0fdf4;
}
```

### Error Message:**
```css
.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-message::before {
  content: "⚠";
}
```

---

## 📐 Layout Specifications

### Screen Padding
```css
--screen-padding-x: 20px;
--screen-padding-y: 24px;
--max-width: 480px;
```

### Form Spacing
```css
--form-field-gap: 20px;
--label-margin-bottom: 8px;
--button-margin-top: 32px;
```

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 375px) {
  --screen-padding-x: 16px;
  --h1: 28px;
}

/* Tablet */
@media (min-width: 768px) {
  --max-width: 560px;
  --screen-padding-x: 40px;
}
```

---

## 🎭 Animations

### Page Transitions
```css
.page-enter {
  animation: slideInRight 0.3s ease-out;
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
```

### Button Press
```css
.btn:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}
```

### Input Focus
```css
.input-field:focus {
  transition: all 0.2s ease;
}
```

### Error Shake
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error {
  animation: shake 0.3s;
}
```

---

## 📱 Platform-Specific Guidelines

### iOS
- Use SF Pro font
- Follow iOS Human Interface Guidelines
- Use native keyboard types
- Implement haptic feedback
- Support Face ID/Touch ID

### Android
- Use Roboto font
- Follow Material Design 3
- Use native keyboard types
- Implement vibration feedback
- Support fingerprint/face unlock

---

*Design specifications prepared for CarTrade India mobile app login flow*
