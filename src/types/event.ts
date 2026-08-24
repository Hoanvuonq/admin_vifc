export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  image?: string;
  badge?: string;
  luma_url?: string;
  description?: string;
  status: "active" | "inactive" | "completed" | "upcoming";
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface EventRegistrationItem {
  id: string;
  user_id?: string | null;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  event_id?: string | null;
  event_title: string;
  event_date?: string | null;
  location?: string | null;
  status: "pending" | "confirmed" | "attended" | "cancelled";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  image?: string;
  badge?: string;
  luma_url?: string;
  description?: string;
  status?: string;
}
