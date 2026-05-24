import { create } from "zustand";

export interface ArticleListState {
  searchText: string;
  selectedCategory: string;
  selectedStatus: string;
  startDate: string;
  endDate: string;
  currentPage: number;
  pageSize: number;
  toast: { message: string; type: "success" | "info" | "warning" } | null;

  setSearchText: (text: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  resetFilters: () => void;
}

export const useArticleListStore = create<ArticleListState>((set) => ({
  searchText: "",
  selectedCategory: "ALL",
  selectedStatus: "ALL",
  startDate: "",
  endDate: "",
  currentPage: 0,
  pageSize: 10,
  toast: null,

  setSearchText: (searchText) => set({ searchText, currentPage: 0 }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, currentPage: 0 }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, currentPage: 0 }),
  setStartDate: (startDate) => set({ startDate, currentPage: 0 }),
  setEndDate: (endDate) => set({ endDate, currentPage: 0 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPageSize: (pageSize) => set({ pageSize }),

  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },

  resetFilters: () => {
    set({
      searchText: "",
      selectedCategory: "ALL",
      selectedStatus: "ALL",
      startDate: "",
      endDate: "",
      currentPage: 0,
    });
  },
}));
