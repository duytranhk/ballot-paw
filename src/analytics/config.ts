/**
 * Analytics Configuration
 *
 * Centralized configuration for Google Analytics 4.
 * Environment-specific settings and feature toggles.
 */

// Analytics configuration interface
export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug: boolean;
  cookieFlags: string;
}

// Environment-based configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Default configuration
export const analyticsConfig: AnalyticsConfig = {
  // Use environment variable or fallback for development
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXX",

  // Enable analytics in production, or when explicitly enabled in development
  enabled: isProduction || import.meta.env.VITE_ENABLE_ANALYTICS === "true",

  // Debug mode in development
  debug: isDevelopment,

  // Cookie settings for privacy compliance
  cookieFlags: "SameSite=Strict; Secure",
};

// Privacy and consent settings
export const privacyConfig = {
  // Respect user privacy preferences
  respectDNT: true, // Do Not Track

  // Cookie consent (extend this for GDPR compliance if needed)
  requireConsent: false,

  // Data retention (GA4 default is 14 months, but you can configure this)
  dataRetentionMonths: 14,

  // Anonymize IP addresses
  anonymizeIP: true,
};

// Rate limiting to prevent excessive events
export const rateLimitConfig = {
  maxEventsPerMinute: 20,
  maxEventsPerSession: 500,
};

// Validation helper
export function validateAnalyticsConfig(): boolean {
  if (!analyticsConfig.enabled) {
    return true; // Valid to have analytics disabled
  }

  if (!analyticsConfig.measurementId || analyticsConfig.measurementId === "G-XXXXXXXX") {
    console.warn("Analytics: Invalid or missing measurement ID");
    return false;
  }

  return true;
}
