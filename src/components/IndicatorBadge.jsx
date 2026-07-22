import { useState } from "react";

// Section 5.1 — six indicator categories.
// Economic / political / social carry a positive-neutral-negative judgment, so they get
// the mandatory shape-plus-color pairing from Section 4.4 (color is never the only signal).
// Market relevance and AI confidence are informational scales, not a good/bad judgment,
// so they stay in a neutral accent tone instead of green/amber/red.
// Political lean (Section 5.1/5.3) never carries color at all, on purpose: coloring "pro
// government" green or red would itself read as taking a side, which is exactly what the
// SOP's editorial safeguards rule out.

const LABELS = {
  economic: "Economic",
  political: "Political",
  social: "Social",
  market: "Market",
  lean: "Lean",
  confidence: "Confidence",
};

const TONE_ICON = {
  positive: (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  neutral: (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
      <polygon points="5.5,1 10,9.5 1,9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  negative: (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

const TONE_CLASS = {
  positive: "badge--positive",
  neutral: "badge--neutral",
  negative: "badge--negative",
};

const SCALE_LEVEL = { high: 3, medium: 2, low: 1 };

function scaleDots(value) {
  const level = SCALE_LEVEL[value] ?? 1;
  return (
    <span className="badge__dots" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= level ? "dot dot--filled" : "dot"} />
      ))}
    </span>
  );
}

function displayValue(type, value) {
  if (type === "lean") {
    return { "pro-government": "Pro-government", "pro-opposition": "Pro-opposition", balanced: "Balanced" }[value];
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function IndicatorBadge({ type, value, reason, onReport }) {
  const [open, setOpen] = useState(false);
  const isTone = type === "economic" || type === "political" || type === "social";
  const isScale = type === "market" || type === "confidence";
  const toneClass = isTone ? TONE_CLASS[value] : "badge--neutralscale";

  return (
    <div className="badge-wrap">
      <button
        type="button"
        className={`badge ${toneClass}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {isTone && TONE_ICON[value]}
        {isScale && scaleDots(value)}
        <span className="badge__label">{LABELS[type]}</span>
        <span className="badge__value">{displayValue(type, value)}</span>
      </button>

      {open && (
        <div className="badge__reason" role="note">
          <p>{reason}</p>
          <button
            type="button"
            className="badge__report"
            onClick={() => onReport?.(type)}
          >
            Report this reading
          </button>
        </div>
      )}
    </div>
  );
}
