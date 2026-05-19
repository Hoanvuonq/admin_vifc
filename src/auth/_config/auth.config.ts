import { RoleEnum } from "@/auth/_types/auth";

export const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/products",
  "/category",
  "/data-deletion",
  "/403",
  "/verify",
  "/forgot-password",
]);

export const PUBLIC_PREFIXES = [

  "/dashboard",
];

export const ROUTE_PERMISSIONS: Record<string, RoleEnum[]> = {
  "/dashboard": [RoleEnum.ADMIN],
};
