import {
  type NextRequest,
  type NextFetchEvent,
  NextResponse,
} from "next/server";

import type { ShortlinkResponse } from "./pages/api/getShortlink/[slug]";
export const matcher = ["/((?!api|_next/static|favicon.ico).*)", "/:slug"];

export default async function middleware(
  req: NextRequest,
  _event: NextFetchEvent
) {
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

  const data: ShortlinkResponse = await response.json();
  console.log({ fetchTime: `${endFetch - startFetch}ms` });
  return NextResponse.redirect(data.url);
}
