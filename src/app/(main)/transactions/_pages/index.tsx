"use client";

import { AdminPageHeader } from "@/components";
import { DataTable } from "@/components/DataTable";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "@/providers/ToastProvider";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Receipt
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TransactionFilters } from "../_components";
import { getColumns } from "./columns";

export const ManagerTransactionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const [currentPage, setCurrentPage] = useState(2);
  const [pageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { transactions: backendTransactions, isLoading, pagination } = useTransactions(currentPage + 1, pageSize, selectedStatus, debouncedSearch);

  const stats = useMemo(() => {
    const total = pagination.total || 0;
    const success = backendTransactions.filter((t) => t.status === "SUCCESS").length;
    const pending = backendTransactions.filter((t) => t.status === "PENDING").length;
    const failed = backendTransactions.filter((t) => t.status === "FAILED").length;
    return { total, success, pending, failed };
  }, [backendTransactions, pagination.total]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, selectedStatus]);

  const paginatedTransactions = backendTransactions;

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for transaction: ${id}`);
  };

  const columns = useMemo(() => getColumns(handleViewDetails), []);

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700 relative">
      <AdminPageHeader
        icon={Receipt}
        title="Manage"
        highlightTitle="Transactions"
        subtitle="Monitor subscription payments, renewals, and transaction history"
        metrics={[
          {
            label: "Total Transactions",
            value: stats.total,
            icon: <Receipt size={14} />,
            color: "blue"
          },
          {
            label: "Completed",
            value: stats.success,
            icon: <CheckCircle2 size={14} />,
            color: "emerald"
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: <Clock size={14} />,
            color: "orange"
          },
          {
            label: "Failed",
            value: stats.failed,
            icon: <AlertCircle size={14} />,
            color: "rose"
          }
        ]}
      />

      <DataTable
        data={paginatedTransactions}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        emptyMessage="No transactions found matching the current filters."
        page={currentPage}
        headerContent={
          <TransactionFilters
            searchText={searchQuery}
            setSearchText={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            counts={stats}
          />
        }
        size={pageSize}
        totalElements={pagination.total || paginatedTransactions.length}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
};
