export interface CMSFiltersProps {
  searchText: string;
  setSearchText: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  counts: {
    total: number;
    published: number;
    draft: number;
    pendingReview: number;
    archived: number;
  };
  onReset: () => void;
  onAddClick: () => void;
}
