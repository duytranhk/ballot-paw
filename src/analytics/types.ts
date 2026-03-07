/**
 * Analytics Types and Event Definitions
 *
 * Centralized type definitions for all analytics events and parameters.
 * This makes it easy to see all tracked events in one place and ensures type safety.
 */

// Base event parameters that can be attached to any event
export interface BaseEventParams {
  timestamp?: number;
  user_agent?: string;
  screen_resolution?: string;
}

// Specific event parameter types
export interface AppStartParams extends BaseEventParams {
  is_returning_user?: boolean;
  install_source?: "direct" | "bookmark" | "installed_pwa";
}

export interface SetupParams extends BaseEventParams {
  candidate_count: number;
  is_modification?: boolean; // true if editing existing candidates
}

export interface CountingParams extends BaseEventParams {
  candidate_count: number;
  ballot_number?: number;
}

export interface BallotCountedParams extends BaseEventParams {
  ballot_number: number;
  candidates_eliminated: number;
  candidates_approved: number;
  time_spent_seconds?: number;
}

export interface CountingCompleteParams extends BaseEventParams {
  total_ballots: number;
  candidate_count: number;
  session_duration_seconds: number;
  undo_count?: number;
}

export interface UndoParams extends BaseEventParams {
  ballot_number: number;
  reason?: "user_initiated" | "error_correction";
}

export interface ShareParams extends BaseEventParams {
  share_method: "native" | "clipboard";
  content_type: "current_results" | "history_record";
  candidate_count: number;
  total_ballots: number;
}

export interface ErrorParams extends BaseEventParams {
  error_type: "validation" | "no_candidates" | "no_eliminations" | "storage_error";
  error_message: string;
  screen: string;
}

export interface NavigationParams extends BaseEventParams {
  from_screen: string;
  to_screen: string;
  navigation_method: "button" | "back" | "direct";
}

// Union type of all possible event parameter types
export type EventParams =
  | AppStartParams
  | SetupParams
  | CountingParams
  | BallotCountedParams
  | CountingCompleteParams
  | UndoParams
  | ShareParams
  | ErrorParams
  | NavigationParams;

// Analytics event names - keeping them descriptive and consistent
export const AnalyticsEvent = {
  // Core app flow
  APP_START: "app_start",
  APP_INSTALL: "app_install",

  // Setup flow
  SETUP_START: "setup_start",
  CANDIDATE_ADDED: "candidate_added",
  CANDIDATE_REMOVED: "candidate_removed",
  SETUP_COMPLETE: "setup_complete",

  // Counting flow
  COUNTING_START: "counting_start",
  BALLOT_COUNTED: "ballot_counted",
  BALLOT_UNDO: "ballot_undo",
  COUNTING_COMPLETE: "counting_complete",

  // Navigation
  SCREEN_VIEW: "screen_view",
  GUIDE_VIEWED: "guide_viewed",

  // Results and sharing
  RESULTS_VIEWED: "results_viewed",
  RESULT_SHARED: "result_shared",

  // History
  HISTORY_VIEWED: "history_viewed",
  HISTORY_DETAIL_VIEWED: "history_detail_viewed",
  HISTORY_DELETED: "history_deleted",

  // Errors
  ERROR_OCCURRED: "error_occurred",

  // Engagement
  SESSION_END: "session_end",
} as const;

export type AnalyticsEventType = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

// Screen names for consistent tracking
export const ScreenName = {
  SETUP: "setup",
  COUNTING: "counting",
  REPORT: "report",
  HISTORY: "history",
  HISTORY_DETAIL: "history_detail",
  GUIDE: "guide",
} as const;

export type ScreenNameType = (typeof ScreenName)[keyof typeof ScreenName];
