import { useEffect } from "react";

export default function MethodologyPage({ onNavigateHome }) {
  useEffect(() => {
    document.title = "How Miqyas works";
  }, []);

  return (
    <div className="page">
      <a
        href="/"
        className="method__back"
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

      <header className="method__header">
        <p className="header__eyebrow">Miqyas</p>
        <h1 className="method__title">How Miqyas works</h1>
        <p className="method__intro">
          Miqyas reads Pakistani news so a story's likely weight is visible before you read the
          full article. This page explains exactly what that means: what gets shown, how the
          reading is generated, and where its limits are.
        </p>
      </header>

      <section className="method__section">
        <h2 className="method__h2">What each story shows</h2>
        <p>
          Every card has a headline, a short AI-written summary in plain language, and a link to
          the original article on the outlet that published it. The summary is a genuine rewrite,
          never a copy of the source's sentences, and the full article body is never stored or
          reproduced here, only the short summary and a link back to read the rest at the source.
        </p>
        <p>
          When two or more outlets cover the same real event, Miqyas shows it as a single card
          with a link to each contributing outlet, rather than duplicate cards for the same story.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">The six readings</h2>
        <p>Every story is scored on six indicators. Three carry a positive, neutral, or negative reading:</p>
        <ul className="method__list">
          <li>
            <strong>Economic.</strong> Likely effect on jobs, prices, or business activity.
          </li>
          <li>
            <strong>Political.</strong> Likely effect on institutional or governance stability.
          </li>
          <li>
            <strong>Social.</strong> Likely effect on public wellbeing, safety, or daily life.
          </li>
        </ul>
        <p>Two are informational scales, high, medium, or low, not a judgment of good or bad:</p>
        <ul className="method__list">
          <li>
            <strong>Market relevance.</strong> How relevant the story is to investors or business
            decisions.
          </li>
          <li>
            <strong>AI confidence.</strong> How reliable the model considers its own reading of
            that particular story, lower when a story is one-sided, thin on detail, or still
            unfolding.
          </li>
        </ul>
        <p>And one is deliberately colorless:</p>
        <ul className="method__list">
          <li>
            <strong>Political lean.</strong> Whether a story's own tone favors the sitting
            government, the opposition, or neither, judged from how the piece is written
            (one-sided sourcing, an uncontested claim, a missing rebuttal), never from which
            politician happens to be quoted. Most stories land on balanced.
          </li>
        </ul>
        <p>
          Political lean never carries a color, on purpose. Painting a "pro-government" reading
          green and a "pro-opposition" reading red would itself read as taking a side, exactly
          what this indicator exists to stay out of. Every reading beyond that also pairs a shape
          with its color everywhere in the app (a circle, a triangle, a square), so the signal
          never depends on color alone.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">How a reading gets generated</h2>
        <p>
          A scheduled process fetches each source's official RSS feed once a day, reads the linked
          article, and asks an AI model to write the summary and the six readings above, each with
          a one-line reason. Security or conflict reporting is attributed to its stated source
          ("ISPR said...") rather than presented as independently verified fact. When the model
          isn't confident which party currently holds government versus opposition, political lean
          defaults to balanced rather than guessing, and confidence is marked lower to reflect that.
        </p>
        <p>
          This is AI-generated analysis, not the editorial position of Miqyas or of the outlet a
          story came from. It can be wrong. Every indicator badge has a "report this reading"
          action, and any story the model marks as politically negative, or leaning toward a side
          with high confidence, goes into a human review queue before it's treated as settled.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Sources and schedule</h2>
        <p>
          Stories currently come from Dawn News, Geo News, and Business Recorder, chosen for
          having a genuinely current, machine-readable feed and a compliant crawling policy. The
          list updates once a day at 6:00 AM Pakistan Standard Time. A source only gets added once
          its feed has been checked against its own published crawling rules.
        </p>
      </section>

      <a
        href="/"
        className="method__back method__back--bottom"
        onClick={(e) => {
          e.preventDefault();
          onNavigateHome();
        }}
      >
        Back to headlines
      </a>
    </div>
  );
}
