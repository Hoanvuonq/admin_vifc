import { ActionTooltipBtn, ItemImage, StatusBadge } from "@/components";
import { Eye, CreditCard } from "lucide-react";
import { TransactionItem } from "./types";

export const getColumns = (handleViewDetails: (id: string) => void) => [
  {
    header: "Transaction ID",
    accessor: "id" as keyof TransactionItem,
    className: "w-[15%] font-mono text-xs font-bold text-gray-600",
  },
  {
    header: "User",
    accessor: "userName" as keyof TransactionItem,
    className: "w-[25%]",
    render: (item: TransactionItem) => (
      <div className="flex items-center gap-3">
        <ItemImage
          path={item.userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.userName)}`}
          productName={item.userName}
          className="w-10 h-10 shrink-0"
        />
        <div className="flex flex-col">
          <span className="font-bold text-[13px] text-gray-800">{item.userName}</span>
          <span className="text-[11px] text-gray-500">{item.userEmail}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Plan Details",
    accessor: "planName" as keyof TransactionItem,
    className: "w-[20%]",
    render: (item: TransactionItem) => (
      <div className="flex flex-col">
        <span className="font-bold text-[12px] text-orange-600">{item.planName}</span>
        <div className="flex items-center gap-1 mt-0.5 text-gray-500 text-[10px]">
          <CreditCard size={10} />
          {item.paymentMethod}
        </div>
      </div>
    ),
  },
  {
    header: "Amount",
    accessor: "amount" as keyof TransactionItem,
    className: "w-[15%]",
    render: (item: TransactionItem) => (
      <span className="font-bold text-gray-900 text-[14px]">
        {item.amount.toLocaleString()} {item.currency}
      </span>
    ),
  },
  {
    header: "Date",
    accessor: "transactionDate" as keyof TransactionItem,
    className: "w-[15%]",
    render: (item: TransactionItem) => (
      <span className="text-gray-500 text-[12px] font-medium">
        {new Date(item.transactionDate).toLocaleString("en-GB", {
          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        })}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: "status" as keyof TransactionItem,
    className: "w-[10%] text-center",
    align: "center" as const,
    render: (item: TransactionItem) => {
      const getStatusLabel = () => {
        switch (item.status) {
          case "SUCCESS": return "Completed";
          case "PENDING": return "Pending";
          case "FAILED": return "Failed";
          default: return item.status;
        }
      };
      
      const getVariant = () => {
        switch (item.status) {
          case "SUCCESS": return "emerald";
          case "PENDING": return "amber";
          case "FAILED": return "rose";
          default: return "default";
        }
      };

      return <StatusBadge status={getStatusLabel()} variant={getVariant() as any} />;
    },
  },
  {
    header: "Action",
    className: "w-[5%] text-center",
    align: "center" as const,
    render: (item: TransactionItem) => (
      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <ActionTooltipBtn
          onClick={() => handleViewDetails(item.id)}
          icon={<Eye size={13} />}
          color="blue"
          tooltip="View Details"
        />
      </div>
    ),
  },
];
