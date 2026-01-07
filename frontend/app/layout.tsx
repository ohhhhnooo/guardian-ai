import type { Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { getQueryClient } from "@/lib/queryClient";
import { theme } from "@/theme/theme";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Guardian AI – Drone Flight Weather Assistant",
  description:
    "Weather-aware flight planning and safety analytics for drone operations."
};

const queryClient = getQueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <CssBaseline />
                <ClientLayout>{children}</ClientLayout>
                <ReactQueryDevtools initialIsOpen={false} />
              </SnackbarProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}


