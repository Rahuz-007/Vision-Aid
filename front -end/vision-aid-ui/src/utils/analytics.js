/**
 * Analytics Utility for VisionAid
 * Tracks user interactions and events
 * 
 * Setup Instructions:
 * 1. Install: npm install react-ga4
 * 2. Get tracking ID from Google Analytics 4
 * 3. Add REACT_APP_GA_TRACKING_ID to .env
 * 4. Initialize in index.js: initAnalytics()
 */

// Uncomment when react-ga4 is installed
// import ReactGA from 'react-ga4';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

/**
 * Initialize Google Analytics
 */
export const initAnalytics = () => {
    if (!TRACKING_ID) {
        console.warn('⚠️ Google Analytics tracking ID not configured');
        return;
    }

    if (!IS_PRODUCTION) {
        console.log('📊 Analytics disabled in development');
        return;
    }

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.initialize(TRACKING_ID, {
      gaOptions: {
        anonymizeIp: true, // GDPR compliance
        cookieFlags: 'SameSite=None;Secure'
      }
    });
    */

    console.log('✅ Analytics initialized');
};

/**
 * Track page view
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export const trackPageView = (path, title) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title
    });
    */

    console.log('📊 Page view:', path, title);
};

/**
 * Track custom event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label = '', value = 0) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.event({
      category,
      action,
      label,
      value
    });
    */

    console.log('📊 Event:', { category, action, label, value });
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = {
    colorPicker: (action) => {
        trackEvent('Color Picker', action);
    },

    trafficSignal: (action, signal) => {
        trackEvent('Traffic Signal', action, signal);
    },

    simulator: (type) => {
        trackEvent('Color Blindness Simulator', 'Used', type);
    },

    contrastChecker: (result) => {
        trackEvent('Contrast Checker', 'Check', result);
    },

    paletteGenerator: (action) => {
        trackEvent('Palette Generator', action);
    },

    colorSave: () => {
        trackEvent('User Action', 'Save Color');
    },

    colorCopy: () => {
        trackEvent('User Action', 'Copy Color');
    },

    voiceToggle: (enabled) => {
        trackEvent('Settings', 'Voice Toggle', enabled ? 'On' : 'Off');
    },

    themeToggle: (theme) => {
        trackEvent('Settings', 'Theme Change', theme);
    }
};

/**
 * Track errors
 * @param {string} description - Error description
 * @param {boolean} fatal - Is fatal error
 */
export const trackError = (description, fatal = false) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.event({
      category: 'Error',
      action: description,
      label: fatal ? 'Fatal' : 'Non-Fatal'
    });
    */

    console.error('📊 Error tracked:', description, { fatal });
};

/**
 * Track timing (performance)
 * @param {string} category - Timing category
 * @param {string} variable - Timing variable
 * @param {number} value - Time in milliseconds
 */
export const trackTiming = (category, variable, value) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.event({
      category: 'Timing',
      action: variable,
      value: value,
      label: category
    });
    */

    console.log('📊 Timing:', { category, variable, value });
};

/**
 * Track user engagement
 */
export const trackEngagement = {
    sessionStart: () => {
        trackEvent('Engagement', 'Session Start');
    },

    sessionEnd: () => {
        trackEvent('Engagement', 'Session End');
    },

    featureDiscovery: (feature) => {
        trackEvent('Engagement', 'Feature Discovered', feature);
    },

    tutorialComplete: (tutorial) => {
        trackEvent('Engagement', 'Tutorial Complete', tutorial);
    },

    shareAction: (platform) => {
        trackEvent('Engagement', 'Share', platform);
    }
};

/**
 * Set user properties (for logged-in users)
 * @param {object} properties - User properties
 */
export const setUserProperties = (properties) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    // Uncomment when react-ga4 is installed
    /*
    ReactGA.set(properties);
    */

    console.log('📊 User properties set:', properties);
};

/**
 * Track conversion/goal
 * @param {string} goal - Goal name
 * @param {number} value - Goal value (optional)
 */
export const trackConversion = (goal, value = 0) => {
    if (!IS_PRODUCTION || !TRACKING_ID) return;

    trackEvent('Conversion', goal, '', value);
};

// Export all tracking functions
export default {
    init: initAnalytics,
    pageView: trackPageView,
    event: trackEvent,
    feature: trackFeatureUsage,
    error: trackError,
    timing: trackTiming,
    engagement: trackEngagement,
    setUser: setUserProperties,
    conversion: trackConversion
};
