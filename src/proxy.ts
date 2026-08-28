import { NextResponse, type NextRequest } from "next/server";

import { isSocialCrawler } from "@/lib/metadata/social-crawler";
import { getSocialPreviewHtml } from "@/lib/metadata/social-preview";
import { getSiteUrl } from "@/lib/metadata/site";

export function proxy(request: NextRequest) {
  if (!isSocialCrawler(request.headers.get("user-agent"))) {
    return NextResponse.next();
  }

  const html = getSocialPreviewHtml(request.nextUrl.pathname, getSiteUrl());
  if (!html) return NextResponse.next();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}

export const config = {
  matcher: ["/projects", "/projects/:slug"],
};
