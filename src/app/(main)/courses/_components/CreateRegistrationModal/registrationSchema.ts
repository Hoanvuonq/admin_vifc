import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, UseFormProps } from "react-hook-form";
import * as Yup from "yup";

export interface CreateRegistrationFormData {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  bookingTitle: string;
  bookingType: "course" | "workshop" | "meeting-room" | "lounge";
  tuitionFee?: number;
  deposit?: number;
  note?: string;
  status?: "pending" | "confirmed" | "approved" | "rejected" | "cancelled";
}

export const createRegistrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required("Vui lòng nhập Họ và tên học viên")
    .min(2, "Họ tên tối thiểu 2 ký tự"),
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập Email liên hệ")
    .email("Email không đúng định dạng"),
  phone: Yup.string().trim().optional().default(""),
  company: Yup.string().trim().optional().default(""),
  bookingTitle: Yup.string()
    .trim()
    .required("Vui lòng nhập tên khóa học / dịch vụ đăng ký"),
  bookingType: Yup.string()
    .oneOf(["course", "workshop", "meeting-room", "lounge"])
    .required("Vui lòng chọn loại hình dịch vụ")
    .default("course"),
  tuitionFee: Yup.number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .min(0, "Học phí không được âm")
    .optional()
    .default(0),
  deposit: Yup.number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .min(0, "Tiền cọc không được âm")
    .optional()
    .default(0),
  note: Yup.string().trim().optional().default(""),
});

export const useCreateRegistrationForm = (
  options?: UseFormProps<CreateRegistrationFormData>
) => {
  return useForm<CreateRegistrationFormData>({
    resolver: yupResolver(createRegistrationSchema) as any,
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      bookingTitle: "",
      bookingType: "course",
      tuitionFee: 0,
      deposit: 0,
      note: "",
    },
    ...options,
  });
};
