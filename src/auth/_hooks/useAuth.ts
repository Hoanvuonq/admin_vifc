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

export const doRefreshToken = async () => {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
    });
    const json = await res.json();
    if (res.ok && json.success) {
      localStorage.setItem("access_token", json.data.access_token);
      const userInfoStr = localStorage.getItem("user_info");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userInfo.access_token = json.data.access_token;
        userInfo.expires_at = json.data.expires_at;
        localStorage.setItem("user_info", JSON.stringify(userInfo));
      }
      return json.data;
    }
    throw new Error("Refresh failed");
  } catch (err) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    window.location.href = "/login";
    throw err;
  }
};

export function useAuthVerification({
  redirectOnFailure = true,
  autoVerify = true,
}: VerifyOptions = {}) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    loading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    if (!autoVerify) return;

    let timeoutId: NodeJS.Timeout;

    const verify = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const userInfoStr = localStorage.getItem("user_info");
        const user = userInfoStr ? JSON.parse(userInfoStr) : null;

        if (user && user.expires_at) {
          const expiresInMs = user.expires_at * 1000 - Date.now();
          if (expiresInMs < 60000) {
            try {
              await doRefreshToken();
              // Re-run verify after refresh to get updated token and schedule next refresh
              verify();
              return;
            } catch (err) {
              return; // doRefreshToken already handles redirection
            }
          } else {
            timeoutId = setTimeout(() => {
              verify();
            }, expiresInMs - 60000);
          }
        }

        setState({
          authenticated: true,
          loading: false,
          error: null,
          user,
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

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [autoVerify, redirectOnFailure, router]);

  return state;
}
