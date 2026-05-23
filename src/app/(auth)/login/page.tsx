import type { Metadata } from "next";
import { LoginScreen } from "./_pages";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "Trang đăng nhập vào hệ thống Shop App",
};

export default function Login() {
    return <LoginScreen />;
}