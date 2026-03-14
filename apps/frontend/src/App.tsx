import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "./shared/hooks/useSession";
import { LoginPage } from "./shared/components/LoginPage";
import { BadgeHunterPage } from "./features/badge-hunter/BadgeHunterPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const session = useSession();

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) return <LoginPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <BadgeHunterPage />
    </QueryClientProvider>
  );
}

export default App;
