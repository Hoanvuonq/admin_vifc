import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, UseFormProps } from "react-hook-form";
import * as Yup from "yup";
import { UserItem } from "../../_pages/types";

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  status: UserItem["status"];
  subscriptionPlanId?: string;
  company?: string;
  country?: string;
  avatarUrl?: string;
  avatarFile?: File | null;
}

export const userSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Vui lòng nhập Họ và tên đầy đủ")
    .min(2, "Họ và tên tối thiểu 2 ký tự"),
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập Địa chỉ Email")
    .email("Email không đúng định dạng"),
  phone: Yup.string().optional().default(""),
  password: Yup.string().optional().default(""),
  confirmPassword: Yup.string()
    .optional()
    .default("")
    .test("passwords-match", "Mật khẩu xác nhận không trùng khớp", function (value) {
      const { password } = this.parent;
      if (!password) return true;
      return password === value;
    }),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE", "BANNED"])
    .required("Vui lòng chọn trạng thái"),
  subscriptionPlanId: Yup.string().optional().default(""),
  company: Yup.string().optional().default(""),
  country: Yup.string().optional().default(""),
});

export const useUserForm = (options?: UseFormProps<UserFormData>) => {
  return useForm<UserFormData>({
    resolver: yupResolver(userSchema) as any,
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      status: "ACTIVE",
      subscriptionPlanId: "",
      company: "",
      country: "Việt Nam",
      avatarUrl: "",
      avatarFile: null,
    },
    ...options,
  });
};
