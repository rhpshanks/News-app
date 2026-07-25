import { useMemo, useRef, useState } from "react";
import { TONE_ICON } from "./IndicatorBadge";

const CATEGORIES = [
  { key: "economic", label: "Economic" },
  { key: "political", label: "Political" },
  { key: "social", label: "Social" },
];
const TONES = ["positive", "neutral", "negative"];
const TONE_CLASS = { positive: "trend-line--positive", neutral: "trend-line--neutral", negative: "trend-line--negative" };
const RANGES = [
  { key: "7", label: "7D", days: 7 },
  { key: "30", label: "30D", days: 30 },
  { key: "90", label: "90D", days: 90 },
  { key: "365", label: "1Y", days: 365 },
];

const WIDTH = 720;
const HEIGHT = 220;
const PLOT_LEFT = 34;
const PLOT_RIGHT = WIDTH - 8;
const PLOT_TOP = 12;
const PLOT_BOTTOM = HEIGHT - 28;
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT;
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP;

function formatDate(iso, short) {
  try {
    return new Date(iso).toLocaleDateString(undefined, short ? { month: "short", day: "numeric" } : { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function xAt(index, count) {
  if (count <= 1) return PLOT_LEFT;
  return PLOT_LEFT + (index / (count - 1)) * PLOT_WIDTH;
}

function yAt(pct) {
  return PLOT_BOTTOM - (pct / 100) * PLOT_HEIGHT;
}

export default function Trends({ history, lockedRange = false }) {
  const [category, setCategory] = useState("economic");
  const [range, setRange] = useState("30");
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  const days = useMemo(() => {
    const sorted = [...(history ?? [])].sort((a, b) => (a.date < b.date ? -1 : 1));
    if (lockedRange) return sorted; // parent already scoped history to the exact date filter
    const rangeDays = RANGES.find((r) => r.key === range)?.days ?? 30;
    return sorted.slice(Math.max(0, sorted.length - rangeDays));
  }, [history, range, lockedRange]);

  const series = useMemo(() => {
    return TONES.map((tone) => ({
      tone,
      points: days.map((day, i) => {
        const counts = day.counts[category];
        const total = counts.positive + counts.neutral + counts.negative || 1;
        const pct = (counts[tone] / total) * 100;
        return { x: xAt(i, days.length), y: yAt(pct), pct, count: counts[tone], total };
      }),
    }));
  }, [days, category]);

  const xLabels = useMemo(() => {
    const n = days.length;
    if (n === 0) return [];
    const positions = n <= 5 ? days.map((_, i) => i) : [0, Math.round((n - 1) * 0.25), Math.round((n - 1) * 0.5), Math.round((n - 1) * 0.75), n - 1];
    return [...new Set(positions)].map((i) => ({ i, label: formatDate(days[i].date, true) }));
  }, [days]);

  if (!history || history.length === 0) return null;

  function handleMove(clientX) {
    if (!svgRef.current || days.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * WIDTH;
    const ratio = Math.min(1, Math.max(0, (relX - PLOT_LEFT) / PLOT_WIDTH));
    const index = Math.round(ratio * (days.length - 1));
    setHoverIndex(Math.min(days.length - 1, Math.max(0, index)));
  }

  const hoverDay = hoverIndex !== null ? days[hoverIndex] : null;
  const hoverX = hoverIndex !== null ? xAt(hoverIndex, days.length) : null;
  const tooltipLeft = hoverX !== null && hoverX > WIDTH * 0.65;

  return (
    <section className="trends">
      <div className="trends__head">
        <div className="trends__tabs" role="tablist" aria-label="Indicator category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={category === cat.key}
              className={category === cat.key ? "trends__tab trends__tab--active" : "trends__tab"}
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {!lockedRange && (
          <div className="trends__ranges" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                className={range === r.key ? "trends__range trends__range--active" : "trends__range"}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="trends__caption">
        {lockedRange
          ? `Matching the date filter above, ${days.length} day${days.length === 1 ? "" : "s"}, share of each day's stories by reading, hover or touch the chart for exact counts.`
          : `Showing ${days.length} day${days.length === 1 ? "" : "s"} of history, share of each day's stories by reading, hover or touch the chart for exact counts.`}
      </p>

      <div className="trends__chart-wrap">
        <svg
          ref={svgRef}
          className="trends__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${CATEGORIES.find((c) => c.key === category)?.label} indicator trend over ${days.length} days`}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX)}
          onTouchEnd={() => setHoverIndex(null)}
        >
          {[0, 50, 100].map((pct) => (
            <g key={pct}>
              <line
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={yAt(pct)}
                y2={yAt(pct)}
                className="trends__grid-line"
              />
              <text x={0} y={yAt(pct) + 3} className="trends__grid-label">
                {pct}%
              </text>
            </g>
          ))}

          {days.length > 1 &&
            series.map((s) => (
              <polyline
                key={s.tone}
                className={`trends__line ${TONE_CLASS[s.tone]}`}
                points={s.points.map((p) => `${p.x},${p.y}`).join(" ")}
              />
            ))}

          {days.length === 1 &&
            series.map((s) => (
              <circle key={s.tone} className={`trends__dot ${TONE_CLASS[s.tone]}`} cx={s.points[0].x} cy={s.points[0].y} r="4" />
            ))}

          {xLabels.map(({ i, label }) => (
            <text key={i} x={xAt(i, days.length)} y={HEIGHT - 6} className="trends__x-label" textAnchor="middle">
              {label}
            </text>
          ))}

          {hoverIndex !== null && (
            <g>
              <line x1={hoverX} x2={hoverX} y1={PLOT_TOP} y2={PLOT_BOTTOM} className="trends__crosshair" />
              {series.map((s) => (
                <circle
                  key={s.tone}
                  className={`trends__dot ${TONE_CLASS[s.tone]}`}
                  cx={s.points[hoverIndex].x}
                  cy={s.points[hoverIndex].y}
                  r="3.5"
                />
              ))}
            </g>
          )}
        </svg>

        {hoverDay && (
          <div
            className="trends__tooltip"
            style={{
              left: tooltipLeft ? undefined : `${(hoverX / WIDTH) * 100}%`,
              right: tooltipLeft ? `${100 - (hoverX / WIDTH) * 100}%` : undefined,
            }}
          >
            <p className="trends__tooltip-date">{formatDate(hoverDay.date)}</p>
            {series.map((s) => (
              <p key={s.tone} className={`trends__tooltip-row ${TONE_CLASS[s.tone]}`}>
                {TONE_ICON[s.tone]}
                <span className="trends__tooltip-label">{s.tone}</span>
                <span className="trends__tooltip-value">
                  {Math.round(s.points[hoverIndex].pct)}% ({s.points[hoverIndex].count} of {s.points[hoverIndex].total})
                </span>
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="trends__legend">
        {TONES.map((tone) => (
          <span key={tone} className={`trends__legend-item ${TONE_CLASS[tone]}`}>
            {TONE_ICON[tone]}
            {tone}
          </span>
        ))}
      </div>
    </section>
  );
}
