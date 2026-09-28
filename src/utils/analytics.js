// Only run these logs in development — silent in production builds
const IS_DEV = import.meta.env.DEV;

/** Log a page view event (dev only). */
export const logPageView = (pageName) => {
  if (IS_DEV) console.log(`📊 Page View: ${pageName}`);
};

/** Log a user action with optional extra details (dev only). */
export const logUserAction = (action, details) => {
  if (IS_DEV) console.log(`📊 User Action: ${action}`, details);
};

/** Log basic page load timing (dev only). */
export const logPerformance = () => {
  if (!IS_DEV) return;
  // Use the legacy `performance.timing` API if available
  if (window.performance && window.performance.timing) {
    const perf = window.performance.timing;
    const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
    // Guard against negative or zero values (timing not yet resolved)
    if (pageLoadTime > 0) {
      console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
    }
  }
};