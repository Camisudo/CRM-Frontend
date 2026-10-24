import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useUIStore } from "./store/uiStore";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import "./index.css";

function errorMessageFrom(error: unknown): string {
  const apiMessage = (error as { response?: { data?: { error?: { message?: string } } } })
    ?.response?.data?.error?.message;
  return apiMessage || (error instanceof Error ? error.message : "Something went wrong");
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _vars, _ctx, mutation) => {
      const message = (mutation.meta as { successMessage?: string } | undefined)?.successMessage;
      if (message) useUIStore.getState().showNotification({ type: "success", message });
    },
    onError: (error, _vars, _ctx, mutation) => {
      const message = (mutation.meta as { errorMessage?: string } | undefined)?.errorMessage;
      useUIStore.getState().showNotification({
        type: "error",
        message: message ? `${message}: ${errorMessageFrom(error)}` : errorMessageFrom(error),
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
