import { create } from "zustand";
import { LucideIcon } from "lucide-react";
import { AdminPageHeaderMetric } from "@/components/AdminPageHeader/type";

interface HeaderInfo {
  title: string;
  highlightTitle?: string;
  subtitle?: string;
  icon?: LucideIcon;
  metrics?: AdminPageHeaderMetric[];
  actions?: React.ReactNode;
}

interface AdminUIState {
  headerInfo: HeaderInfo | null;
  setHeaderInfo: (info: HeaderInfo | null) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  headerInfo: null,
  setHeaderInfo: (info) => set({ headerInfo: info }),
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),
}));
