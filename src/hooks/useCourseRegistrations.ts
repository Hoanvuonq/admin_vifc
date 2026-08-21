import { bookingAdminApi } from "@/services/bookingAdminApi";
import { CourseRegistrationStats, CreateBookingPayload, ReviewBookingPayload } from "@/types/course";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["course-registrations", page, limit, status, bookingType, search],
    queryFn: async () => {
      return await bookingAdminApi.getAllBookings({
        page,
        limit,
        status,
        bookingType,
        search,
      });
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const registrations = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const stats: CourseRegistrationStats = data?.stats || {
    total: total,
    pending: registrations.filter((i) => (i.status || "").toLowerCase() === "pending").length,
    approved: registrations.filter((i) => ["confirmed", "approved"].includes((i.status || "").toLowerCase())).length,
    rejected: registrations.filter((i) => (i.status || "").toLowerCase() === "rejected").length,
    completed: registrations.filter((i) => ["cancelled", "completed"].includes((i.status || "").toLowerCase())).length,
  };

  const reviewMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ReviewBookingPayload }) => {
      return await bookingAdminApi.reviewBooking(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-registrations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await bookingAdminApi.deleteBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-registrations"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<CreateBookingPayload>) => {
      return await bookingAdminApi.createBooking(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-registrations"] });
    },
  });

  return {
    registrations,
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
