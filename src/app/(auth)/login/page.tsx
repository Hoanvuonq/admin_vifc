import { LoginScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "VIFC - Login Page",
    description: "Login to VIFC",
};

export default function Login() {
    return <LoginScreen />;
}