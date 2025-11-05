/**
 * Analytics Utility
 * Centralized analytics tracking for the application
 * 
 * Usage:
 * import { analytics } from '@/utils/analytics'
 * analytics.track('button_clicked', { location: 'hero' })
 */

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

class Analytics {
  private enabled: boolean

  constructor() {
    // Enable analytics in production only
    this.enabled = import.meta.env.PROD
  }

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: EventProperties) {
    if (!this.enabled) {
      console.log('[Analytics]', eventName, properties)
      return
    }

    // TODO: Integrate with analytics service
    // Examples:
    // - Google Analytics 4: gtag('event', eventName, properties)
    // - Mixpanel: mixpanel.track(eventName, properties)
    // - Amplitude: amplitude.track(eventName, properties)
    
    try {
      // Google Analytics 4 example
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, properties)
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error)
    }
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    if (!this.enabled) {
      console.log('[Analytics] Page view:', path, title)
      return
    }

    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_path: path,
          page_title: title,
        })
      }
    } catch (error) {
      console.error('[Analytics] Error tracking page view:', error)
    }
  }

  /**
   * Track CTA click
   */
  trackCTA(location: string, label: string) {
    this.track('cta_clicked', {
      location,
      label,
    })
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, success: boolean) {
    this.track('form_submitted', {
      form_name: formName,
      success,
    })
  }

  /**
   * Track navigation
   */
  trackNavigation(from: string, to: string) {
    this.track('navigation', {
      from,
      to,
    })
  }
}

export const analytics = new Analytics()

