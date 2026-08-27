import { NextResponse, type NextRequest } from "next/server";

import { isSocialCrawler } from "@/lib/metadata/social-crawler";

export function proxy(request: NextRequest) {
  if (!isSocialCrawler(request.headers.get("user-agent"))) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/social-card${request.nextUrl.pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/projects", "/projects/:slug"],
};
