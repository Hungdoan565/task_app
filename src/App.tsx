import { useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import NotFound from "./pages/NotFound";

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

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
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

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;