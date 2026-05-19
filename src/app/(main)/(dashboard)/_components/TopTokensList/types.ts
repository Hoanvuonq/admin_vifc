export interface Web3TokenData {
    tokenId: string;
    tokenName: string;
    symbol: string;
    tradeVolume: string; // e.g., "142.5M" or "2.4B"
    price: number; // e.g., 67450.25
    priceChange24h: number; // e.g., 4.8 or -2.3 (percentage)
    logoUrl?: string;
}

export interface TopTokensListProps {
    tokens?: Web3TokenData[];
    onRefresh?: () => void;
    loading?: boolean;
}
