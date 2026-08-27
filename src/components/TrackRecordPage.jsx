import { useEffect, useState } from "react";

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

function BreakdownRow({ label, value, count, total, toneClass }) {
  return (
    <div className="track__row">
      <div className="track__row-bar">
        <div className={`track__row-fill ${toneClass}`} style={{ width: `${pct(count, total)}%` }} />
      </div>
      <div className="track__row-text">
        <span className="track__row-label">{label}</span>
        <span className="track__row-value">
          {pct(count, total)}% ({count} of {total})
        </span>
      </div>
    </div>
  );
}

export default function TrackRecordPage({ onNavigateHome, onNavigateMethodology, onNavigateContact }) {
  const [history, setHistory] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    document.title = "Track record, Miqyas";
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/history.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        setHistory(Array.isArray(data) ? data : []);
        setStatus("live");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = (() => {
    if (!history || history.length === 0) return null;
    const sorted = [...history].sort((a, b) => (a.date < b.date ? -1 : 1));
    let totalArticles = 0;
    let flaggedForReview = 0;
    const lean = { balanced: 0, "pro-government": 0, "pro-opposition": 0 };
    const confidence = { high: 0, medium: 0, low: 0 };
    let daysWithMeta = 0;
    for (const day of sorted) {
      totalArticles += day.articleCount ?? 0;
      if (day.lean && day.confidence && typeof day.flaggedForReview === "number") {
        daysWithMeta += 1;
        flaggedForReview += day.flaggedForReview;
        lean.balanced += day.lean.balanced ?? 0;
        lean["pro-government"] += day.lean["pro-government"] ?? 0;
        lean["pro-opposition"] += day.lean["pro-opposition"] ?? 0;
        confidence.high += day.confidence.high ?? 0;
        confidence.medium += day.confidence.medium ?? 0;
        confidence.low += day.confidence.low ?? 0;
      }
    }
    const metaTotal = lean.balanced + lean["pro-government"] + lean["pro-opposition"];
    return {
      since: sorted[0].date,
      through: sorted[sorted.length - 1].date,
      dayCount: sorted.length,
      totalArticles,
      flaggedForReview,
      lean,
      confidence,
      metaTotal,
      daysWithMeta,
    };
  })();

  function backLink(extraClass) {
    return (
      <a
        href="/"
        className={`method__back ${extraClass ?? ""}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigateHome();
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to headlines
      </a>
    );
  }

  return (
    <div className="page">
      {backLink()}

      <header className="method__header">
        <p className="header__eyebrow">Miqyas</p>
        <h1 className="method__title">Track record</h1>
        <p className="method__intro">
          A running, honest account of Miqyas's own AI readings, not curated highlights. These
          numbers are computed straight from the same data behind every headline card, updated
          daily.
        </p>
      </header>

      {status === "loading" && <p className="method__section">Loading track record…</p>}
      {status === "error" && <p className="method__section">The track record couldn't be loaded, try again shortly.</p>}

      {totals && (
        <>
          <section className="method__section">
            <h2 className="method__h2">
              {formatDateLabel(totals.since)} to {formatDateLabel(totals.through)}
            </h2>
            <p>
              {totals.totalArticles} stories read across {totals.dayCount} day{totals.dayCount === 1 ? "" : "s"}.{" "}
              {totals.flaggedForReview} of them ({pct(totals.flaggedForReview, totals.metaTotal || totals.totalArticles)}%)
              were automatically flagged for review under{" "}
              <a
                href="/methodology"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateMethodology();
                }}
              >
                the rule described in the methodology
              </a>
              .
            </p>
          </section>

          <section className="method__section">
            <h2 className="method__h2">Political lean, across every reading</h2>
            <p>
              Whether a story's own framing favored the sitting government, the opposition, or
              neither, judged from how each piece was written, never colored on individual cards
              on purpose, shown honestly here.
            </p>
            <div className="track__breakdown">
              <BreakdownRow
                label="Balanced"
                count={totals.lean.balanced}
                total={totals.metaTotal}
                toneClass="track__row-fill--neutral"
              />
              <BreakdownRow
                label="Pro-government"
                count={totals.lean["pro-government"]}
                total={totals.metaTotal}
                toneClass="track__row-fill--lean"
              />
              <BreakdownRow
                label="Pro-opposition"
                count={totals.lean["pro-opposition"]}
                total={totals.metaTotal}
                toneClass="track__row-fill--lean"
              />
            </div>
          </section>

          <section className="method__section">
            <h2 className="method__h2">AI confidence, across every reading</h2>
            <p>How reliable the model considered its own reading of each story.</p>
            <div className="track__breakdown">
              <BreakdownRow
                label="High"
                count={totals.confidence.high}
                total={totals.metaTotal}
                toneClass="track__row-fill--positive"
              />
              <BreakdownRow
                label="Medium"
                count={totals.confidence.medium}
                total={totals.metaTotal}
                toneClass="track__row-fill--neutral"
              />
              <BreakdownRow
                label="Low"
                count={totals.confidence.low}
                total={totals.metaTotal}
                toneClass="track__row-fill--negative"
              />
            </div>
          </section>

          {totals.daysWithMeta < totals.dayCount && (
            <section className="method__section">
              <p className="track__note">
                {totals.dayCount - totals.daysWithMeta} earlier day{totals.dayCount - totals.daysWithMeta === 1 ? "" : "s"} predate
                this breakdown and aren't included in the lean and confidence totals above, though
                they do count toward the total stories read.
              </p>
            </section>
          )}

          <section className="method__section">
            <h2 className="method__h2">Something look wrong?</h2>
            <p>
              Every indicator badge on every card has a "report this reading" action. For anything
              else, see the{" "}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateContact();
                }}
              >
                contact page
              </a>
              .
            </p>
          </section>
        </>
      )}

      {backLink("method__back--bottom")}
    </div>
  );
}
