/**
 * Analytics & Monitoring Utility
 * Tracks user behavior, errors, and performance metrics
 */

import type { ErrorInfo } from "react";

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
}

interface ErrorData {
  error: Error;
  errorInfo?: ErrorInfo;
  context?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
}

class Analytics {
  private isInitialized = false;
  private isDevelopment = import.meta.env.DEV;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    // Initialize analytics only in production
    if (!this.isDevelopment) {
      // Google Analytics 4 initialization (if GA_MEASUREMENT_ID is set)
      const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (gaMeasurementId) {
        this.initGA4(gaMeasurementId);
      }

      // Initialize Web Vitals monitoring
      this.initWebVitals();
    }

    this.isInitialized = true;
    this.log("Analytics initialized");
  }

  private initGA4(measurementId: string) {
    // Load Google Analytics 4 script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", measurementId, {
      send_page_view: false, // We'll manually track page views
    });

    this.log("GA4 initialized with ID:", measurementId);
  }

  private initWebVitals() {
    // Web Vitals will be imported dynamically when needed
    this.log("Web Vitals monitoring ready");
  }

  /**
   * Track page view
   */
  pageView(data: PageViewData) {
    this.log("Page view:", data);

    if (!this.isDevelopment && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: data.path,
        page_title: data.title,
        page_referrer: data.referrer,
      });
    }
  }

  /**
   * Track custom event
   */
  event(event: AnalyticsEvent) {
    this.log("Event:", event);

    if (!this.isDevelopment && window.gtag) {
      window.gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  /**
   * Track user signup
   */
  trackSignup(method: "email" | "google" | "github") {
    this.event({
      category: "User",
      action: "signup",
      label: method,
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: "email" | "google" | "github") {
    this.event({
      category: "User",
      action: "login",
      label: method,
    });
  }

  /**
   * Track button/CTA clicks
   */
  trackClick(elementName: string, location?: string) {
    this.event({
      category: "Engagement",
      action: "click",
      label: location ? `${elementName} - ${location}` : elementName,
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(formName: string, success: boolean) {
    this.event({
      category: "Form",
      action: success ? "submit_success" : "submit_error",
      label: formName,
    });
  }

  /**
   * Track errors
   */
  trackError(data: ErrorData) {
    this.log("Error:", data.error, data.errorInfo);

    const errorMessage = data.error.message || "Unknown error";
    const errorStack = data.error.stack || "";

    this.event({
      category: "Error",
      action: data.context || "runtime_error",
      label: `${errorMessage} | ${errorStack.substring(0, 150)}`,
    });

    // Send to error tracking service (e.g., Sentry)
    if (!this.isDevelopment) {
      // If you integrate Sentry or similar:
      // Sentry.captureException(data.error, { contexts: { react: data.errorInfo } });
      console.error("Error tracked:", errorMessage);
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: PerformanceMetric) {
    this.log("Performance:", metric);

    if (!this.isDevelopment && window.gtag) {
      window.gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: metric.name,
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }
  }

  /**
   * Track Core Web Vitals
   */
  async trackWebVitals() {
    try {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import(
        "web-vitals"
      );

      const sendToAnalytics = (metric: PerformanceMetric) => {
        this.trackPerformance(metric);
      };

      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);

      this.log("Web Vitals tracking active");
    } catch (error) {
      this.log("Web Vitals library not available:", error);
    }
  }

  /**
   * Set user ID (for authenticated users)
   */
  setUserId(userId: string) {
    this.log("User ID set:", userId);

    if (!this.isDevelopment && window.gtag) {
      window.gtag("config", import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, string | number | boolean>) {
    this.log("User properties:", properties);

    if (!this.isDevelopment && window.gtag) {
      window.gtag("set", "user_properties", properties);
    }
  }

  /**
   * Console log for development
   */
  private log(...args: unknown[]) {
    if (this.isDevelopment) {
      console.log("[Analytics]", ...args);
    }
  }
}

// Singleton instance
const analytics = new Analytics();

export default analytics;

// Type augmentation for window.gtag
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
}

