"use client";

import { AppPopover, LanguageSwitcher } from "@/components";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Gem,
  LogOut,
  ShieldCheck,
  Store,
  Wallet,
  Heart,
  LayoutDashboard,
  LogIn,
  Package,
  Settings,
  User,
  UserPlus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuItem } from "./type";

export const GUEST_MENU_ITEMS: MenuItem[] = [
  { key: "login", label: "Login", href: "/login", icon: <LogIn size={16} /> },
  { key: "register", label: "Register", href: "/register", icon: <UserPlus size={16} /> },
];

export const BUYER_MENU_ITEMS: MenuItem[] = [
  { key: "profile", label: "Profile", href: "/profile", icon: <User size={16} /> },
  { key: "orders", label: "Orders", href: "/orders", icon: <Package size={16} /> },
  { key: "wishlist", label: "Wishlist", href: "/wishlist", icon: <Heart size={16} /> },
];

export const SHOP_MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Shop Dashboard", href: "/shop/dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "profile", label: "Shop Profile", href: "/shop/profile", icon: <Store size={16} /> },
  { key: "settings", label: "Shop Settings", href: "/shop/settings", icon: <Settings size={16} /> },
];

export const EMPLOYEE_MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Employee Dashboard", href: "/employee/dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "profile", label: "Employee Profile", href: "/employee/profile", icon: <User size={16} /> },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { key: "admin_dash", label: "Admin Dashboard", href: "/admin/dashboard", icon: <ShieldCheck size={16} /> },
];

export const AccountDropdown = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActuallyAuthenticated = true;
  const isManagementRoute = true;
  const canShowLoyalty = true;
  const loyaltyData: any = { totalPointsAllShops: 0 };

  const [userData, setUserData] = useState({
    name: "Admin VIFC",
    email: "admin@vifc.vn",
    image: "/icons/icon_sidebar2.png",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutAction = () => {
    router.push("/login");
  };

  const hasRole = (role: string) => true;
  const shouldShowBlackText = true;

  const currentMenuItems = useMemo((): MenuItem[] => {
    if (!isActuallyAuthenticated) {
      return [...GUEST_MENU_ITEMS];
    }

    let items: MenuItem[] = [];
    if (pathname === "/shop" || pathname?.startsWith("/shop/")) {
      items = [...SHOP_MENU_ITEMS];
    } else if (pathname === "/employee" || pathname?.startsWith("/employee/")) {
      items = [...EMPLOYEE_MENU_ITEMS];
    } else if (pathname === "/admin" || pathname?.startsWith("/admin/")) {
      items = [...ADMIN_MENU_ITEMS];
    } else {
      items = [...BUYER_MENU_ITEMS];

      if (hasRole("SHOP")) {
        items.push({
          key: "go_shop",
          label: "Shop Dashboard",
          href: "/shop/dashboard",
          icon: <Store size={16} />
        });
      }
      if (hasRole("ADMIN")) {
        items.push({
          key: "go_admin",
          label: "Admin Dashboard",
          href: "/employee/dashboard",
          icon: <ShieldCheck size={16} />
        });
      }
    }

    items.push({
      key: "logout",
      label: "Logout",
      icon: <LogOut size={16} />,
      action: handleLogoutAction,
      isLogout: true,
    });
    return items;
  }, [isActuallyAuthenticated, pathname]);

  const Trigger = (
    <div
      className={cn(
        "flex items-center gap-2 px-2.5 py-1 rounded-full transition-all duration-500 cursor-pointer select-none group border",
        mounted && isActuallyAuthenticated
          ? "bg-slate-50/50 hover:bg-slate-100 border-slate-200/60 hover:border-slate-300 shadow-xs hover:shadow-orange-500/5"
          : "hover:bg-white/5 border-transparent"
      )}
    >
      <div className="relative">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 border transition-all duration-500 group-hover:ring-4 group-hover:ring-orange-500/10",
          mounted && isActuallyAuthenticated ? "border-slate-200" : "bg-gray-100 border-gray-200"
        )}>
          {mounted && isActuallyAuthenticated && userData.image ? (
            <Image
              src={userData.image}
              alt="avatar"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Image
                src="/icons/icon_sidebar2.png"
                alt="user icon"
                width={14}
                height={14}
                className="object-contain opacity-80"
              />
            </div>
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
      </div>

      <div className="hidden md:flex flex-col items-start min-w-0 pr-1">
        <span className={cn(
          "font-bold text-[11px] uppercase tracking-tighter px-1 truncate max-w-[120px] leading-tight transition-colors italic text-gray-900"
        )}>
          {mounted ? (isActuallyAuthenticated ? userData.name : "Account") : "Account"}
        </span>
        {mounted && canShowLoyalty && (
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-all pl-1">
            <div className="w-3 h-3 rounded-full bg-orange-500/20 flex items-center justify-center ring-1 ring-orange-500/40">
              <Wallet size={7} className="text-orange-500" />
            </div>
            <span className="text-orange-400 font-bold text-[9px] tabular-nums tracking-tighter">
              {formatNumber(loyaltyData?.totalPointsAllShops || 0)}
            </span>
          </div>
        )}
      </div>

      <ChevronDown size={12} className={cn(
        "transition-all hidden md:flex duration-500 ml-0.5 opacity-40 group-hover:opacity-100 group-hover:rotate-180 text-gray-500"
      )} />
    </div>
  );

  return (
    <AppPopover trigger={Trigger} className="w-76 mt-2 animate-in fade-in zoom-in-95 duration-300" align="right" contentClassName="overflow-visible ">
      {mounted && isActuallyAuthenticated && (
        <div className="relative bg-linear-to-br from-white to-orange-50/30 border-b border-gray-100/50 rounded-t-4xl">
          <div className="absolute inset-0 overflow-hidden rounded-t-4xl pointer-events-none opacity-5">
            <div className="absolute top-0 right-0 p-4">
              <Gem size={120} className="text-orange-500 rotate-12" />
            </div>
          </div>

          <div className="px-5 pt-6 pb-5 relative z-10">
            <div className="flex items-start  justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 all-center rounded-2xl overflow-hidden shadow-xl border-2 border-orange-500 bg-white ring-4 ring-orange-500/10">
                    {userData.image ? (
                      <Image src={userData.image} alt="avatar" width={64} height={64} className="object-cover w-10 h-10" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500">
                        <Image
                          src="/icons/icon_sidebar2.png"
                          alt="user icon"
                          width={10}
                          height={10}
                          className="object-contain opacity-80"
                        />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-lg shadow-xl ring-2 ring-white z-20">
                    <ShieldCheck size={12} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <h4 className="font-extrabold text-gray-900 text-base truncate leading-tight uppercase tracking-tighter italic">
                    {userData.name}
                  </h4>
                  <div className="mt-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-gray-500 font-bold tracking-tight truncate max-w-[120px]">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 -mt-4 md:hidden block">
                <LanguageSwitcher
                  dropdownPosition="bottom"
                  buttonClassName="h-7 w-[70px] text-[10px] justify-between px-2 rounded-xl bg-white shadow-sm border border-gray-100"
                />
              </div>
            </div>


            {canShowLoyalty && (
              <div className="grid grid-cols-2 gap-2.5 mt-5 itim-regular">
                {[
                  {
                    key: "points",
                    label: "Reward Points",
                    value: "0",
                    iconBg: "/icons/icon-loyalty.png",
                    iconValue: "/icons/icon-loyalty.png",
                    gradient: "to-orange-50/50",
                    valueClass: "text-2xl text-orange-500 tabular-nums",
                    iconClass: "w-3.5 h-3.5"
                  },
                  {
                    key: "rank",
                    label: "Membership Rank",
                    value: "Silver",
                    iconBg: "/icons/icon-rank.png",
                    iconValue: "/icons/icon-rank.png",
                    gradient: "to-blue-50/50",
                    valueClass: "text-sm text-blue-600 tracking-tight",
                    iconClass: "w-6 h-6 -mt-0.5"
                  }
                ].map((stat) => (
                  <motion.div
                    key={stat.key}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className={cn(
                      "relative group/card overflow-hidden rounded-2xl p-3 border border-white/60 shadow-glass bg-linear-to-br from-white/90 backdrop-blur-xl",
                      stat.gradient
                    )}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-12 h-12 opacity-15 group-hover/card:scale-110 group-hover/card:rotate-12 transition-all duration-700 pointer-events-none">
                      <Image src={stat.iconBg} alt="icon" fill className="object-contain" />
                    </div>

                    <div className="relative z-10">
                      <p className="text-[8px] uppercase font-bold text-gray-500 mb-1 tracking-widest italic">
                        {stat.label}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "font-bold uppercase italic drop-shadow-sm leading-none",
                          stat.valueClass
                        )}>
                          {stat.value}
                        </span>
                        <div className={cn("relative", stat.iconClass)}>
                          <Image src={stat.iconValue} alt="icon" fill className="object-contain" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-3 space-y-1 bg-white rounded-xl">

        {mounted && currentMenuItems.map((item) => {
          const isLogout = item.isLogout;

          const normalizedPath = pathname?.replace(/^\/([a-z]{2}(-[a-z]{2})?)(\/|$)/, "$3") || "/";
          const finalPath = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
          const isActive = !isLogout && item.href && (finalPath === item.href || (item.href !== "/" && finalPath.startsWith(item.href + "/")));

          return (
            <div key={item.key}>
              {isLogout && <div className="h-px bg-gray-50 my-2 mx-4" />}
              <Link
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
                className={cn(
                  "group flex items-center gap-3 px-2.5 py-2 rounded-2xl transition-all duration-300 w-full relative overflow-hidden",
                  isLogout
                    ? "hover:bg-rose-50 text-rose-600"
                    : isActive
                      ? "bg-slate-50 text-orange-600 shadow-sm"
                      : "hover:bg-slate-50 text-gray-700"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500",
                  isLogout
                    ? "bg-rose-100 text-rose-600 group-hover:rotate-12"
                    : isActive
                      ? "bg-white shadow-md text-orange-600 ring-1 ring-orange-500/10"
                      : "bg-slate-100 text-gray-500 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-orange-500/10 group-hover:text-orange-600 group-hover:-translate-y-0.5"
                )}>
                  {item.icon}
                </div>
                <span className={cn(
                  "flex-1 text-[13px] font-bold tracking-tight italic transition-colors",
                  isActive ? "text-orange-600" : ""
                )}>
                  {item.label}
                </span>
                {!isLogout && (
                  <ChevronRight size={14} className={cn(
                    "text-gray-200 transition-all duration-500",
                    isActive ? "opacity-100 translate-x-1 text-orange-400" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  )} />
                )}

                {!isLogout && (
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 left-0 w-1 transition-all duration-500 rounded-r-full bg-orange-500",
                    isActive ? "h-6 opacity-100 shadow-[0_0_12px_rgba(249,115,22,0.5)]" : "h-0 opacity-0"
                  )} />
                )}
              </Link>
            </div>
          );
        })}


      </div>

      <div className="px-6 py-3 bg-gray-50/50 rounded-b-4xl border-t border-gray-50 flex justify-center">
        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
          Verified Protocol • {dayjs().format("YYYY")}
        </p>
      </div>
    </AppPopover>
  );
};