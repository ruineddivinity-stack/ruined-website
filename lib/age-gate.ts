export const AGE_GATE_COOKIE = "ruined_age_verified";
export const AGE_GATE_COOKIE_DAYS = 365;

// Search/social crawlers render the full page (JS included) and index
// whatever's visible first — which was the age-gate modal, not the real
// page. Skipping the gate for known crawler user-agents so they see actual
// content instead is standard practice for age-gated sites, not cloaking:
// the underlying page content served is identical either way, only the
// verification interaction is skipped for bots that can't click through it.
const CRAWLER_USER_AGENTS = [
  "googlebot",
  "google-inspectiontool",
  "adsbot-google",
  "mediapartners-google",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "applebot",
  "discordbot",
  "slackbot",
  "telegrambot",
  "redditbot",
  "pinterest",
];

export function isCrawlerUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
}
