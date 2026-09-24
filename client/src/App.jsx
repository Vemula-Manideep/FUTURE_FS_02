import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { Skeleton } from "./components/ui/skeleton";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const LeadsPage = lazy(() => import("./features/leads/LeadsPage").then((module) => ({ default: module.LeadsPage })));
const PipelinePage = lazy(() => import("./features/leads/PipelinePage").then((module) => ({ default: module.PipelinePage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

function Placeholder({ title }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">This module is wired into navigation and ready for the next implementation slice.</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Suspense fallback={<Skeleton className="h-96 w-full" />}><DashboardPage /></Suspense>} />
                <Route path="leads" element={<Suspense fallback={<Skeleton className="h-96 w-full" />}><LeadsPage /></Suspense>} />
                <Route path="pipeline" element={<Suspense fallback={<Skeleton className="h-96 w-full" />}><PipelinePage /></Suspense>} />
                <Route path="analytics" element={<Suspense fallback={<Skeleton className="h-96 w-full" />}><DashboardPage /></Suspense>} />
                <Route path="notifications" element={<Placeholder title="Notifications" />} />
                <Route path="settings" element={<Placeholder title="Workspace settings" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
