// Glow & Grace Super Admin Data Types & Document Contracts

export type UserRole = 'SUPER_ADMIN' | 'PROFESSIONAL' | 'CUSTOMER';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  accountStatus: AccountStatus;
  salonId?: string | number;
  salonName?: string;
  createdAt: string;
  lastLoginAt: string;
}

export type SalonStatus = 'DRAFT' | 'PENDING' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';

export interface SalonLocation {
  fullAddress: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  googlePlaceId?: string;
}

export interface SalonWorkingHoursDay {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export interface SalonService {
  id: string | number;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  imageUrl?: string;
  active: boolean;
}

export interface SalonBarber {
  id: string | number;
  name: string;
  photoUrl?: string;
  experienceYears: number;
  specialization: string;
  phone: string;
  email?: string;
  availability: 'ON_DUTY' | 'BREAK' | 'OFF_DUTY';
  rating?: number;
}

export type BarberDocument = SalonBarber & {
  id: string;
  salonId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface SalonDocument {
  id: string;
  name: string;
  description: string;
  businessRegNumber: string;
  category: string;
  yearEstablished: number;
  contactEmail: string;
  phone: string;
  website?: string;
  ownerName: string;
  professionalName: string;
  professionalEmail: string;
  professionalPhone: string;
  location: SalonLocation;
  coverImage: string;
  exteriorImage?: string;
  interiorImage?: string;
  receptionImage?: string;
  galleryImages: string[];
  services: SalonService[];
  workingHours: SalonWorkingHoursDay[];
  barbers: SalonBarber[];
  status: SalonStatus;
  publicationStatus?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'UNPUBLISHED';
  isPublished?: boolean;
  rating: number;
  reviewsCount: number;
  chairsCount: number;
  staffCount: number;
  totalAppointmentsCount: number;
  totalRevenue: number;
  submittedAt: string;
  approvedAt?: string;
  publishedAt?: string;
  auditorNotes?: string;
}

export interface ProfessionalDocument {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  salonId: string;
  salonName: string;
  accountStatus: AccountStatus;
  mustResetPassword: boolean;
  totalBarbers: number;
  lastLogin: string;
  createdAt: string;
}

export interface CustomerDocument {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastLogin: string;
  totalAppointments: number;
  lifetimeSpend: number;
  status: AccountStatus;
}

export interface AppointmentDocument {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  salonId: string;
  salonName: string;
  serviceId: number | string;
  serviceName: string;
  barberId: number | string;
  barberName: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  paymentStatus: 'PAID_ONLINE' | 'PAY_AT_SALON' | 'REFUNDED';
  notes?: string;
  createdAt: string;
}

export interface OfferDocument {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountAmount: number;
  minBookingAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  applicableSalon: 'ALL' | string;
  applicableServices: string[];
  usageLimit: number;
  usageCount: number;
  bannerUrl: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DRAFT';
}

export interface LiveUserSession {
  sessionId: string;
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  ipAddress: string;
  loginTimestamp: string;
  lastActivity: string;
  sessionStatus: 'ACTIVE' | 'IDLE' | 'EXPIRED';
}

export interface PerformanceMetrics {
  timestamp: string;
  requestsPerSecond: number;
  totalRequestsToday: number;
  avgResponseTimeMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  failedRequestsCount: number;
  uptimePercent: number;
  functionExecutionCount: number;
  functionDurationMs: number;
  functionErrorsCount: number;
  firestoreReadsToday: number;
  firestoreWritesToday: number;
  storageUsageMb: number;
  activeAuthTokensCount: number;
}

export interface AuditLogDocument {
  id: string;
  adminEmail: string;
  adminUid: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
