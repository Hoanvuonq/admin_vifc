"use client";

import { ReactNode, useEffect, useState } from "react";
// import { useAuthVerification } from "@/auth/_hooks/useAuth";
import { SectionLoading } from "@/components";

interface PrivateRouteProps {
  children: ReactNode;
  redirectOnFailure?: boolean;
  loadingComponent?: ReactNode;
  fallbackComponent?: ReactNode;
}

export default function PrivateRoute({
  children,
  redirectOnFailure = true,
  loadingComponent,
  fallbackComponent,
}: PrivateRouteProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthenticated(true);
    } else if (redirectOnFailure) {
      window.location.href = "/login";
    }
    setLoading(false);
  }, [redirectOnFailure]);

  if (loading) {
    return (
      loadingComponent || (
        <div
          suppressHydrationWarning={true}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <SectionLoading message="Đang xác thực..." />
        </div>
      )
    );
  }

  if (!authenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return null;
  }

  return <>{children}</>;
}
