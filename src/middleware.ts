import { type NextRequest, NextResponse } from "next/server";
import { PlausibleTracker } from "utils/plausible";

import type { ShortlinkResponse } from "./pages/api/getShortlink/[slug]";
export const matcher = ["/((?!api|_next/static|favicon.ico).*)", "/:slug"];

// Custom plausible event tracker
const plausible = new PlausibleTracker(
  "https://plausible.henriktech.com",
  "hvt.ski"
);

export default async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop();

  if (!slug) {
    return NextResponse.next();
  }

  const startFetch = Date.now();
  const response = await fetch(
    `${req.nextUrl.origin}/api/getShortlink/${slug}`
  );
  const endFetch = Date.now();
  if (!response.ok) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  const cacheHeader = response.headers.get("cache-control");
  const vercelCacheHeader = response.headers.get("x-vercel-cache");

  // const allHeaders: { [key: string]: string } = {};
  // response.headers.forEach((value, key) => {
  //   allHeaders[key] = value;
  // });

  const data: ShortlinkResponse = await response.json();
  console.log(
    JSON.stringify(
      {
        referrer: req.referrer,
        fetchTime: `${endFetch - startFetch}ms`,
        cacheHeader,
        vercelCacheHeader,
        // headers: allHeaders,
      },
      null,
      4
    )
  );

  // Track pageview
  await plausible.sendPageview({
    url: req.referrer,
    userAgent: req.headers.get("user-agent") ?? "",
    xForwardedFor: req.headers.get("x-forwarded-for") ?? "",
    name: "pageview",
  });

  // Track outbound link
  await plausible.sendEvent({
    url: req.referrer,
    userAgent: req.headers.get("user-agent") ?? "",
    xForwardedFor: req.headers.get("x-forwarded-for") ?? "",
    name: "Outbound Link",
    props: {
      url: data.url,
    },
  });
  return NextResponse.redirect(data.url);
}
