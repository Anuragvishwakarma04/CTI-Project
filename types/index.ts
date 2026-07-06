export type UserRole = 'customer' | 'dealer' | 'showroom';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  phone?: string;

  role?: UserRole; // optional
  user_type?: 'customer' | 'dealer' | 'showroom'; 
  avatar?: string;
  followedDealers?: string[];
  createdAt: string;
}

export interface Dealer extends User {
  role: 'dealer';
  showroomName: string;
  showroomCode?: string;
  location: string;
  rating: number;
  totalCars: number;
  verified: boolean;
  followers: number;
  contactPerson?: string;
  profileImage?: string | null;
}

export interface Car {
  id: string;
  vehicle_id?: string;
  dealerId: string;
  dealerName: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  selling_price?: string;
  mileage: number;
  km_driven?: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  fuel_type?: string;
  transmission: 'Manual' | 'Automatic';
  owners: number;
  images: string[];
  thumbnail: string;
  image_url?: string;
  location: string;
  description: string;
  features: string[];
  inspectionStatus?: 'pending' | 'completed' | 'not_required';
  inspectionReport?: InspectionReport;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  views: number;
  likes: number;
  createdAt: string;
  approvedAt?: string;
  // featured_image?: string;
}

export interface InspectionReport {
  score: number;
  engine: string;
  exterior: string;
  interior: string;
  electrical: string;
  suspension: string;
  brakes: string;
  tires: string;
  documents: string;
  inspectedBy: string;
  inspectedAt: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  price: number;
  discounted_price: number | null;
  final_price: number;
  discount_amount: number;
  has_offer: boolean;
  offer_percentage: number | null;
  is_offer_valid: boolean;
  duration: string;
  checks: string[];
}

export interface Warranty {
  id: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  price: number;
  discounted_price: number | null;
  final_price: number;
  discount_amount: number;
  has_offer: boolean;
  offer_percentage: number | null;
  is_offer_valid: boolean;
  validity_months: number;
  checks: string[];
}

export interface Notification {
  id: number;
  type: 'appointment_booked' | 'appointment_confirmed' | 'appointment_completed' | 'appointment_cancelled' | 'appointment_rejected' | 'appointment_rescheduled' | 'new_car' | 'price_drop' | 'status_update' | 'message';
  title: string;
  message: string;
  data?: {
    appointment_id?: number;
    customer_name?: string;
    vehicle_id?: string;
    [key: string]: any;
  } | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  unread_count: number;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface FilterOptions {
  brand?: string[];
  priceRange?: [number, number];
  minPrice?: number;
  maxPrice?: number;
  yearRange?: [number, number];
  fuelType?: string[];
  transmission?: string[];
  mileageRange?: [number, number];
  location?: string;
  sortBy?: 'price_low' | 'price_high' | 'year_new' | 'year_old' | 'mileage_low';
}

export interface VehicleFormData {
  // Step 1: Vehicle Details
  brand: string;
  model: string;
  variant?: string;
  year: number;
  registration_number: string;
  fuel_type: string;
  transmission: string;
  kilometers: number;
  ownership: string;
  color?: string;
  body_type: string;
  
  // Step 2: Financial
  purchase_price: number;
  reconditioning_cost?: number;
  accessories_cost?: number;
  other_expenses?: number;
  expected_selling_price: number;
  minimum_selling_price?: number;
  
  // Step 3: Legal & Documents
  engine_number?: string;
  chassis_number?: string;
  has_insurance: boolean;
  insurance_expiry?: string;
  
  // Step 4: Media & Listing
  description?: string;
  features?: string[];
  status?: 'available' | 'reserved';
}

export interface VehicleResponse {
  success: boolean;
  message: string;
  vehicle_id: string;
  data: {
    id: number;
    vehicle_id: string;
    brand: string;
    model: string;
    year: number;
    status: 'draft' | 'pending' | 'under_review' | 'approved' | 'live';
    [key: string]: any;
  };
}
