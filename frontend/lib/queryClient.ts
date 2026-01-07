import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
          staleTime: 60_000
        }
      }
    });
  }
  return queryClient;
};


