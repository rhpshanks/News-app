import { TONE_ICON } from "./IndicatorBadge";

const CATEGORIES = [
  { key: "economic", label: "Economic" },
  { key: "political", label: "Political" },
  { key: "social", label: "Social" },
];
const TONES = ["positive", "neutral", "negative"];
const TONE_CLASS = { positive: "trend-seg--positive", neutral: "trend-seg--neutral", negative: "trend-seg--negative" };

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function Trends({ history }) {
  if (!history || history.length === 0) return null;

  const days = [...history].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7);

  return (
    <section className="trends">
      <div className="trends__head">
        <h2 className="trends__title">Trend history</h2>
        <div className="trends__legend">
          {TONES.map((tone) => (
            <span key={tone} className={`trends__legend-item ${TONE_CLASS[tone]}`}>
              {TONE_ICON[tone]}
              {tone}
            </span>
          ))}
        </div>
      </div>

      {days.length < 2 && (
        <p className="trends__note">
          History builds one day at a time from the daily crawl, check back tomorrow to see a real trend
          form.
        </p>
      )}

      <div className="trends__grid">
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="trends__category">
            <p className="trends__category-label">{cat.label}</p>
            {days.map((day) => {
              const counts = day.counts[cat.key];
              const total = counts.positive + counts.neutral + counts.negative || 1;
              return (
                <div className="trends__row" key={day.date}>
                  <span className="trends__date">{formatDate(day.date)}</span>
                  <div className="trends__bar">
                    {TONES.map((tone) => {
                      const value = counts[tone];
                      if (value === 0) return null;
                      return (
                        <div
                          key={tone}
                          className={`trend-seg ${TONE_CLASS[tone]}`}
                          style={{ flexGrow: value / total }}
                          title={`${tone}: ${value}`}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
