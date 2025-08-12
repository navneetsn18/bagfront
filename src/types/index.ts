export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  location?: string;
  adminType?: 'check_in' | 'security' | 'boarding' | 'baggage_claim' | 'supervisor';
}

export interface Baggage {
  id: string;
  pnr: string;
  passengerName: string;
  passengerEmail?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  status: BaggageStatus;
  currentLocation: string;
  qrCode: string;
  weight?: number;
  description?: string;
  trackingHistory?: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  id: string;
  baggageId: string;
  location: string;
  status: BaggageStatus;
  timestamp: string;
  scannedBy?: string;
  method: 'qr_scan' | 'manual_entry';
}

export interface Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived';
}

export type BaggageStatus = 
  | 'checked_in'
  | 'security_cleared'
  | 'loaded_on_aircraft'
  | 'in_transit'
  | 'arrived_at_destination'
  | 'delivered'
  | 'lost';

export interface RecentActivity {
  type: 'baggage_update' | 'tracking_event';
  id: string;
  baggageId: string;
  passengerName: string;
  pnr: string;
  status: BaggageStatus;
  location: string;
  timestamp: string;
  flightNumber: string;
  scannedBy?: string;
  method?: 'qr_scan' | 'manual_entry';
}

export interface DashboardStats {
  totalBaggage: number;
  statusCounts: Record<string, number>;
  recentActivities: RecentActivity[];
  totalFlights: number;
  totalUsers: number;
  totalAdmins: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TrackResponse {
  results: Baggage[];
}

export interface CreateBaggageResponse {
  message: string;
  baggage: Baggage[];
}

export interface FlightBaggageResponse {
  flight: string;
  baggage: Baggage[];
  count: number;
}