import { useForm, UseFormProps } from "react-hook-form";
import * as Yup from "yup";

export interface LoginRequest {
  username: string;
  password: string;
}

interface FormInput {
  username?: string;
  phone?: string;
  password: string;
}

export const loginSchema = Yup.object<FormInput>()
  .shape({
    username: Yup.string().optional(),

    phone: Yup.string()
      .optional()
      .nullable()
      .transform((value, originalValue) => {
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
          return undefined;
        }
        return originalValue;
      })
      .test(
        "is-number-valid",
        "Số điện thoại phải là số hợp lệ",
        function (value) {
          if (value === undefined || value === null || value === "") {
            return true;
          }
          if (!/^\d+$/.test(value)) {
            return this.createError({
              path: "phone",
              message: "Số điện thoại phải là số",
            });
          }
          return true;
        },
      ),

    password: Yup.string().required("Mật khẩu là bắt buộc"),
  })
  .test(
    "atLeastOne",
    "Vui lòng nhập Tên đăng nhập hoặc Số điện thoại",
    function (value) {
      if (value.username && value.username.length > 0) {
        return true;
      }

      if (value.phone && /^\d+$/.test(value.phone)) {
        return true;
      }

      return this.createError({
        path: "username",
        message: "Vui lòng nhập Tên đăng nhập hoặc Số điện thoại",
      });
    },
  );

interface UseLoginFormProps extends UseFormProps<LoginRequest> {}

export const useLoginForm = (props?: UseFormProps<FormInput>) => {
  return useForm<FormInput>({
    mode: "onSubmit",
    defaultValues: {
      username: "",
      phone: "",
      password: "",
    },
    ...props,
  });
};
