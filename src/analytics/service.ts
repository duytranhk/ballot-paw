/**
 * Analytics Service
 *
 * Main analytics service that handles all Google Analytics 4 interactions.
 * Provides a clean, typed API for tracking events throughout the app.
 */

import ReactGA from "react-ga4";
import { analyticsConfig, privacyConfig, rateLimitConfig, validateAnalyticsConfig } from "./config";
import { AnalyticsEvent } from "./types";
import type { EventParams, AnalyticsEventType, ScreenNameType } from "./types";

// Rate limiting state
const rateLimiter = {
  eventsThisMinute: 0,
  eventsThisSession: 0,
  lastMinuteReset: Date.now(),
  sessionStart: Date.now(),
};

class AnalyticsServiceImpl {
  private isInitialized = false;
  private isEnabled = false;

  /**
   * Initialize Google Analytics 4
   * Call this once when the app starts
   */
  async initialize(): Promise<void> {
    try {
      // Validate configuration
      if (!validateAnalyticsConfig()) {
        console.warn("Analytics: Invalid configuration, analytics disabled");
        return;
      }

      this.isEnabled = analyticsConfig.enabled;

      if (!this.isEnabled) {
        console.log("Analytics: Disabled via configuration");
        return;
      }

      // Check Do Not Track preference
      if (privacyConfig.respectDNT && navigator.doNotTrack === "1") {
        console.log("Analytics: Disabled due to Do Not Track preference");
        this.isEnabled = false;
        return;
      }

      // Initialize ReactGA
      ReactGA.initialize(analyticsConfig.measurementId, {
        // Debug mode
        gtagOptions: {
          debug_mode: analyticsConfig.debug,
          // Privacy settings
          anonymize_ip: privacyConfig.anonymizeIP,
          allow_google_signals: false, // Disable advertising features for privacy
          allow_ad_personalization_signals: false,
        },
      });

      this.isInitialized = true;
      console.log("Analytics: Initialized successfully");

      // Track app start
      this.trackEvent(AnalyticsEvent.APP_START, {
        is_returning_user: this.isReturningUser(),
        install_source: this.getInstallSource(),
      });
    } catch (error) {
      console.error("Analytics: Initialization failed", error);
      this.isEnabled = false;
    }
  }

  /**
   * Track a custom event with parameters
   */
  trackEvent(eventName: AnalyticsEventType, parameters?: EventParams): void {
    if (!this.isEnabled || !this.isInitialized) {
      if (analyticsConfig.debug) {
        console.log("Analytics (disabled):", eventName, parameters);
      }
      return;
    }

    // Rate limiting
    if (!this.checkRateLimit()) {
      console.warn("Analytics: Event rate limit exceeded, skipping event:", eventName);
      return;
    }

    try {
      // Add default parameters
      const enrichedParams = {
        ...parameters,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
      };

      // Send to GA4 using ReactGA
      ReactGA.event(eventName, enrichedParams);

      // Update rate limiter
      this.updateRateLimit();

      if (analyticsConfig.debug) {
        console.log("Analytics:", eventName, enrichedParams);
      }
    } catch (error) {
      console.error("Analytics: Failed to track event", eventName, error);
    }
  }

  /**
   * Track page/screen views
   */
  trackScreenView(
    screenName: ScreenNameType,
    additionalParams?: Record<string, string | number | boolean>,
  ): void {
    if (!this.isEnabled || !this.isInitialized) {
      if (analyticsConfig.debug) {
        console.log("Analytics (disabled): screen_view", screenName, additionalParams);
      }
      return;
    }

    try {
      // Send page view to ReactGA
      ReactGA.send({
        hitType: "pageview",
        page: `/${screenName}`,
        title: screenName,
        ...additionalParams,
      });

      if (analyticsConfig.debug) {
        console.log("Analytics: screen_view", screenName, additionalParams);
      }
    } catch (error) {
      console.error("Analytics: Failed to track screen view", screenName, error);
    }
  }

  /**
   * Track navigation between screens
   */
  trackNavigation(
    fromScreen: ScreenNameType,
    toScreen: ScreenNameType,
    method: "button" | "back" | "direct" = "button",
  ): void {
    this.trackEvent(AnalyticsEvent.SCREEN_VIEW, {
      from_screen: fromScreen,
      to_screen: toScreen,
      navigation_method: method,
    } as EventParams);
  }

  /**
   * Set user properties (use sparingly for privacy)
   */
  setUserProperty(propertyName: string, value: string): void {
    if (!this.isEnabled || !this.isInitialized) return;

    try {
      ReactGA.set({ [propertyName]: value });
    } catch (error) {
      console.error("Analytics: Failed to set user property", error);
    }
  }

  /**
   * Check if this is a returning user
   */
  private isReturningUser(): boolean {
    const hasVisited = localStorage.getItem("ballot_app_visited");
    if (!hasVisited) {
      localStorage.setItem("ballot_app_visited", "true");
      return false;
    }
    return true;
  }

  /**
   * Determine how the user accessed the app
   */
  private getInstallSource(): "direct" | "bookmark" | "installed_pwa" {
    // Check if running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return "installed_pwa";
    }

    // Check referrer for bookmark vs direct access
    if (document.referrer === "" || document.referrer === window.location.origin) {
      return "direct";
    }

    return "bookmark";
  }

  /**
   * Rate limiting to prevent excessive events
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // Reset minute counter if needed
    if (now - rateLimiter.lastMinuteReset > 60000) {
      rateLimiter.eventsThisMinute = 0;
      rateLimiter.lastMinuteReset = now;
    }

    // Check limits
    return (
      rateLimiter.eventsThisMinute < rateLimitConfig.maxEventsPerMinute &&
      rateLimiter.eventsThisSession < rateLimitConfig.maxEventsPerSession
    );
  }

  /**
   * Update rate limiting counters
   */
  private updateRateLimit(): void {
    rateLimiter.eventsThisMinute++;
    rateLimiter.eventsThisSession++;
  }

  /**
   * Get analytics status for debugging
   */
  getStatus(): { isEnabled: boolean; isInitialized: boolean; config: typeof analyticsConfig } {
    return {
      isEnabled: this.isEnabled,
      isInitialized: this.isInitialized,
      config: analyticsConfig,
    };
  }

  /**
   * Disable analytics (for privacy compliance)
   */
  disable(): void {
    this.isEnabled = false;
    console.log("Analytics: Manually disabled");
  }
}

// Export singleton instance
export const analytics = new AnalyticsServiceImpl();

// Export type for external use
export type AnalyticsService = typeof analytics;
