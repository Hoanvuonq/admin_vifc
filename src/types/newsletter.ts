export interface NewsletterSubscriberItem {
  id: string;
  user_id?: string | null;
  email: string;
  full_name?: string | null;
  source: string;
  status: "subscribed" | "unsubscribed" | "bounced" | string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriberPayload {
  email: string;
  full_name?: string;
  source?: string;
  status?: string;
}

export interface NewsletterItem {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  location: string;
  image?: string | null;
  status: "active" | "draft" | "inactive" | string;
  order_index?: number;
  created_at: string;
  updated_at: string;
  registrations_count?: number;
}

export interface CreateNewsletterPayload {
  title: string;
  description?: string | null;
  date: string;
  location: string;
  image?: string | null;
  status?: string;
  order_index?: number;
}

export interface NewsletterRegistrationItem {
  id: string;
  newsletter_id: string;
  user_id?: string | null;
  email: string;
  full_name?: string | null;
  newsletter_title: string;
  newsletter_date?: string | null;
  location?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  note?: string | null;
  created_at: string;
  updated_at: string;
}
