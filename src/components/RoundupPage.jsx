import { useEffect, useState } from "react";

function StatRow({ label, stats }) {
  const total = stats.positive + stats.neutral + stats.negative || 1;
  const pct = (n) => Math.round((n / total) * 100);
  return (
    <div className="roundup__stat">
      <p className="roundup__stat-label">{label}</p>
      <div className="roundup__stat-bar">
        <span className="roundup__stat-seg roundup__stat-seg--positive" style={{ flexGrow: stats.positive || 0.0001 }} />
        <span className="roundup__stat-seg roundup__stat-seg--neutral" style={{ flexGrow: stats.neutral || 0.0001 }} />
        <span className="roundup__stat-seg roundup__stat-seg--negative" style={{ flexGrow: stats.negative || 0.0001 }} />
      </div>
      <p className="roundup__stat-figures">
        {pct(stats.positive)}% positive, {pct(stats.neutral)}% neutral, {pct(stats.negative)}% negative
      </p>
    </div>
  );
}

export default function RoundupPage({ onNavigateHome, onNavigateMethodology }) {
  const [roundup, setRoundup] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    document.title = "Weekly roundup, Miqyas";
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/roundup.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!cancelled) {
          setRoundup(data);
          setStatus("live");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  function backLink(extraClass, label) {
    return (
      <a
        href="/"
        className={`method__back ${extraClass ?? ""}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigateHome();
        }}
      >
        {label ?? (
          <>
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
          </>
        )}
      </a>
    );
  }

  return (
    <div className="page">
      {backLink()}

      <header className="method__header">
        <p className="header__eyebrow">Miqyas</p>
        <h1 className="method__title">Weekly roundup</h1>
        <p className="method__intro">
          A weekly read of Miqyas's own indicator data, not new reporting, an original look at the
          pattern across a week of AI readings rather than any single story. See{" "}
          <a
            href="/methodology"
            onClick={(e) => {
              e.preventDefault();
              onNavigateMethodology();
            }}
          >
            how a reading gets generated
          </a>{" "}
          for how the underlying numbers are produced.
        </p>
      </header>

      {status === "loading" && <p className="method__section">Loading this week's roundup…</p>}
      {status === "error" && <p className="method__section">The roundup couldn't be loaded, try again shortly.</p>}

      {roundup && (
        <>
          <section className="method__section">
            <h2 className="method__h2">{roundup.periodLabel}</h2>
            <p>{roundup.totalArticles} stories read across the period.</p>
            <div className="roundup__stats">
              <StatRow label="Economic" stats={roundup.stats.economic} />
              <StatRow label="Political" stats={roundup.stats.political} />
              <StatRow label="Social" stats={roundup.stats.social} />
            </div>
          </section>

          <section className="method__section">
            <h2 className="method__h2">What the numbers say</h2>
            {roundup.summary.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </section>

          {roundup.notableStories?.length > 0 && (
            <section className="method__section">
              <h2 className="method__h2">Notable stories this week</h2>
              <ul className="method__list">
                {roundup.notableStories.map((story) => (
                  <li key={story.sourceUrl}>
                    <strong>{story.headline}.</strong> {story.context}{" "}
                    <a href={story.sourceUrl} target="_blank" rel="noreferrer">
                      Read on {story.sourceName}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {backLink("method__back--bottom")}
    </div>
  );
}
