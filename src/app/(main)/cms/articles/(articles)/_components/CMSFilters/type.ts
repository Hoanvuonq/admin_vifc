export interface CMSFiltersProps {
  counts: {
    total: number;
    published: number;
    draft: number;
    pendingReview: number;
    archived: number;
  };
}
