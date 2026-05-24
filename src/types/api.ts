export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}
