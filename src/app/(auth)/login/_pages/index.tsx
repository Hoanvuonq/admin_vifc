"use client";

import { toast } from "@/providers/ToastProvider";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FormInput, PremiumButton } from "@/components";
import { LeftSideForm, SocialButton } from "../_components";
import { LoginRequest } from "../_constants/formSchema";
import { useAuth } from "@/auth/_hooks/useAuth";

const CONFIG = {
  storageKeyUser: "user_username",
  storageKeyEmail: "user_email",
  storageKeyPass: "user_password",
  panelType: "default",
  welcomeTitle: "Welcome Back! 👋",
  welcomeDesc: "Log in to continue exploring the ecosystem",
  forgotPassLink: "/forgot-password",
  registerLink: "/register",
  homeLink: "/",
  homeText: "Back to Home",
};

const validateForm = (values: LoginRequest): Partial<LoginRequest> | null => {
  let errors: Partial<LoginRequest> = {};
  if (!values.username || values.username.trim() === "") {
    errors.username = "Username is required.";
  }
  if (!values.password || values.password.trim() === "") {
    errors.password = "Password is required.";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

export const LoginScreen = () => {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});
  const [submitting, setSubmitting] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState({ GOOGLE: false, FACEBOOK: false });

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      router.replace("/");
      return;
    }

    usernameRef.current?.focus();

    const pendingUsername = localStorage.getItem(CONFIG.storageKeyUser);
    const pendingEmail = localStorage.getItem(CONFIG.storageKeyEmail);
    const pendingPassword = localStorage.getItem(CONFIG.storageKeyPass);

    const formValues: Partial<LoginRequest> = {};
    if (pendingUsername) {
      formValues.username = pendingUsername;
      localStorage.removeItem(CONFIG.storageKeyUser);
    } else if (pendingEmail) {
      formValues.username = pendingEmail;
      localStorage.removeItem(CONFIG.storageKeyEmail);
    }
    if (pendingPassword) {
      formValues.password = pendingPassword;
      localStorage.removeItem(CONFIG.storageKeyPass);
    }

    if (Object.keys(formValues).length > 0) {
      setFormData((prev) => ({ ...prev, ...formValues }));
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof LoginRequest]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm(formData);
    if (errors) {
      setFormErrors(errors);
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (loginType: "GOOGLE" | "FACEBOOK") => {
    setSocialLoginLoading((prev) => ({ ...prev, [loginType]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Initiated login with ${loginType}`);
    } catch (err: any) {
      toast.error(err?.message || "Connection error");
    } finally {
      setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full relative   bg-linear-to-br from-orange-50 via-white to-amber-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob bg-blue-200 dark:bg-blue-900"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bg-purple-200 dark:bg-purple-900"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 bg-pink-200 dark:bg-pink-900"></div>
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        <div className="hidden lg:flex lg:w-1/2 w-full items-center justify-center px-4 lg:px-12">
          <LeftSideForm type={CONFIG.panelType as any} />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="w-full max-w-[460px] relative z-10">
            <div className="relative p-px rounded-[48px] bg-linear-to-b from-zinc-200 via-transparent to-transparent">
              <div className="w-full bg-white/90 backdrop-blur-3xl px-8 py-10 rounded-[47px] shadow-custom">
                <div className="text-center flex flex-col items-center mb-8">
                  <div className="relative group mb-4">
                    <div className="absolute -inset-6 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-700" />
                    <Image
                      src="/icons/icon_sidebar2.png"
                      alt="Logo"
                      width={140}
                      height={140}
                      className="relative w-28 h-28 object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tighter italic uppercase leading-none">
                    {CONFIG.welcomeTitle}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium mt-3 tracking-wide">
                    {CONFIG.welcomeDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <SocialButton
                    provider="GOOGLE"
                    variant="orange"
                    onClick={() => handleSocialLogin("GOOGLE")}
                    loading={socialLoginLoading.GOOGLE}
                  />
                  <SocialButton
                    provider="FACEBOOK"
                    variant="blue"
                    onClick={() => handleSocialLogin("FACEBOOK")}
                    loading={socialLoginLoading.FACEBOOK}
                  />
                </div>

                <div className="flex items-center my-4">
                  <div className="grow h-px bg-zinc-100 " />
                  <span className="px-5 text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                    Or Login With
                  </span>
                  <div className="grow h-px bg-zinc-100 " />
                </div>

                <form onSubmit={onFinish} className="space-y-5">
                  <FormInput
                    label="Username or Email"
                    name="username"
                    placeholder="Enter your username or email"
                    ref={usernameRef as any}
                    value={formData.username}
                    onChange={handleInputChange}
                    error={formErrors.username as string}
                    className="mb-0"
                  />

                  <div className="space-y-3">
                    <FormInput
                      label="Password"
                      name="password"
                      placeholder="Enter your password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={formErrors.password as string}
                      className="mb-0"
                    />
                    <div className="flex justify-end pr-1">
                      <Link
                        href={CONFIG.forgotPassLink}
                        className={cn(
                          "relative text-[11px] font-bold uppercase text-orange-600 hover:text-orange-500 transition-colors",
                          "group inline-block"
                        )}
                      >
                        Forgot Password?
                        <span className="absolute left-0 bottom-[-2px] w-0 h-[1.5px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
                      </Link>
                    </div>
                  </div>

                  <PremiumButton
                    type="submit"
                    disabled={loading || submitting}
                    isLoading={loading || submitting}
                    className="w-full h-14 rounded-2xl text-[13px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 active:scale-[0.98] transition-all mt-6"
                    variant="orange"
                    block
                  >
                    Login
                  </PremiumButton>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 text-center space-y-5">
                  <p className="text-zinc-400 dark:text-zinc-500 text-[12px] font-medium tracking-wide">
                    Don't have an account?
                    <Link
                      className="text-orange-600 font-bold uppercase ml-2 hover:text-orange-500 transition-colors"
                      href={CONFIG.registerLink}
                    >
                      Register Now
                    </Link>
                  </p>

                  <Link
                    href={CONFIG.homeLink}
                    className={cn(
                      "group inline-flex items-center gap-2.5 transition-all duration-300",
                      "text-zinc-400 hover:text-orange-500",
                      "text-[11px] font-bold uppercase tracking-widest"
                    )}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Home size={16} strokeWidth={2.5} />
                    </motion.div>

                    <span className="relative">
                      {CONFIG.homeText}
                      <span className="absolute left-0 bottom-[-4px] w-0 h-[1.5px] bg-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};