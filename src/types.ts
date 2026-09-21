export type VehicleType = 'sedan' | 'suv' | 'coupe' | 'truck';

export interface VehicleOption {
  id: VehicleType;
  name: string;
  category: string;
  iconName: string;
  sizeMultiplier: number;
  basePriceMultiplier: number;
  description: string;
}

export type WashStageId = 
  | 'idle'
  | 'pre_soak'
  | 'pressure_wash'
  | 'foam_cannon'
  | 'brush_scrub'
  | 'wheel_blast'
  | 'ceramic_wax'
  | 'turbo_dry'
  | 'completed';

export interface WashStageInfo {
  id: WashStageId;
  name: string;
  shortName: string;
  description: string;
  durationSeconds: number;
  icon: string;
  color: string;
}

export interface WashPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  estimatedMinutes: number;
  popular?: boolean;
  features: string[];
  stagesIncluded: WashStageId[];
}

export interface WashAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleType: VehicleType;
  vehicleMakeModel: string;
  vehicleColor: string;
  licensePlate: string;
  packageId: string;
  packageName: string;
  addons: string[];
  totalAmount: number;
  date: string;
  timeSlot: string;
  bayNumber: number;
  status: 'booked' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  currentStage: WashStageId;
  stageProgress: number; // 0 to 100
  startTime?: number;
  createdAt: string;
  paymentMethod: 'stripe_card' | 'apple_pay' | 'google_pay';
  paymentStatus: 'paid' | 'pending';
  notes?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  date: string;
  vehicleType: VehicleType;
  packageName: string;
  comment: string;
  tags: string[];
  verifiedWash: boolean;
  avatarBg: string;
  likes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'technician' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  bookingId?: string;
  isAction?: boolean;
  avatar?: string;
}

export interface BayStatus {
  bayNumber: number;
  name: string;
  type: 'Touchless Hydro Bay' | 'Soft-Cloth Tunnel' | 'Executive Detailing Bay';
  status: 'available' | 'occupied' | 'maintenance';
  activeBookingId?: string;
  currentStage?: WashStageId;
  progress?: number;
  estimatedMinutesLeft?: number;
}

export interface RevenueDataPoint {
  day: string;
  revenue: number;
  washes: number;
  tips: number;
}

export interface PackageRevenueData {
  name: string;
  value: number;
  revenue: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone: string;
  loyaltyPoints: number;
  savedVehicles: {
    makeModel: string;
    type: VehicleType;
    plate: string;
    color: string;
  }[];
}
