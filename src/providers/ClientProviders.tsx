"use client";

import { AuthRouteGuard } from "@/auth";
import { TopLoadingBar } from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { Suspense, useState } from "react";

if (typeof window !== "undefined") {
  // Setup Axios interceptor
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Setup Fetch interceptor
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    const token = localStorage.getItem("access_token");
    let newConfig: RequestInit = { ...(config || {}) };

    if (token) {
      newConfig.headers = {
        ...newConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return originalFetch(resource, newConfig);
  };
}

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    // <Provider>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <TopLoadingBar />
      </Suspense>
      <AuthRouteGuard>{children}</AuthRouteGuard>
    </QueryClientProvider>
    // </Provider >
  );
}
