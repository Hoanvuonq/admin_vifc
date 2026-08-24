import { LoginScreen } from "./_pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "On-Chainpass - Login Page",
    description: "Login to On-Chainpass",
};

export default function Login() {
    return <LoginScreen />;
}