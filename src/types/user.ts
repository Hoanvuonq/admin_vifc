export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  description?: string | null;
  is_active?: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  start_date: string | null;
  end_date: string | null;
  status: "pending" | "active" | "expired" | string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface UserCard {
  id: string;
  user_id: string;
  username: string;
  so_the: string;
  loai_the: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  status: "active" | "blocked" | string;
  auth_provider?: string | null;
  provider_id?: string | null;
  avatar_url?: string | null;
  company?: string | null;
  title?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  subscription: UserSubscription | null;
  card?: UserCard | null;
  user_cards?: UserCard[];
}
