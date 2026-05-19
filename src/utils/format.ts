export function formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}
