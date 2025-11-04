import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import analytics from "@/lib/analytics";

/**
 * Custom hook to track page views automatically
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackWebVitals();
  }, []);

  useEffect(() => {
    // Track page view on route change
    analytics.pageView({
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location]);
}

