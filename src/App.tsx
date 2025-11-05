import { useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmDialogProvider } from "@/components/providers/ConfirmDialogProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { usePageTracking } from "./hooks/usePageTracking";
import SkipLink from "./components/ui/skip-link";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Downloads from "./pages/Downloads";
import Pricing from "./pages/Pricing";
import AIDevelopment from "./pages/AIDevelopment";
import Enterprise from "./pages/Enterprise";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import NotFound from "./pages/NotFound";

// Layout
import AppLayout from "./components/layout/AppLayout";

function ScrollToTop() {
    const { pathname } = useLocation();
  
    useLayoutEffect(() => {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
  
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }, [pathname]);
  
    return null;
  }

function PageTracking() {
  usePageTracking();
  return null;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ConfirmDialogProvider>
          <Router>
            <SkipLink />
            <ScrollToTop />
            <PageTracking />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/features" element={<Features />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/ai-development" element={<AIDevelopment />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes with Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="kanban" element={<Kanban />} />
                <Route path="tasks" element={<Dashboard />} />
                <Route path="calendar" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          </ConfirmDialogProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;