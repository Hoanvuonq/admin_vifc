export interface TransactionItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  planName: string;
  amount: number;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  paymentMethod: string;
  transactionDate: string;
  description?: string;
}
