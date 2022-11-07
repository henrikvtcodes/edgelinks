import type { EventOptions } from "./types";

export class PlausibleTracker {
  private apiUrl: string;
  private domain: string;

  constructor(apiUrl: string, domain: string) {
    this.apiUrl = apiUrl;
    this.domain = domain;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch(this.apiUrl + "/api/health").catch((err: any) => {
      throw new Error("Plausible API is not reachable: " + err.message);
    });
  }

  /**
   * Send a pageview event to Plausible
   * @param props
   */
  async sendPageview({
    userAgent,
    xForwardedFor,
    contentType = "application/json",
    name = "pageview",
    url,
    referrer,
    screenWidth,
    props,
  }: EventOptions) {
    const domain = this.domain;
    const body = JSON.stringify({
      domain,
      name,
      url,
      referrer,
      screenWidth,
      props,
    });

    console.log("Plausible event", body);

    if (process.env.NODE_ENV === "development") {
      return;
    }

    const res = await fetch(this.apiUrl + "/api/event", {
      method: "POST",
      headers: {
        "User-Agent": userAgent,
        "X-Forwarded-For": xForwardedFor,
        "Content-Type": contentType,
      },
      body,
    });

    if (!res.ok) {
      throw new Error(
        `Plausible API responded with status ${res.status}: ${
          res.statusText
        } \n ${await res.text()}`
      );
    }
  }

  /**
   * Send a custom event to Plausible
   */
  async sendEvent({
    userAgent,
    xForwardedFor,
    contentType = "application/json",
    name,
    url,
    referrer,
    screenWidth,
    props,
  }: EventOptions) {
    const domain = this.domain;
    const body = JSON.stringify({
      domain,
      name,
      url,
      referrer,
      screenWidth,
      props,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Plausible event", body);
      return;
    }

    const res = await fetch(this.apiUrl + "/api/event", {
      method: "POST",
      headers: {
        "User-Agent": userAgent,
        "X-Forwarded-For": xForwardedFor,
        "Content-Type": contentType,
      },
      body,
    });

    if (!res.ok) {
      throw new Error(
        `Plausible API responded with status ${res.status}: ${res.statusText}`
      );
    }
  }
}
