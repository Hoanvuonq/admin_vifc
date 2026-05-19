export interface RevenueLineChartProps {
    revenueData?: (string | number)[];
    orderData?: number[];
    secondaryData?: (string | number)[];
    secondaryOrderData?: number[];
    primaryLabel?: string;
    secondaryLabel?: string;
    period?: 'today' | '7d' | '30d' | 'all';
    title?: string;
    subTitle?: string;
    loading?: boolean;
}
