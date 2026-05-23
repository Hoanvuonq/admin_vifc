export interface PaymentHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface PaymentRecord {
    id: string;
    packageName: string;
    packageImage: string;
    price: number;
    purchaseDate: string;
    status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";
}
