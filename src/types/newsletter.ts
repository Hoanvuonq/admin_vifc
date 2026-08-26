export interface NewsletterSubscriberItem {
  id: string;
  user_id?: string | null;
  email: string;
  full_name?: string | null;
  source: string;
  status: "subscribed" | "unsubscribed" | "bounced";
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
  subtitle?: string;
  banner?: string;
  image?: string;
  description: string;
  location?: string;
  date?: string;
  badge?: string;
  issue_tag?: string;
  read_time?: string;
  luma_url?: string;
  status: "active" | "draft" | "inactive" | "sent" | string;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsletterPayload {
  title: string;
  subtitle?: string;
  banner?: string;
  image?: string;
  description: string;
  location?: string;
  date?: string;
  badge?: string;
  issue_tag?: string;
  read_time?: string;
  luma_url?: string;
  status?: string;
}
