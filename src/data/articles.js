// Fallback data only, used if the live feed at /articles.json has not run yet or a
// fetch fails. The live pipeline is a scheduled task ("news-app-daily-crawl") that
// fetches Dawn News, Geo News, and Business Recorder's RSS feeds and writes
// public/articles.json daily at 6am, see Section 5.2 and 6 of the SOP.

export const sampleArticles = [
  {
    id: 1,
    headline: "Budget session ends with new tax proposal",
    summary:
      "AI summary: the measure raises revenue but adds cost pressure on small business, lawmakers say implementation details are still being worked out.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T06:00:00+05:00",
    flaggedForReview: false,
    indicators: {
      economic: { value: "neutral", reason: "Revenue gain is offset by added compliance cost for small firms." },
      political: { value: "positive", reason: "Passed with cross-party support, no signs of instability." },
      social: { value: "negative", reason: "Consumer prices likely rise before any benefit reaches households." },
      market: { value: "high", reason: "Directly affects corporate tax planning and investor forecasts." },
      lean: { value: "balanced", reason: "Coverage cites both government and opposition figures evenly." },
      confidence: { value: "high", reason: "Clear, well-sourced reporting with minimal ambiguity." },
    },
  },
  {
    id: 2,
    headline: "Central bank holds interest rate steady",
    summary:
      "AI summary: the decision favors stability over stimulus, borrowing costs stay unchanged for a third straight quarter.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T05:00:00+05:00",
    flaggedForReview: false,
    indicators: {
      economic: { value: "positive", reason: "Signals confidence in easing inflation without new stimulus risk." },
      political: { value: "neutral", reason: "Routine technical decision, little political framing in coverage." },
      social: { value: "neutral", reason: "No immediate change to household borrowing or savings rates." },
      market: { value: "high", reason: "Rate decisions are a leading input for investors and lenders." },
      lean: { value: "balanced", reason: "Reported as a technical central bank matter, not a partisan one." },
      confidence: { value: "high", reason: "Official statement is unambiguous and directly quoted." },
    },
  },
  {
    id: 3,
    headline: "Opposition lawmakers walk out of parliamentary session",
    summary:
      "AI summary: the walkout stalls a scheduled vote, both sides trade blame over procedure rather than the bill's content.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T04:00:00+05:00",
    flaggedForReview: true,
    indicators: {
      economic: { value: "neutral", reason: "The stalled bill has no direct economic provisions." },
      political: { value: "negative", reason: "Procedural walkout signals friction between government and opposition." },
      social: { value: "negative", reason: "Delays a vote the public has been waiting on." },
      market: { value: "low", reason: "Limited relevance to markets or business planning." },
      lean: { value: "pro-opposition", reason: "Article leads with the opposition's framing of events." },
      confidence: { value: "medium", reason: "Accounts from both sides differ on what triggered the walkout." },
    },
  },
  {
    id: 4,
    headline: "New metro bus route opens connecting twin cities",
    summary:
      "AI summary: the route is expected to cut commute times for tens of thousands of daily riders starting next week.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T03:00:00+05:00",
    flaggedForReview: false,
    indicators: {
      economic: { value: "positive", reason: "Lower commute costs and time free up household spending." },
      political: { value: "positive", reason: "Delivered public infrastructure project, no controversy noted." },
      social: { value: "positive", reason: "Direct, immediate benefit to daily commuters." },
      market: { value: "low", reason: "Mostly a public-service story with limited investor relevance." },
      lean: { value: "balanced", reason: "Straightforward service announcement, no partisan framing found." },
      confidence: { value: "high", reason: "Details confirmed directly by the transit authority." },
    },
  },
  {
    id: 5,
    headline: "Currency slips against dollar amid import pressure",
    summary:
      "AI summary: a widening trade gap is cited as the main driver, analysts expect further pressure into next quarter.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T02:00:00+05:00",
    flaggedForReview: false,
    indicators: {
      economic: { value: "negative", reason: "Weaker currency raises import costs across the economy." },
      political: { value: "neutral", reason: "Framed as a market trend rather than a policy failure." },
      social: { value: "negative", reason: "Imported goods, including fuel, likely become more expensive." },
      market: { value: "high", reason: "Directly relevant to importers, exporters, and investors." },
      lean: { value: "balanced", reason: "Cites central bank and independent analysts, not party sources." },
      confidence: { value: "medium", reason: "Forward-looking analyst projections carry inherent uncertainty." },
    },
  },
  {
    id: 6,
    headline: "Government launches youth technology scholarship program",
    summary:
      "AI summary: the program funds coding bootcamps for public university students, first cohort begins in the autumn term.",
    sources: [{ name: "Dawn News", url: "https://www.dawn.com/" }],
    timestamp: "Today, 6:00 AM",
    publishedAt: "2026-01-01T01:00:00+05:00",
    flaggedForReview: false,
    indicators: {
      economic: { value: "positive", reason: "Builds a skilled workforce pipeline at limited near-term cost." },
      political: { value: "positive", reason: "Popular initiative with broad public support noted in coverage." },
      social: { value: "positive", reason: "Expands access to in-demand skills for public university students." },
      market: { value: "low", reason: "Long-term labor market effect, limited immediate business relevance." },
      lean: { value: "pro-government", reason: "Announcement is framed around the government's own initiative." },
      confidence: { value: "medium", reason: "Program scope is confirmed, longer-term impact is not yet known." },
    },
  },
];
