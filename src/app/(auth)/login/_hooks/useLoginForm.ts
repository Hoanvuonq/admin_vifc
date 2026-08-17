import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, UseFormProps } from "react-hook-form";
import { LoginRequest, loginSchema } from "../_constants/loginSchema";

export const useLoginForm = (options?: UseFormProps<LoginRequest>) => {
  return useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
    ...options,
  });
};
