export interface BookingRequestItem {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  booking_type: string; // 'course' | 'workshop' | 'meeting-room' | 'lounge' | etc.
  booking_title: string;
  status: "pending" | "confirmed" | "approved" | "rejected" | "cancelled";
  source: string;
  note?: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  company?: string;
  title?: string;
  tuitionFee?: number;
  deposit?: number;
}

// Alias for backward compatibility if needed
export type CourseRegistrationItem = BookingRequestItem;

export interface ReviewBookingPayload {
  status: "confirmed" | "approved" | "rejected" | "cancelled" | "pending";
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CourseRegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
}
