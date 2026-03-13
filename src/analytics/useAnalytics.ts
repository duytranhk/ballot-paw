/**
 * Analytics Hook
 *
 * React hook that provides easy-to-use analytics functions for components.
 * Abstracts the analytics service and provides React-specific functionality.
 */

import { useCallback, useEffect, useRef } from "react";
import { analytics } from "./service";
import { AnalyticsEvent } from "./types";
import type { EventParams, AnalyticsEventType, ScreenNameType } from "./types";

// Session timing for calculating durations
const sessionTimers = {
  screenStartTime: 0,
  sessionStartTime: Date.now(),
  lastActivity: Date.now(),
};

export function useAnalytics() {
  const currentScreen = useRef<ScreenNameType | null>(null);

  /**
   * Track when component mounts (screen view)
   */
  const trackScreenView = useCallback((screenName: ScreenNameType) => {
    // Track previous screen duration if applicable
    if (currentScreen.current && sessionTimers.screenStartTime) {
      const duration = (Date.now() - sessionTimers.screenStartTime) / 1000;
      analytics.trackEvent(AnalyticsEvent.SCREEN_VIEW, {
        screen_name: currentScreen.current,
        screen_duration_seconds: duration,
      } as EventParams);
    }

    // Track new screen
    analytics.trackScreenView(screenName);
    currentScreen.current = screenName;
    sessionTimers.screenStartTime = Date.now();
    sessionTimers.lastActivity = Date.now();
  }, []);

  /**
   * Track navigation between screens
   */
  const trackNavigation = useCallback(
    (toScreen: ScreenNameType, method: "button" | "back" | "direct" = "button") => {
      if (currentScreen.current) {
        analytics.trackNavigation(currentScreen.current, toScreen, method);
      }
      trackScreenView(toScreen);
    },
    [trackScreenView],
  );

  /**
   * Track setup-related events
   */
  const trackSetup = {
    start: useCallback(() => {
      analytics.trackEvent(AnalyticsEvent.SETUP_START);
    }, []),

    candidateAdded: useCallback((totalCount: number) => {
      analytics.trackEvent(AnalyticsEvent.CANDIDATE_ADDED, {
        candidate_count: totalCount,
      } as EventParams);
    }, []),

    candidateRemoved: useCallback((totalCount: number) => {
      analytics.trackEvent(AnalyticsEvent.CANDIDATE_REMOVED, {
        candidate_count: totalCount,
      } as EventParams);
    }, []),

    complete: useCallback((candidateCount: number, isModification = false) => {
      analytics.trackEvent(AnalyticsEvent.SETUP_COMPLETE, {
        candidate_count: candidateCount,
        is_modification: isModification,
      } as EventParams);
    }, []),
  };

  /**
   * Track counting-related events
   */
  const trackCounting = {
    start: useCallback((candidateCount: number) => {
      analytics.trackEvent(AnalyticsEvent.COUNTING_START, {
        candidate_count: candidateCount,
      } as EventParams);
    }, []),

    ballotCounted: useCallback(
      (
        ballotNumber: number,
        eliminatedCount: number,
        approvedCount: number,
        timeSpent?: number,
      ) => {
        analytics.trackEvent(AnalyticsEvent.BALLOT_COUNTED, {
          ballot_number: ballotNumber,
          candidates_eliminated: eliminatedCount,
          candidates_approved: approvedCount,
          time_spent_seconds: timeSpent,
        } as EventParams);
      },
      [],
    ),

    ballotUndo: useCallback(
      (ballotNumber: number, reason: "user_initiated" | "error_correction" = "user_initiated") => {
        analytics.trackEvent(AnalyticsEvent.BALLOT_UNDO, {
          ballot_number: ballotNumber,
          reason,
        } as EventParams);
      },
      [],
    ),

    complete: useCallback(
      (totalBallots: number, candidateCount: number, sessionDuration: number, undoCount = 0) => {
        analytics.trackEvent(AnalyticsEvent.COUNTING_COMPLETE, {
          total_ballots: totalBallots,
          candidate_count: candidateCount,
          session_duration_seconds: sessionDuration,
          undo_count: undoCount,
        } as EventParams);
      },
      [],
    ),
  };

  /**
   * Track result and sharing events
   */
  const trackResults = {
    viewed: useCallback(() => {
      analytics.trackEvent(AnalyticsEvent.RESULTS_VIEWED);
    }, []),

    shared: useCallback(
      (
        method: "native" | "clipboard",
        candidateCount: number,
        totalBallots: number,
        contentType: "current_results" | "history_record" = "current_results",
      ) => {
        analytics.trackEvent(AnalyticsEvent.RESULT_SHARED, {
          share_method: method,
          candidate_count: candidateCount,
          total_ballots: totalBallots,
          content_type: contentType,
        } as EventParams);
      },
      [],
    ),
  };

  /**
   * Track history-related events
   */
  const trackHistory = {
    viewed: useCallback(() => {
      analytics.trackEvent(AnalyticsEvent.HISTORY_VIEWED);
    }, []),

    detailViewed: useCallback((recordId: string) => {
      analytics.trackEvent(AnalyticsEvent.HISTORY_DETAIL_VIEWED, {
        record_id: recordId,
      } as EventParams);
    }, []),

    deleted: useCallback((recordId: string) => {
      analytics.trackEvent(AnalyticsEvent.HISTORY_DELETED, {
        record_id: recordId,
      } as EventParams);
    }, []),
  };

  /**
   * Track guide access
   */
  const trackGuide = useCallback(() => {
    analytics.trackEvent(AnalyticsEvent.GUIDE_VIEWED);
  }, []);

  /**
   * Track errors
   */
  const trackError = useCallback(
    (
      errorType: "validation" | "no_candidates" | "no_approvals" | "storage_error",
      message: string,
      screen: string,
    ) => {
      analytics.trackEvent(AnalyticsEvent.ERROR_OCCURRED, {
        error_type: errorType,
        error_message: message,
        screen,
      } as EventParams);
    },
    [],
  );

  /**
   * Track custom events
   */
  const trackEvent = useCallback((eventName: AnalyticsEventType, parameters?: EventParams) => {
    analytics.trackEvent(eventName, parameters);
    sessionTimers.lastActivity = Date.now();
  }, []);

  /**
   * Calculate session duration
   */
  const getSessionDuration = useCallback(() => {
    return (Date.now() - sessionTimers.sessionStartTime) / 1000;
  }, []);

  /**
   * Update activity timestamp (call on user interaction)
   */
  const updateActivity = useCallback(() => {
    sessionTimers.lastActivity = Date.now();
  }, []);

  /**
   * Track session end (call on app close/visibility change)
   */
  const trackSessionEnd = useCallback(() => {
    const sessionDuration = getSessionDuration();
    const idleDuration = (Date.now() - sessionTimers.lastActivity) / 1000;

    analytics.trackEvent(AnalyticsEvent.SESSION_END, {
      session_duration_seconds: sessionDuration,
      idle_duration_seconds: idleDuration,
    } as EventParams);
  }, [getSessionDuration]);

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackSessionEnd();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [trackSessionEnd]);

  return {
    // Screen tracking
    trackScreenView,
    trackNavigation,

    // Feature-specific tracking
    trackSetup,
    trackCounting,
    trackResults,
    trackHistory,
    trackGuide,
    trackError,

    // General tracking
    trackEvent,
    updateActivity,
    getSessionDuration,

    // Utilities
    analytics: analytics.getStatus(),
  };
}
