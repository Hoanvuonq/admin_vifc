"use client";

import { PortalModal, PremiumButton, SelectComponent } from "@/components";
import { BookingRequestItem } from "@/types/course";
import dayjs from "dayjs";
import { Check, CheckSquare, Download, FileSpreadsheet, Filter, Layers, Square } from "lucide-react";
import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "@/providers/ToastProvider";

export interface ExportExcelModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  registrations?: BookingRequestItem[];
  data?: BookingRequestItem[];
  defaultType?: string;
  defaultStatus?: string;
}

interface ColumnOption {
  key: string;
  label: string;
  defaultChecked: boolean;
  getValue: (item: BookingRequestItem, index: number) => any;
}

const AVAILABLE_COLUMNS: ColumnOption[] = [
  {
    key: "stt",
    label: "STT",
    defaultChecked: true,
    getValue: (_item, index) => index + 1,
  },
  {
    key: "full_name",
    label: "Họ và tên",
    defaultChecked: true,
    getValue: (item) => item.full_name || item.users?.full_name || "—",
  },
  {
    key: "email",
    label: "Địa chỉ Email",
    defaultChecked: true,
    getValue: (item) => item.email || item.users?.email || "—",
  },
  {
    key: "phone",
    label: "Số điện thoại",
    defaultChecked: true,
    getValue: (item) => item.phone || "—",
  },
  {
    key: "company",
    label: "Công ty / Doanh nghiệp",
    defaultChecked: true,
    getValue: (item) => item.company || "Cá nhân",
  },
  {
    key: "booking_title",
    label: "Khóa học / Dịch vụ đăng ký",
    defaultChecked: true,
    getValue: (item) => item.booking_title || "—",
  },
  {
    key: "booking_type",
    label: "Loại hình dịch vụ",
    defaultChecked: true,
    getValue: (item) => {
      const typeMap: Record<string, string> = {
        course: "Khóa học đào tạo",
        workshop: "Hội thảo / Workshop",
        "meeting-room": "Phòng họp",
        lounge: "VIP Lounge",
        consulting: "Tư vấn 1-1",
      };
      return typeMap[item.booking_type] || item.booking_type || "Khác";
    },
  },
  {
    key: "card_so_the",
    label: "Mã số thẻ On-Chainpass",
    defaultChecked: true,
    getValue: (item) => (item.card?.so_the ? `#${item.card.so_the}` : "Chưa cấp thẻ"),
  },
  {
    key: "card_loai_the",
    label: "Hạng thẻ thành viên",
    defaultChecked: true,
    getValue: (item) => item.card?.loai_the || "—",
  },
  {
    key: "card_username",
    label: "Tên in trên thẻ",
    defaultChecked: true,
    getValue: (item) => item.card?.username || "—",
  },
  {
    key: "tuition_fee",
    label: "Học phí / Chi phí (VND)",
    defaultChecked: true,
    getValue: (item) => item.tuition_fee ?? item.tuitionFee ?? 0,
  },
  {
    key: "deposit",
    label: "Đặt cọc (VND)",
    defaultChecked: true,
    getValue: (item) => item.deposit ?? 0,
  },
  {
    key: "status",
    label: "Trạng thái đơn",
    defaultChecked: true,
    getValue: (item) => {
      const statusMap: Record<string, string> = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        approved: "Đã duyệt",
        completed: "Hoàn thành",
        rejected: "Từ chối",
        cancelled: "Đã hủy",
      };
      return statusMap[(item.status || "").toLowerCase()] || item.status || "—";
    },
  },
  {
    key: "note",
    label: "Ghi chú đơn hàng",
    defaultChecked: true,
    getValue: (item) => item.note || "",
  },
  {
    key: "source",
    label: "Nguồn đăng ký",
    defaultChecked: true,
    getValue: (item) => item.source || "Website",
  },
  {
    key: "created_at",
    label: "Thời gian đăng ký",
    defaultChecked: true,
    getValue: (item) => (item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm") : "—"),
  },
];

export const ExportExcelModal: React.FC<ExportExcelModalProps> = ({
  isOpen,
  open,
  onClose,
  registrations,
  data,
  defaultType = "ALL",
  defaultStatus = "ALL",
}) => {
  const isModalOpen = isOpen !== undefined ? isOpen : !!open;
  const listItems = registrations || data || [];

  const [selectedType, setSelectedType] = useState<string>(defaultType);
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>(defaultStatus);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(AVAILABLE_COLUMNS.map((c) => c.key));
  const [isExporting, setIsExporting] = useState(false);

  // Extract unique course/booking titles from registrations
  const uniqueTitles = useMemo(() => {
    const titlesSet = new Set<string>();
    listItems.forEach((item) => {
      if (item.booking_title && item.booking_title.trim()) {
        titlesSet.add(item.booking_title.trim());
      }
    });
    return Array.from(titlesSet).sort();
  }, [listItems]);

  const bookingTypeOptions = [
    { value: "ALL", label: "Tất cả loại hình (All Types)" },
    { value: "lounge", label: "🛋️ VIP Lounge" },
    { value: "course", label: "🎓 Khóa học (Course)" },
    { value: "workshop", label: "✨ Workshop & Seminar" },
    { value: "meeting-room", label: "🏢 Phòng họp (Meeting Room)" },
    { value: "consulting", label: "💼 Tư vấn 1-1 (Consulting)" },
  ];

  const courseTitleOptions = useMemo(() => {
    return [
      { value: "ALL", label: "Tất cả khóa học & Dịch vụ" },
      ...uniqueTitles.map((title) => ({
        value: title,
        label: title,
      })),
    ];
  }, [uniqueTitles]);

  const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái (All Status)" },
    { value: "pending", label: "⏳ Chờ xác nhận (Pending)" },
    { value: "confirmed", label: "✅ Đã xác nhận (Confirmed)" },
    { value: "approved", label: "🎓 Đã duyệt (Approved)" },
    { value: "completed", label: "🏆 Hoàn thành (Completed)" },
    { value: "rejected", label: "❌ Từ chối (Rejected)" },
    { value: "cancelled", label: "🚫 Đã hủy (Cancelled)" },
  ];

  // Filter registrations according to modal selections
  const matchingRegistrations = useMemo(() => {
    return listItems.filter((item) => {
      // 1. Booking Type filter
      if (selectedType && selectedType !== "ALL") {
        const itemType = (item.booking_type || "").toLowerCase().replace(/_/g, "-").trim();
        const filterType = selectedType.toLowerCase().replace(/_/g, "-").trim();
        if (itemType !== filterType && !itemType.includes(filterType) && !filterType.includes(itemType)) {
          return false;
        }
      }

      // 2. Specific Course Title filter
      if (selectedCourse && selectedCourse !== "ALL") {
        if ((item.booking_title || "").trim().toLowerCase() !== selectedCourse.trim().toLowerCase()) {
          return false;
        }
      }

      // 3. Status filter
      if (selectedStatus && selectedStatus !== "ALL") {
        const itemStatus = (item.status || "").toLowerCase().trim();
        const filterStatus = selectedStatus.toLowerCase().trim();
        if (filterStatus === "approved" || filterStatus === "confirmed") {
          if (!["approved", "confirmed"].includes(itemStatus)) return false;
        } else if (filterStatus === "rejected" || filterStatus === "cancelled") {
          if (!["rejected", "cancelled"].includes(itemStatus)) return false;
        } else if (filterStatus === "completed") {
          if (!["completed", "success"].includes(itemStatus)) return false;
        } else if (itemStatus !== filterStatus) {
          return false;
        }
      }

      return true;
    });
  }, [listItems, selectedType, selectedCourse, selectedStatus]);

  const toggleColumn = (colKey: string) => {
    if (selectedColumns.includes(colKey)) {
      if (selectedColumns.length <= 1) {
        toast.warning("Cần chọn ít nhất 1 cột để xuất file.");
        return;
      }
      setSelectedColumns(selectedColumns.filter((k) => k !== colKey));
    } else {
      setSelectedColumns([...selectedColumns, colKey]);
    }
  };

  const handleSelectAllColumns = () => {
    if (selectedColumns.length === AVAILABLE_COLUMNS.length) {
      setSelectedColumns(["full_name", "email", "booking_title", "card_so_the"]);
    } else {
      setSelectedColumns(AVAILABLE_COLUMNS.map((c) => c.key));
    }
  };

  const handleExport = () => {
    if (matchingRegistrations.length === 0) {
      toast.warning("Không có dữ liệu phù hợp với bộ lọc để xuất Excel.");
      return;
    }

    setIsExporting(true);

    try {
      const activeColumns = AVAILABLE_COLUMNS.filter((c) => selectedColumns.includes(c.key));

      const exportRows = matchingRegistrations.map((item, index) => {
        const rowData: Record<string, any> = {};
        activeColumns.forEach((col) => {
          rowData[col.label] = col.getValue(item, index);
        });
        return rowData;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportRows);

      // Auto-calculate column widths
      const colWidths = activeColumns.map((col) => {
        const headerLen = col.label.length;
        const maxDataLen = Math.max(
          headerLen,
          ...matchingRegistrations.map((item, idx) => {
            const val = col.getValue(item, idx);
            return val !== null && val !== undefined ? String(val).length : 0;
          }),
        );
        return { wch: Math.min(Math.max(maxDataLen + 4, 12), 45) };
      });
      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachDangKy");

      // Generate filename
      const typeSlug = selectedType !== "ALL" ? selectedType.replace(/[^a-zA-Z0-9]/g, "_") : "Tat_Ca";
      const courseSlug = selectedCourse !== "ALL" ? `_${selectedCourse.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}` : "";
      const dateSlug = dayjs().format("YYYYMMDD_HHmm");
      const fileName = `Danh_Sach_Dang_Ky_OnChainPass_${typeSlug}${courseSlug}_${dateSlug}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      toast.success(`Đã xuất thành công ${matchingRegistrations.length} bản ghi sang file Excel!`);
      onClose();
    } catch (err: any) {
      console.error("Export Excel error:", err);
      toast.warning(err?.message || "Lỗi khi xuất file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PortalModal
      isOpen={isModalOpen}
      onClose={onClose}
      title="Xuất Dữ Liệu Đăng Ký Sang Excel"
      description="Tùy chỉnh bộ lọc loại hình, chọn khóa học cụ thể và lựa chọn đầy đủ các trường thông tin & thẻ thành viên."
      icon={FileSpreadsheet}
      width="max-w-7xl"
      className="max-h-[90vh]"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Tìm thấy <strong className="text-emerald-700 font-bold">{matchingRegistrations.length}</strong> bản ghi hợp lệ
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <PremiumButton type="button" label="Hủy bỏ" onClick={onClose} variant="gray" size="md" />

            <PremiumButton
              label={isExporting ? "Đang xuất..." : `Tải file Excel (${matchingRegistrations.length})`}
              icon={Download}
              onClick={handleExport}
              size="md"
              disabled={matchingRegistrations.length === 0 || isExporting}
              isLoading={isExporting}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-1">
        {/* 1. FILTER SETTINGS CARD */}
        <div className="bg-white rounded-2xl border border-gray-100/90 shadow-custom p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-tight">
            <Filter size={14} className="text-orange-500" />
            <span>1. Thiết lập Bộ Lọc Xuất File</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectComponent
              label="Loại hình dịch vụ (Booking Type)"
              value={selectedType}
              onChange={(val: any) => setSelectedType(val as string)}
              options={bookingTypeOptions}
            />

            <SelectComponent
              label="Trạng thái đăng ký"
              value={selectedStatus}
              onChange={(val: any) => setSelectedStatus(val as string)}
              options={statusOptions}
            />

            <div className="md:col-span-2">
              <SelectComponent
                label="Chọn Khóa học / Dịch vụ cụ thể"
                value={selectedCourse}
                onChange={(val: any) => setSelectedCourse(val as string)}
                options={courseTitleOptions}
              />
            </div>
          </div>
        </div>

        {/* 2. COLUMN SELECT CARD */}
        <div className="bg-white rounded-2xl border border-gray-100/90 shadow-custom p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-tight">
              <Layers size={14} className="text-orange-500" />
              <span>2. Chọn Các Cột Dữ Liệu Xuất</span>
              <span className="text-[10px]  text-gray-700 font-normal">
                ({selectedColumns.length}/{AVAILABLE_COLUMNS.length} cột được chọn)
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectAllColumns}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              {selectedColumns.length === AVAILABLE_COLUMNS.length ? (
                <>
                  <CheckSquare size={13} />
                  <span>Chọn cơ bản</span>
                </>
              ) : (
                <>
                  <Square size={13} />
                  <span>Chọn tất cả ({AVAILABLE_COLUMNS.length} cột)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
            {AVAILABLE_COLUMNS.map((col) => {
              const isChecked = selectedColumns.includes(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => toggleColumn(col.key)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer active:scale-98 select-none ${
                    isChecked
                      ? "bg-orange-50/70 border-orange-200 text-orange-950 font-semibold shadow-2xs"
                      : "bg-gray-50/70 border-gray-100 text-gray-500 hover:bg-gray-100/70"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                      isChecked ? "bg-orange-500 text-white" : "border border-gray-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span className="truncate">{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PREVIEW SAMPLE TABLE */}
        {matchingRegistrations.length > 0 && (
          <div className="bg-gray-50/60 rounded-2xl border border-gray-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-gray-700 uppercase tracking-tight">Xem trước dữ liệu mẫu (3 bản ghi đầu):</span>
              <span className=" text-gray-700">Tổng số: {matchingRegistrations.length} bản ghi</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-gray-100/70 text-gray-700 font-bold border-b border-gray-200">
                    <th className="p-2.5">Họ và tên</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Khóa học / Dịch vụ</th>
                    <th className="p-2.5">Thẻ On-Chainpass</th>
                    <th className="p-2.5">Hạng thẻ</th>
                    <th className="p-2.5">Học phí</th>
                    <th className="p-2.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {matchingRegistrations.slice(0, 3).map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/30">
                      <td className="p-2.5 font-bold text-gray-800">{item.full_name || item.users?.full_name || "—"}</td>
                      <td className="p-2.5 text-gray-600 font-mono text-[10.5px]">{item.email}</td>
                      <td className="p-2.5 text-gray-800 truncate max-w-42.5" title={item.booking_title}>
                        {item.booking_title}
                      </td>
                      <td className="p-2.5 font-mono text-gray-700">
                        {item.card?.so_the ? (
                          <span className="font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">#{item.card.so_the}</span>
                        ) : (
                          <span className=" text-gray-700 italic">Chưa cấp thẻ</span>
                        )}
                      </td>
                      <td className="p-2.5 font-bold text-gray-700">{item.card?.loai_the || "—"}</td>
                      <td className="p-2.5 text-emerald-700 font-bold">{(item.tuition_fee ?? item.tuitionFee ?? 0).toLocaleString("vi-VN")} đ</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};
