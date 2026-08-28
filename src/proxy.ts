import { NextResponse, type NextRequest } from "next/server";

import { isSocialCrawler } from "@/lib/metadata/social-crawler";
import { getSocialPreviewHtml } from "@/lib/metadata/social-preview";
import { getSiteUrl } from "@/lib/metadata/site";

const PREVIEW_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store",
};

export function proxy(request: NextRequest) {
  if (!isSocialCrawler(request.headers.get("user-agent"))) {
    return NextResponse.next();
  }

  const html = getSocialPreviewHtml(request.nextUrl.pathname, getSiteUrl());
  if (!html) return NextResponse.next();

  return new NextResponse(html, { headers: PREVIEW_HEADERS });
}

export const config = {
  matcher: ["/", "/v2", "/projects", "/projects/:path*"],
};
