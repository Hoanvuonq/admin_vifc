import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, UseFormProps } from "react-hook-form";
import * as Yup from "yup";
import { UserItem } from "../../_pages/types";

export interface CreateUserFormData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  isVIFCPass?: boolean;
  status: UserItem["status"];
  subscriptionPlanId?: string;
  company?: string;
  country?: string;
  avatarUrl?: string;
  avatarFile?: File | null;
}

export const createUserSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Vui lòng nhập Họ và tên đầy đủ")
    .min(2, "Họ và tên tối thiểu 2 ký tự"),
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập Địa chỉ Email")
    .email("Email không đúng định dạng"),
  phone: Yup.string().optional().default(""),
  password: Yup.string()
    .trim()
    .required("Vui lòng nhập Mật khẩu khởi tạo")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .test("passwords-match", "Mật khẩu xác nhận không trùng khớp", function (value) {
      const { password } = this.parent;
      return password === value;
    }),
  isVIFCPass: Yup.boolean().optional().default(false),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE", "BANNED"])
    .required("Vui lòng chọn trạng thái"),
  subscriptionPlanId: Yup.string().optional().default(""),
  company: Yup.string().optional().default(""),
  country: Yup.string().optional().default("Việt Nam"),
});

export const useCreateUserForm = (options?: UseFormProps<CreateUserFormData>) => {
  return useForm<CreateUserFormData>({
    resolver: yupResolver(createUserSchema) as any,
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
