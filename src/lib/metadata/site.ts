export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return new URL(configuredUrl);

  if (process.env.VERCEL_ENV === "production") {
    return new URL("https://alkady.dev");
  }

  const vercelUrl = process.env.VERCEL_URL;
  return new URL(vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
}
