const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "public");
const indexPath = path.join(root, "articles", "index.json");
const historyPath = path.join(root, "history.json");

const dates = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));
const historyByDate = new Map(history.map((h) => [h.date, h]));

let mismatches = 0;

for (const date of dates) {
  const dayPath = path.join(root, "articles", `${date}.json`);
  if (!fs.existsSync(dayPath)) {
    console.log(`SKIP ${date}: no archive file`);
    continue;
  }
  const day = JSON.parse(fs.readFileSync(dayPath, "utf8"));
  const cards = day.articles ?? [];

  const recomputed = {
    economic: { positive: 0, neutral: 0, negative: 0 },
    political: { positive: 0, neutral: 0, negative: 0 },
    social: { positive: 0, neutral: 0, negative: 0 },
  };
  let flaggedForReview = 0;
  const lean = { balanced: 0, "pro-government": 0, "pro-opposition": 0 };
  const confidence = { high: 0, medium: 0, low: 0 };

  for (const card of cards) {
    for (const cat of ["economic", "political", "social"]) {
      const v = card.indicators?.[cat]?.value;
      if (v && recomputed[cat][v] !== undefined) recomputed[cat][v] += 1;
    }
    if (card.flaggedForReview) flaggedForReview += 1;
    const leanValue = card.indicators?.lean?.value;
    if (leanValue && lean[leanValue] !== undefined) lean[leanValue] += 1;
    const confValue = card.indicators?.confidence?.value;
    if (confValue && confidence[confValue] !== undefined) confidence[confValue] += 1;
  }

  const existing = historyByDate.get(date);
  if (!existing) {
    console.log(`SKIP ${date}: no history.json entry (outside the 365-day cap or never written)`);
    continue;
  }

  // Sanity check: recomputed economic/political/social counts should match what's
  // already stored, confirming this script reads the same cards the daily task tallied.
  // The archive file itself is the source of truth, a mismatch means the originally
  // stored aggregate was wrong, correct it rather than leaving stale data in place.
  for (const cat of ["economic", "political", "social"]) {
    for (const tone of ["positive", "neutral", "negative"]) {
      if (existing.counts[cat][tone] !== recomputed[cat][tone]) {
        mismatches += 1;
        console.log(
          `CORRECTING ${date} ${cat}.${tone}: history had ${existing.counts[cat][tone]}, archive says ${recomputed[cat][tone]}`
        );
        existing.counts[cat][tone] = recomputed[cat][tone];
      }
    }
  }

  existing.flaggedForReview = flaggedForReview;
  existing.lean = lean;
  existing.confidence = confidence;
}

fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + "\n");
console.log(`\n${mismatches} count(s) corrected. Backfilled flaggedForReview/lean/confidence into ${history.length} history.json entries.`);
