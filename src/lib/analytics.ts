export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, params)
  // Implementation for real analytics goes here (e.g. GA4, Mixpanel, Hotjar)
}
