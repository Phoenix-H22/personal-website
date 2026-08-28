export const SOCIAL_CRAWLER_UA =
  /WhatsApp|facebookexternalhit|facebookexternalua|Facebot|FacebookBot|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Iframely|SkypeUriPreview|Pinterest|redditbot|vkShare|Embedly|Viber|meta-externalagent/i;

export function isSocialCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && SOCIAL_CRAWLER_UA.test(userAgent));
}
