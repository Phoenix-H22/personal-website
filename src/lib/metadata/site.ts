export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const siteUrl = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : undefined);

  return new URL(siteUrl ?? "http://localhost:3000");
}
