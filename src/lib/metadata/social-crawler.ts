export const SOCIAL_CRAWLER_UA =
  /WhatsApp|facebookexternalhit|Facebot|FacebookBot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Iframely|SkypeUriPreview|meta-externalagent/i;

export function isSocialCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && SOCIAL_CRAWLER_UA.test(userAgent));
}
