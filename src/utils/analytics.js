// Simple no-op analytics module for local-first instrumentation
// API: analytics.event(name, payload?)

const log = (name, payload) => {
  try {
    // For now, console-based logging to aid local verification
    // In future, route to a remote collector when enabled
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${name}`, payload || {});
  } catch (_) {}
};

export const analytics = {
  event: log,
};
