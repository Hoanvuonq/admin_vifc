export type TransactionStatus = "pending" | "completed" | "failed" | "refunded" | string;

export interface Transaction {
  id: string;
  user_id: string;
  gateway: string;
  amount: number;
  currency: string;
  transaction_id?: string | null;
  status: TransactionStatus;
  metadata?: any | null;
  subscription_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Interface mapping to the data structure returned by GET /api/db/transactions
export interface SubscriptionTransaction {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  start_date: string | null;
  end_date: string | null;
  status: "pending" | "active" | "expired" | string;
  created_at: string;
  updated_at: string;
}

// Raw database structure from Prisma (with Date types)
export interface RawSubscriptionTransaction {
  id: string;
  user_id: string;
  subscription_plan_id: string;
  start_date: Date | null;
  end_date: Date | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}
