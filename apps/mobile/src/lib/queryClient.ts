import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes — avoids redundant refetches on tab focus
      retry: 2,
      refetchOnWindowFocus: false, // mobile: focus events are unreliable
    },
  },
});
