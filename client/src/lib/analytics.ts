/**
 * GA4 Event Tracking Module
 * Comprehensive analytics for FoldForge conversion funnel
 */

export interface GAEvent {
  event: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Send event to Google Analytics 4
 */
export function trackEvent(event: GAEvent): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event.event, {
      ...event,
    });
  }
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(
  buttonLabel: string,
  location: string,
  tier?: string
): void {
  trackEvent({
    event: "cta_click",
    button_label: buttonLabel,
    location: location,
    tier: tier || "none",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track Free Trial signup initiation
 */
export function trackFreeTrialStart(tier: string, source: string): void {
  trackEvent({
    event: "free_trial_start",
    tier: tier,
    source: source,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track pricing page view
 */
export function trackPricingView(source: string): void {
  trackEvent({
    event: "pricing_view",
    source: source,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track signup completion
 */
export function trackSignupComplete(tier: string, method: string): void {
  trackEvent({
    event: "signup_complete",
    tier: tier,
    method: method,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track login event
 */
export function trackLogin(method: string): void {
  trackEvent({
    event: "login",
    method: method,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track feature interaction
 */
export function trackFeatureInteraction(
  featureName: string,
  action: string
): void {
  trackEvent({
    event: "feature_interaction",
    feature_name: featureName,
    action: action,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track page scroll depth
 */
export function trackScrollDepth(depth: number, page: string): void {
  trackEvent({
    event: "scroll_depth",
    depth_percentage: Math.round(depth * 100),
    page: page,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number, page: string): void {
  trackEvent({
    event: "time_on_page",
    seconds: seconds,
    page: page,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track video engagement
 */
export function trackVideoEngagement(
  videoTitle: string,
  action: "play" | "pause" | "complete",
  currentTime?: number
): void {
  trackEvent({
    event: "video_engagement",
    video_title: videoTitle,
    action: action,
    current_time: currentTime,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  success: boolean,
  fields?: string[]
): void {
  trackEvent({
    event: "form_submission",
    form_name: formName,
    success: success,
    fields_submitted: fields?.join(","),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track purchase event
 */
export function trackPurchase(
  tier: string,
  price: number,
  currency: string = "USD"
): void {
  trackEvent({
    event: "purchase",
    tier: tier,
    value: price,
    currency: currency,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track error event
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  page: string
): void {
  trackEvent({
    event: "error",
    error_type: errorType,
    error_message: errorMessage,
    page: page,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track lead magnet download
 */
export function trackLeadMagnetDownload(
  magnetName: string,
  email?: string
): void {
  trackEvent({
    event: "lead_magnet_download",
    magnet_name: magnetName,
    email_provided: !!email,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track exit intent
 */
export function trackExitIntent(page: string): void {
  trackEvent({
    event: "exit_intent",
    page: page,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track comparison table interaction
 */
export function trackComparisonInteraction(
  feature: string,
  action: string
): void {
  trackEvent({
    event: "comparison_interaction",
    feature: feature,
    action: action,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track calculator usage
 */
export function trackCalculatorUsage(
  winRate: number,
  riskPerTrade: number
): void {
  trackEvent({
    event: "calculator_usage",
    win_rate: winRate,
    risk_per_trade: riskPerTrade,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track testimonial view
 */
export function trackTestimonialView(
  testimonialAuthor: string,
  position: number
): void {
  trackEvent({
    event: "testimonial_view",
    author: testimonialAuthor,
    position: position,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track FAQ interaction
 */
export function trackFAQInteraction(question: string, action: string): void {
  trackEvent({
    event: "faq_interaction",
    question: question,
    action: action,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track link click
 */
export function trackLinkClick(linkText: string, href: string): void {
  trackEvent({
    event: "link_click",
    link_text: linkText,
    href: href,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Initialize analytics on page load
 */
export function initializeAnalytics(): void {
  // Track page view with custom properties
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", "G-RM40NETNCG", {
      page_path: window.location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    });
  }
}
