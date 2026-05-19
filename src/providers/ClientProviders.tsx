"use client";

import { AuthRouteGuard } from "@/auth";
import { TopLoadingBar } from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";

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
            <TopLoadingBar />
            <AuthRouteGuard>{children}</AuthRouteGuard>
        </QueryClientProvider>
        // </Provider >
    );
}
