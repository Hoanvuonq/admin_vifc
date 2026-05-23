import React from "react";
import { Column } from "@/components/DataTable/type";
import { ItemImage } from "@/components";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { PaymentRecord } from "./type";

export const getPaymentHistoryColumns = (): Column<PaymentRecord>[] => [
    {
        header: "Package Name",
        accessor: "packageName" as keyof PaymentRecord,
        className: "w-[40%]",
        render: (record: PaymentRecord) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                    <ItemImage
                        path={record.packageImage}
                        productName={record.packageName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-bold text-sm text-gray-800">{record.packageName}</span>
            </div>
        )
    },
    {
        header: "Price",
        accessor: "price" as keyof PaymentRecord,
        className: "w-[20%] text-right",
        align: "right" as const,
        render: (record: PaymentRecord) => (
            <span className="font-mono text-sm font-bold text-slate-700">
                ${record.price.toFixed(2)}
            </span>
        )
    },
    {
        header: "Date & Time",
        accessor: "purchaseDate" as keyof PaymentRecord,
        className: "w-[25%] text-center",
        align: "center" as const,
        render: (record: PaymentRecord) => (
            <div className="flex flex-col items-center justify-center text-xs text-gray-500 gap-0.5">
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <Calendar size={12} className="text-gray-400" />
                    {format(new Date(record.purchaseDate), "dd MMM, yyyy")}
                </span>
                <span className="text-[10px]">{format(new Date(record.purchaseDate), "HH:mm a")}</span>
            </div>
        )
    },
    {
        header: "Status",
        accessor: "status" as keyof PaymentRecord,
        className: "w-[15%] text-center",
        align: "center" as const,
        render: (record: PaymentRecord) => {
            let badgeClass = "";
            let label = "";
            switch (record.status) {
                case "COMPLETED":
                    badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    label = "Completed";
                    break;
                case "PENDING":
                    badgeClass = "bg-amber-50 text-amber-600 border-amber-200";
                    label = "Pending";
                    break;
                case "FAILED":
                    badgeClass = "bg-rose-50 text-rose-600 border-rose-200";
                    label = "Failed";
                    break;
                case "REFUNDED":
                    badgeClass = "bg-slate-100 text-slate-600 border-slate-300";
                    label = "Refunded";
                    break;
            }
            return (
                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                    {label}
                </span>
            );
        }
    }
];
