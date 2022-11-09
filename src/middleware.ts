import { type NextRequest, NextResponse } from "next/server";

import type { ShortlinkResponse } from "./pages/api/getShortlink/[slug]";

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
    return NextResponse.next();
  }

  const cacheHeader = response.headers.get("cache-control");
  const vercelCacheHeader = response.headers.get("x-vercel-cache");

  const data: ShortlinkResponse = await response.json();
  console.log(
    JSON.stringify(
      {
        referrer: req.referrer,
        fetchTime: `${endFetch - startFetch}ms`,
        cacheHeader,
        vercelCacheHeader,
      },
      null,
      4
    )
  );

  return NextResponse.redirect(data.url);
}

export const matcher = ["/:slug"];
