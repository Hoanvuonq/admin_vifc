import { UserSubscription } from "@/types/user";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "FREE" | "PREMIUM" | "ANNUAL PREMIUM" | string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  phone: string;
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  company?: string | null;
  title?: string | null;
  country?: string | null;
  auth_provider?: string | null;
  subscription?: UserSubscription | null;
}
