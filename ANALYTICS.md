# Analytics Documentation

## Overview

This project includes comprehensive analytics tracking using Google Analytics 4 (GA4) to understand user behavior and app usage patterns.

## Architecture

### Core Components

1. **Analytics Service** (`src/analytics/service.ts`)
   - Singleton service that handles all GA4 interactions
   - Rate limiting to prevent excessive events
   - Privacy-compliant configuration
   - Error handling and fallbacks

2. **Analytics Hook** (`src/analytics/useAnalytics.ts`)
   - React hook providing easy-to-use analytics functions
   - Screen tracking with automatic duration calculation
   - Feature-specific tracking methods
   - Session management

3. **Type Definitions** (`src/analytics/types.ts`)
   - Comprehensive TypeScript types for all events and parameters
   - Centralized event name definitions
   - Type-safe parameter validation

4. **Configuration** (`src/analytics/config.ts`)
   - Environment-based configuration
   - Privacy settings (GDPR compliance ready)
   - Rate limiting configuration

## Tracked Events

### Core App Flow

- `app_start` - App opened/loaded
- `app_install` - PWA installation (automatic)
- `screen_view` - Screen navigation with duration
- `session_end` - Session completion

### Setup Process

- `setup_start` - Begin candidate setup
- `candidate_added` - New candidate added
- `candidate_removed` - Candidate deleted
- `setup_complete` - Setup finished with candidate count

### Counting Process

- `counting_start` - Begin ballot counting
- `ballot_counted` - Individual ballot processed
- `ballot_undo` - Previous ballot corrected
- `counting_complete` - Full counting session finished

### Results & Sharing

- `results_viewed` - Results screen accessed
- `result_shared` - Results shared (with method: native/clipboard)

### History Management

- `history_viewed` - History list accessed
- `history_detail_viewed` - Specific record opened
- `history_deleted` - Record removed

### User Engagement

- `guide_viewed` - Help documentation accessed
- `error_occurred` - Validation or system errors

## Setup Instructions

### 1. Get Google Analytics 4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property or use existing one
3. Go to Admin → Data Streams → Web
4. Copy your Measurement ID (format: G-XXXXXXXXXX)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Set your measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Optionally enable analytics in development:
   ```
   VITE_ENABLE_ANALYTICS=true
   ```

### 3. Deploy Configuration

For production builds, set environment variables in your hosting platform:

**GitHub Pages (via GitHub Actions):**

```yaml
env:
  VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
```

**Other Platforms:**

- Vercel: Add to Environment Variables in dashboard
- Netlify: Add to Site Settings → Environment Variables

## Privacy & Compliance

### Built-in Privacy Features

- Respects "Do Not Track" browser settings
- IP address anonymization enabled
- No advertising features or remarketing
- Rate limiting prevents excessive tracking
- Client-side only (no server-side tracking)

### GDPR Compliance

The current setup provides a privacy-friendly baseline. For full GDPR compliance, consider adding:

- Cookie consent banner
- Analytics disable option in settings
- Data retention controls

## Usage in Components

### Basic Screen Tracking

```typescript
import { useAnalytics, ScreenName } from "../analytics";

function MyComponent() {
  const { trackScreenView } = useAnalytics();

  useEffect(() => {
    trackScreenView(ScreenName.SETUP);
  }, [trackScreenView]);
}
```

### Event Tracking

```typescript
const { trackSetup, trackError, updateActivity } = useAnalytics();

function handleAction() {
  updateActivity(); // Update user activity timestamp
  trackSetup.candidateAdded(candidateCount);

  // Error tracking
  if (error) {
    trackError("validation", error.message, "setup");
  }
}
```

### Navigation Tracking

```typescript
const { trackNavigation } = useAnalytics();

function navigate(toScreen) {
  trackNavigation(toScreen, "button");
  // ... navigation logic
}
```

## Development & Debugging

### Debug Mode

Analytics automatically enables debug mode in development:

- Console logging of all events
- Detailed parameter information
- Configuration status

### Rate Limiting

- Maximum 20 events per minute
- Maximum 500 events per session
- Prevents accidental spam

### Testing

```typescript
// Check analytics status
const { analytics } = useAnalytics();
console.log(analytics); // { isEnabled, isInitialized, config }

// Manual event tracking
trackEvent(AnalyticsEvent.CUSTOM_EVENT, { custom_param: "value" });
```

## Data Analysis

### Key Metrics to Monitor

1. **User Engagement**
   - Active users and sessions
   - Session duration
   - Screen view patterns

2. **Feature Usage**
   - Ballot counting completion rates
   - Average ballots per session
   - Undo frequency (indicates UI issues)
   - Guide access (help-seeking behavior)

3. **User Flow**
   - Setup → Counting → Results completion rate
   - Drop-off points in the process
   - Error frequencies and types

4. **Sharing & History**
   - Result sharing rates and methods
   - History usage patterns
   - PWA installation rates

### Custom Reports

Create custom GA4 reports focusing on:

- Ballot counting efficiency (time per ballot)
- Error patterns (validation failures)
- Feature adoption (guide usage, history access)
- Mobile vs desktop usage patterns

## Maintenance

### Adding New Events

1. Add event definition to `AnalyticsEvent` enum
2. Define parameter types if needed
3. Add tracking method to appropriate feature group in `useAnalytics`
4. Implement in relevant components
5. Update this documentation

### Performance Monitoring

- Monitor rate limiting logs for excessive events
- Check analytics initialization success rate
- Verify data appears correctly in GA4

## Troubleshooting

### Analytics Not Working

1. Check measurement ID is correct
2. Verify environment variables are set
3. Check browser console for errors
4. Confirm GA4 property is active

### Data Not Appearing in GA4

- Real-time data appears immediately
- Standard reports have 24-48 hour delay
- Check DebugView in GA4 for real-time debugging

### Performance Issues

- Rate limiting may be blocking events
- Check console for rate limit warnings
- Verify gtag library loaded correctly
