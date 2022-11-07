export interface EventOptions {
  // Headers
  userAgent: string;
  xForwardedFor: string;
  contentType?: "application/json" | "text/plain";

  // Body
  name?: "pageview" | string;
  url: string;
  referrer?: string;
  screenWidth?: number;
  props?: Record<string, string>;
}
