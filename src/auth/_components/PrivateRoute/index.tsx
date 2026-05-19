"use client";

import { ReactNode } from "react";
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
  // const { authenticated, loading, error } = useAuthVerification({
  //   redirectOnFailure,
  //   autoVerify: true,
  // });

  // if (loading) {
  //   return (
  //     loadingComponent || (
  //       <div
  //         suppressHydrationWarning={true}
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           minHeight: "100vh",
  //         }}
  //       >
  //         <SectionLoading
  //           message="Đang xác thực..."
  //         />
  //       </div>
  //     )
  //   );
  // }

  // if (!authenticated) {
  //   if (fallbackComponent) {
  //     return <>{fallbackComponent}</>;
  //   }
  //   return null;
  // }

  return <>{children}</>;
}
