import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { BookingRequestItem, CourseRegistrationStats, ReviewBookingPayload } from "@/types/course";
import { bookingAdminApi } from "@/services/bookingAdminApi";

export interface UseCourseRegistrationsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  bookingType?: string;
}

export interface ConfirmRejectBookingOptions {
  id: string;
  note?: string;
}

export const useCourseRegistrations = (
  paramsOrPage: UseCourseRegistrationsParams | number = 1,
  limitParam = 10,
  statusParam?: string,
  searchParam?: string,
  bookingTypeParam?: string,
) => {
  const isObject = typeof paramsOrPage === "object" && paramsOrPage !== null;
  const page = isObject ? (paramsOrPage.page ?? 1) : paramsOrPage;
  const limit = isObject ? (paramsOrPage.limit ?? 10) : limitParam;
  const status = isObject ? paramsOrPage.status : statusParam;
  const search = isObject ? paramsOrPage.search : searchParam;
  const bookingType = isObject ? paramsOrPage.bookingType : bookingTypeParam;
  const queryClient = useQueryClient();

  const {
    data: allBookings = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<BookingRequestItem[], Error>({
    queryKey: ["booking-requests"],
    queryFn: async () => {
      return await bookingAdminApi.getAllBookings();
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Client-side filtering and search
  let filtered = [...allBookings];

  if (status && status !== "ALL") {
    filtered = filtered.filter((item) => {
      const itemStatus = item.status.toLowerCase();
      const filterStatus = status.toLowerCase();
      if (filterStatus === "approved" || filterStatus === "confirmed") {
        return itemStatus === "approved" || itemStatus === "confirmed";
      }
      return itemStatus === filterStatus;
    });
  }

  if (bookingType && bookingType !== "ALL") {
    filtered = filtered.filter((item) => item.booking_type.toLowerCase() === bookingType.toLowerCase());
  }

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.id.toLowerCase().includes(s) ||
        item.full_name?.toLowerCase().includes(s) ||
        item.email?.toLowerCase().includes(s) ||
        item.booking_title?.toLowerCase().includes(s) ||
        item.phone?.toLowerCase().includes(s) ||
        item.company?.toLowerCase().includes(s),
    );
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  const paginatedRegistrations = filtered.slice(skip, skip + limit);

  // Dynamic stats calculation across all items
  const stats: CourseRegistrationStats = {
    total: allBookings.length,
    pending: allBookings.filter((i) => i.status.toLowerCase() === "pending").length,
    approved: allBookings.filter((i) => i.status.toLowerCase() === "confirmed" || i.status.toLowerCase() === "approved").length,
    rejected: allBookings.filter((i) => i.status.toLowerCase() === "rejected").length,
    completed: allBookings.filter((i) => i.status.toLowerCase() === "completed").length,
  };

  const reviewMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ReviewBookingPayload }) => {
      return await bookingAdminApi.reviewBooking(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await bookingAdminApi.deleteBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<BookingRequestItem>) => {
      return await bookingAdminApi.createBooking(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
    },
  });

  return {
    registrations: paginatedRegistrations,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
    stats,
    isLoading: isLoading || isFetching,
    error,
    refetch,
    reviewBooking: reviewMutation.mutateAsync,
    isUpdating: reviewMutation.isPending,
    confirmBooking: (params: string | ConfirmRejectBookingOptions, note?: string) => {
      const id = typeof params === "string" ? params : params.id;
      const finalNote = typeof params === "object" ? params.note : note;
      return reviewMutation.mutateAsync({
        id,
        payload: { status: "confirmed", note: finalNote || "Admin đã xác nhận qua hệ thống" },
      });
    },
    rejectBooking: (params: string | ConfirmRejectBookingOptions, note?: string) => {
      const id = typeof params === "string" ? params : params.id;
      const finalNote = typeof params === "object" ? params.note : note;
      return reviewMutation.mutateAsync({
        id,
        payload: { status: "rejected", note: finalNote || "Admin đã từ chối yêu cầu" },
      });
    },
    deleteRegistration: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    createRegistration: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
