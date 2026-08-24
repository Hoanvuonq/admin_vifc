export type CourseRegistrationStatus =
  | "pending"
  | "confirmed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface BookingRequestItem {
  id: string;
  user_id?: string | null;
  email: string;
  full_name: string;
  phone?: string | null;
  company?: string | null;
  booking_type: string; // 'course' | 'workshop' | 'meeting-room' | 'lounge'
  booking_title: string;
  tuition_fee?: number | null;
  deposit?: number | null;
  tuitionFee?: number | null; // Alias for UI camelCase
  status: CourseRegistrationStatus | string;
  source: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  title?: string;
  avatar_url?: string | null;
  card?: {
    so_the: string;
    loai_the?: string;
    username?: string;
  } | null;
  users?: {
    id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

// Alias for backward compatibility
export type CourseRegistrationItem = BookingRequestItem;

export interface ReviewBookingPayload {
  status: CourseRegistrationStatus | string;
  note?: string;
}

export interface CreateBookingPayload {
  email: string;
  full_name: string;
  phone?: string | null;
  company?: string | null;
  booking_type?: string;
  booking_title: string;
  tuition_fee?: number | null;
  tuitionFee?: number | null;
  deposit?: number | null;
  source?: string;
  note?: string | null;
  status?: string;
  user_id?: string | null;
}

export interface CourseRegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
    stats?: CourseRegistrationStats;
    timestamp?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}


export interface CourseItem {
  id: string;
  title: string;
  booking_type: string; // 'course' | 'workshop' | 'meeting-room' | 'lounge'
  booking_title: string;
  description?: string | null;
  image?: string | null;
  fallback_image?: string | null;
  instructor?: string | null;
  duration?: string | null;
  schedule?: string | null;
  tuition_fee?: number | null;
  status: "active" | "inactive" | "draft" | string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseItemPayload {
  title: string;
  booking_type: string;
  booking_title: string;
  description?: string;
  image?: string;
  fallback_image?: string;
  instructor?: string;
  duration?: string;
  schedule?: string;
  tuition_fee?: number;
  status?: string;
}
