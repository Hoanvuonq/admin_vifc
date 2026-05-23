"use client";

import React, { useMemo } from "react";
import { PortalModal, DataTable } from "@/components";
import { History } from "lucide-react";
import { PaymentHistoryModalProps, PaymentRecord } from "./type";
import { getPaymentHistoryColumns } from "./columns";

// Mock Data
const MOCK_PAYMENT_HISTORY: Record<string, PaymentRecord[]> = {
    // Generate some random history for users
};

const getHistoryForUser = (userId: string | null) => {
    if (!userId) return [];
    if (!MOCK_PAYMENT_HISTORY[userId]) {
        // Generate random history if not exists for demo purposes
        const packages = [
            { name: "Bronze", img: "https://api.dicebear.com/7.x/shapes/svg?seed=bronze", price: 9.99 },
            { name: "Silver", img: "https://api.dicebear.com/7.x/shapes/svg?seed=silver", price: 19.99 },
            { name: "Gold", img: "https://api.dicebear.com/7.x/shapes/svg?seed=gold", price: 49.99 },
            { name: "Platinum", img: "https://api.dicebear.com/7.x/shapes/svg?seed=platinum", price: 99.99 },
            { name: "Diamond", img: "https://api.dicebear.com/7.x/shapes/svg?seed=diamond", price: 199.99 },
        ];

        const numRecords = Math.floor(Math.random() * 5) + 1; // 1 to 5 records
        const records: PaymentRecord[] = [];

        for (let i = 0; i < numRecords; i++) {
            const pkg = packages[Math.floor(Math.random() * packages.length)];
            const statuses: PaymentRecord["status"][] = ["COMPLETED", "COMPLETED", "PENDING", "FAILED", "REFUNDED"];

            // Random date in the past year
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));

            records.push({
                id: `PAY-${userId}-${i}-${Date.now().toString().slice(-4)}`,
                packageName: pkg.name,
                packageImage: pkg.img,
                price: pkg.price,
                purchaseDate: date.toISOString(),
                status: statuses[Math.floor(Math.random() * statuses.length)],
            });
        }

        MOCK_PAYMENT_HISTORY[userId] = records.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    }

    return MOCK_PAYMENT_HISTORY[userId];
};

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose, userId }) => {
    const data: PaymentRecord[] = useMemo(() => getHistoryForUser(userId), [userId, isOpen]);
    const columns = useMemo(() => getPaymentHistoryColumns(), []);

    return (
        <PortalModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Payment History ${userId ? `(#${userId})` : ""}`}
            icon={History}
            width="max-w-4xl"
            className="h-[80vh]"
        >
            <div className="h-full flex flex-col">
                <DataTable<PaymentRecord>
                    columns={columns}
                    data={data}
                    loading={false}
                    rowKey={(record) => record.id}
                    emptyMessage="No payment history found for this user."
                    className="border-none shadow-none"
                />
            </div>
        </PortalModal>
    );
};
