"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PrivateRoute from "@/auth/_components/PrivateRoute";
import { PUBLIC_ROUTES, PUBLIC_PREFIXES } from "@/auth/_config/auth.config";

const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

interface AuthRouteGuardProps {
  children: ReactNode;
}

export const AuthRouteGuard = ({ children }: AuthRouteGuardProps) => {
  const pathname = usePathname();

  if (pathname && isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return <PrivateRoute>{children}</PrivateRoute>;
}
