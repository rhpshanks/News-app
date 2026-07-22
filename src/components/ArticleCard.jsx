import { useState } from "react";
import IndicatorBadge from "./IndicatorBadge";

const IMPACT_INDICATORS = ["economic", "political", "social"];
const DETAIL_INDICATORS = ["market", "lean", "confidence"];

export default function ArticleCard({ article, featured, following, locked, onUnlock, onReport }) {
  const [openIndicator, setOpenIndicator] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  function renderBadge(type) {
    return (
      <IndicatorBadge
        key={type}
        type={type}
        value={article.indicators[type].value}
        reason={article.indicators[type].reason}
        isOpen={openIndicator === type}
        onToggle={(t) => setOpenIndicator((current) => (current === t ? null : t))}
        onClose={() => setOpenIndicator(null)}
        onReport={(t) => onReport(article.id, t)}
      />
    );
  }

  return (
    <article className={featured ? "card card--featured" : "card"}>
      {following && <div className="card__following">Following</div>}
      {article.flaggedForReview && (
        <div className="card__flag">Flagged for review, Section 5.3</div>
      )}

      <h2 className="card__headline">{article.headline}</h2>
      <p className="card__summary">{article.summary}</p>

      <div className="card__source">
        <span>{article.sources.map((s) => s.name).join(" + ")}</span>
        <span className="card__dot" aria-hidden="true">
          •
        </span>
        <span>{article.timestamp}</span>
        {article.sources.map((s) => (
          <a key={s.url} className="card__link" href={s.url} target="_blank" rel="noreferrer">
            Read on {s.name}
            <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M9 7h8v8"
              />
            </svg>
          </a>
        ))}
      </div>

      {locked ? (
        <div className="card__locked">
          <p>Unlock the full impact reading for this story</p>
          <button type="button" className="card__unlock" onClick={onUnlock}>
            Upgrade to paid
          </button>
        </div>
      ) : (
        <div className="card__badges">
          {IMPACT_INDICATORS.map(renderBadge)}

          <button
            type="button"
            className="card__more"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
          >
            {showDetails ? "Fewer details" : "More details"}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ transform: showDetails ? "rotate(180deg)" : "none" }}
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </button>

          {showDetails && DETAIL_INDICATORS.map(renderBadge)}
        </div>
      )}
    </article>
  );
}
