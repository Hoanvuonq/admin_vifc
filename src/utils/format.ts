export function formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}
export const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
};
