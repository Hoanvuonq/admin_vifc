export interface OrderStatusBreakdownResponse {
    statusCounts?: Record<string, number>;
    completedCount: number;
    shippedCount: number;
    paidCount: number;
    pendingCount: number;
    cancelledCount: number;
    totalOrders: number;
    successRate: number;
}

export interface DonutChartStatusProps {
    data?: OrderStatusBreakdownResponse;
    onRefresh?: () => void;
    loading?: boolean;
}
