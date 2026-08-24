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
