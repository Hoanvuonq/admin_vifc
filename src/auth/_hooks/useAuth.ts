import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/app/(auth)/login/_constants/formSchema";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Login failed");
      }

      if (json.data?.access_token) {
        localStorage.setItem("access_token", json.data.access_token);
        localStorage.setItem("user_info", JSON.stringify(json.data));
      }

      return json.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    router.replace("/login");
  }, [router]);

  return { login, logout, loading, error };
}

interface VerifyOptions {
  redirectOnFailure?: boolean;
  autoVerify?: boolean;
}

export function useAuthVerification({ redirectOnFailure = true, autoVerify = true }: VerifyOptions = {}) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    loading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    if (!autoVerify) return;

    const verify = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const userInfoStr = localStorage.getItem("user_info");
        setState({
          authenticated: true,
          loading: false,
          error: null,
          user: userInfoStr ? JSON.parse(userInfoStr) : null,
        });
      } else {
        setState({
          authenticated: false,
          loading: false,
          error: "Not authenticated",
          user: null,
        });
        if (redirectOnFailure) {
          router.replace("/login");
        }
      }
    };

    verify();
  }, [autoVerify, redirectOnFailure, router]);

  return state;
}
