import * as Yup from "yup";

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginFormValues = LoginRequest;

export const loginSchema: Yup.ObjectSchema<LoginRequest> = Yup.object({
  username: Yup.string()
    .trim()
    .required("Vui lòng nhập Tên đăng nhập hoặc Email")
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
  password: Yup.string()
    .required("Vui lòng nhập Mật khẩu")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginSchemaType = typeof loginSchema;
