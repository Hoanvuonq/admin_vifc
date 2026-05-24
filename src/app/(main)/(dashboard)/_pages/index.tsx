"use client";

import { AdminPageHeader, DonutChartStatus, RevenueLineChart } from "@/components";
import _ from "lodash";
import { BookDashed, CalendarCheck, CalendarClock, CalendarDays, CalendarRange, DollarSign, Eye, ShoppingBag, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { SmartKPICard, StatusTabs, TopTokensList, LowLiquidityList, MarketSentimentAnalysis } from "../_components";
import { StatusTabItem } from "../_components/StatusTabs/type";

export function parseGrowthValue(value: string | number | undefined | null): number | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }

    if (typeof value === 'number') {
        return value;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
};

export const DashboardScreen = () => {
    const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'all'>('30d');

    const isDashboardLoading = false;
    const [isStatusRefreshing, setIsStatusRefreshing] = useState(false);
    const refreshStatus = () => {
        setIsStatusRefreshing(true);
        setTimeout(() => {
            setIsStatusRefreshing(false);
        }, 1500);
    };

    const [isSentimentRefreshing, setIsSentimentRefreshing] = useState(false);
    const refreshSentiment = () => {
        setIsSentimentRefreshing(true);
        setTimeout(() => {
            setIsSentimentRefreshing(false);
        }, 1500);
    };

    const [isTokensRefreshing, setIsTokensRefreshing] = useState(false);
    const refreshTokens = () => {
        setIsTokensRefreshing(true);
        setTimeout(() => {
            setIsTokensRefreshing(false);
        }, 1500);
    };

    const [isLiquidityRefreshing, setIsLiquidityRefreshing] = useState(false);
    const refreshLiquidity = () => {
        setIsLiquidityRefreshing(true);
        setTimeout(() => {
            setIsLiquidityRefreshing(false);
        }, 1500);
    };

    const dashboardData = useMemo(() => {
        if (period === 'today') {
            return {
                todayMetrics: {
                    netRevenue: 12845000,
                    orders: 34,
                    uniqueVisitors: 450,
                    conversionRate: 7.56,
                },
                growthPercentages: {
                    netRevenue: 4.2,
                    orders: 2.1,
                    uniqueVisitors: 5.3,
                },
                hourlyRevenue: [
                    120000, 150000, 80000, 90000, 210000, 350000, 420000, 500000,
                    650000, 800000, 750000, 900000, 1100000, 1050000, 1200000, 1350000,
                    1500000, 1420000, 1600000, 1850000, 1700000, 1400000, 950000, 450000
                ],
                hourlyOrders: [
                    1, 1, 0, 1, 2, 2, 3, 3, 4, 4, 3, 4, 5, 4, 5, 5, 6, 5, 6, 7, 6, 5, 3, 2
                ]
            };
        } else if (period === '7d') {
            return {
                todayMetrics: {
                    netRevenue: 98450000,
                    orders: 245,
                    uniqueVisitors: 3200,
                    conversionRate: 7.65,
                },
                growthPercentages: {
                    netRevenue: 8.5,
                    orders: 6.4,
                    uniqueVisitors: 9.1,
                },
                hourlyRevenue: [
                    12000000, 15000000, 11000000, 14000000, 13500000, 16500000, 16450000
                ],
                hourlyOrders: [
                    30, 35, 28, 32, 31, 40, 49
                ]
            };
        } else if (period === '30d') {
            return {
                todayMetrics: {
                    netRevenue: 458200000,
                    orders: 1120,
                    uniqueVisitors: 15400,
                    conversionRate: 7.27,
                },
                growthPercentages: {
                    netRevenue: 12.4,
                    orders: 9.8,
                    uniqueVisitors: 14.2,
                },
                hourlyRevenue: [
                    12000000, 15000000, 11000000, 14000000, 13500000, 16500000, 16450000,
                    15000000, 17200000, 14800000, 13900000, 15500000, 16200000, 17000000,
                    16800000, 18500000, 19200000, 15000000, 14200000, 13500000, 15500000,
                    16100000, 17000000, 15900000, 18000000, 19500000, 20500000, 18200000,
                    16500000, 15800000
                ],
                hourlyOrders: [
                    28, 35, 26, 32, 30, 38, 37, 34, 39, 33, 31, 35, 36, 39, 38, 42, 45, 34, 32, 30, 35, 36, 39, 36, 41, 46, 48, 41, 37, 35
                ]
            };
        } else {
            return {
                todayMetrics: {
                    netRevenue: 5824500000,
                    orders: 14250,
                    uniqueVisitors: 185000,
                    conversionRate: 7.7,
                },
                growthPercentages: {
                    netRevenue: 24.5,
                    orders: 21.2,
                    uniqueVisitors: 28.6,
                },
                hourlyRevenue: [
                    380000000, 420000000, 450000000, 410000000, 480000000, 520000000,
                    490000000, 510000000, 540000000, 580000000, 620000000, 650000000
                ],
                hourlyOrders: [
                    950, 1020, 1100, 1010, 1180, 1250, 1200, 1230, 1310, 1420, 1510, 1580
                ]
            };
        }
    }, [period]);

    const orderStatus = useMemo(() => {
        if (period === 'today') {
            return {
                completedCount: 28,
                shippedCount: 3,
                paidCount: 1,
                pendingCount: 2,
                cancelledCount: 0,
                totalOrders: 34,
                successRate: 94.1,
            };
        } else if (period === '7d') {
            return {
                completedCount: 210,
                shippedCount: 18,
                paidCount: 8,
                pendingCount: 6,
                cancelledCount: 3,
                totalOrders: 245,
                successRate: 92.5,
            };
        } else if (period === '30d') {
            return {
                completedCount: 980,
                shippedCount: 85,
                paidCount: 35,
                pendingCount: 12,
                cancelledCount: 8,
                totalOrders: 1120,
                successRate: 95.2,
            };
        } else {
            return {
                completedCount: 12800,
                shippedCount: 850,
                paidCount: 350,
                pendingCount: 150,
                cancelledCount: 100,
                totalOrders: 14250,
                successRate: 96.5,
            };
        }
    }, [period]);

    const metrics = _.get(dashboardData, 'todayMetrics');
    const growth = _.get(dashboardData, 'growthPercentages');

    const periodTabs: StatusTabItem<'today' | '7d' | '30d' | 'all'>[] = useMemo(() => [
        { key: 'today', label: 'Today', icon: CalendarDays },
        { key: '7d', label: 'Last 7 Days', icon: CalendarRange },
        { key: '30d', label: 'Last 30 Days', icon: CalendarCheck },
        { key: 'all', label: 'All Time', icon: CalendarClock },
    ], []);

    const currentPeriodLabel = useMemo(() =>
        _.get(_.find(periodTabs, { key: period }), 'label', ''),
        [period, periodTabs]);

    return (
        <div className="min-h-screen space-y-6">
            <AdminPageHeader
                icon={BookDashed}
                title="Overview"
                highlightTitle="Reports"
                subtitle="Store sales activity and operational statistics"
            >
                <StatusTabs
                    tabs={periodTabs}
                    current={period}
                    onChange={(key) => setPeriod(key as 'today' | '7d' | '30d' | 'all')}
                />
            </AdminPageHeader >

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SmartKPICard
                    title="Total Revenue"
                    value={formatPrice(_.get(metrics, 'netRevenue', 0))}
                    growth={parseGrowthValue(_.get(growth, 'netRevenue') || _.get(growth, 'orders')) || 0}
                    format="currency"
                    colorTheme="orange"
                    icon={<DollarSign size={20} />}
                    loading={isDashboardLoading}
                />
                <SmartKPICard
                    title="Orders"
                    value={_.get(metrics, 'orders', 0)}
                    growth={parseGrowthValue(_.get(growth, 'orders')) || 0}
                    colorTheme="blue"
                    icon={<ShoppingBag size={20} />}
                    suffix=" orders"
                    loading={isDashboardLoading}
                />
                <SmartKPICard
                    title="Unique Visitors"
                    value={_.get(metrics, 'uniqueVisitors', 0)}
                    growth={parseGrowthValue(_.get(growth, 'uniqueVisitors')) || 0}
                    colorTheme="green"
                    icon={<Users size={20} />}
                    suffix=" visitors"
                    loading={isDashboardLoading}
                />
                <SmartKPICard
                    title="Conversion Rate"
                    value={_.get(metrics, 'conversionRate', 0)}
                    growth={0}
                    format="percentage"
                    colorTheme="purple"
                    icon={<Eye size={20} />}
                    loading={isDashboardLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <RevenueLineChart
                        revenueData={_.get(dashboardData, 'hourlyRevenue')}
                        orderData={_.get(dashboardData, 'hourlyOrders')}
                        period={period}
                        title="Business Trends"
                        subTitle={`Operational data for ${currentPeriodLabel.toLowerCase()}`}
                        loading={isDashboardLoading}
                    />
                </div>
                <div className="lg:col-span-4 flex flex-col h-full">
                    <DonutChartStatus data={orderStatus} onRefresh={refreshStatus} loading={isStatusRefreshing} />
                </div>
            </div>

            {/* Premium Web3 Crypto Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <MarketSentimentAnalysis onRefresh={refreshSentiment} loading={isSentimentRefreshing} />
                <TopTokensList onRefresh={refreshTokens} loading={isTokensRefreshing} />
                <LowLiquidityList onRefresh={refreshLiquidity} loading={isLiquidityRefreshing} />
            </div>
        </div >
    );
}
