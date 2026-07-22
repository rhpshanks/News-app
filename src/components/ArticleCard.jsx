import IndicatorBadge from "./IndicatorBadge";

const INDICATOR_ORDER = ["economic", "political", "social", "market", "lean", "confidence"];

export default function ArticleCard({ article, onReport }) {
  return (
    <article className="card">
      {article.flaggedForReview && (
        <div className="card__flag">Flagged for review, Section 5.3</div>
      )}

      <h2 className="card__headline">{article.headline}</h2>
      <p className="card__summary">{article.summary}</p>

      <div className="card__source">
        <span>{article.source}</span>
        <span className="card__dot" aria-hidden="true">
          •
        </span>
        <span>{article.timestamp}</span>
        <a
          className="card__link"
          href={article.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Read on Dawn News
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
      </div>

      <div className="card__badges">
        {INDICATOR_ORDER.map((type) => (
          <IndicatorBadge
            key={type}
            type={type}
            value={article.indicators[type].value}
            reason={article.indicators[type].reason}
            onReport={(t) => onReport(article.id, t)}
          />
        ))}
      </div>
    </article>
  );
}
