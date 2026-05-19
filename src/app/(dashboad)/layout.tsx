"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Header, Sidebar } from "@/layouts";
import { useAdminUIStore } from "@/components/AdminPageHeader";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const headerInfo = useAdminUIStore((state) => state.headerInfo);
    const scrollY = useAdminUIStore((state) => state.scrollY);
    const setScrollY = useAdminUIStore((state) => state.setScrollY);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-[#f5f7ff] text-gray-800 antialiased overflow-hidden">
            {!isMobile && (
                <div className="h-full shrink-0 z-40 relative">
                    <Sidebar />
                </div>
            )}

            <div
                className={cn(
                    "fixed inset-0 z-50 transition-opacity duration-300",
                    isMobile && mobileDrawerOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                )}
            >
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setMobileDrawerOpen(false)}
                />
                <div
                    className={cn(
                        "absolute left-0 top-0 w-64 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out",
                        mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <Header
                    headerInfo={headerInfo}
                    scrollY={scrollY}
                    onToggleSidebar={() => {
                        if (isMobile) {
                            setMobileDrawerOpen(!mobileDrawerOpen);
                        }
                    }}
                />
                <main
                    onScroll={(e) => {
                        setScrollY(e.currentTarget.scrollTop);
                    }}
                    className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#f5f5f5] custom-scrollbar"
                >
                    <div className="max-w-[1920px] mx-auto p-4 md:p-6 min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
