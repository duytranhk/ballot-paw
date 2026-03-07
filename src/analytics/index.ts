/**
 * Analytics Module
 *
 * Main export file for the analytics module.
 * Provides a clean API for importing analytics functionality.
 */

// Core exports
export { analytics } from "./service";
export { useAnalytics } from "./useAnalytics";
export { analyticsConfig, validateAnalyticsConfig } from "./config";

// Type exports
export type {
  EventParams,
  AppStartParams,
  SetupParams,
  CountingParams,
  BallotCountedParams,
  CountingCompleteParams,
  UndoParams,
  ShareParams,
  ErrorParams,
  NavigationParams,
  AnalyticsEventType,
  ScreenNameType,
} from "./types";

export { AnalyticsEvent, ScreenName } from "./types";

// Re-export for convenience
export type { AnalyticsService } from "./service";
