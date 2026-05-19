import { NavigationProgress, SmoothScroll } from "@/components";
import { ClientProviders, ToastProvider } from "@/providers";
import type { Metadata } from "next";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin",
    description: "VIFC Admin Portal",
    icons: {
      icon: [
        { url: "/favicon.ico" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased w-full" suppressHydrationWarning>
        <NavigationProgress />
        <SmoothScroll />
        <ClientProviders>
          {children}
          <ToastProvider />
        </ClientProviders>
      </body>
    </html>
  );
}