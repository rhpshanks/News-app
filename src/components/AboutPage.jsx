import { useEffect } from "react";

export default function AboutPage({ onNavigateHome, onNavigateMethodology, onNavigateContact }) {
  useEffect(() => {
    document.title = "About, Miqyas";
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
        <h1 className="method__title">About Miqyas</h1>
        <p className="method__intro">
          Miqyas (مقياس, Urdu for "measure" or "scale") reads Pakistani news and gives every
          story a quick, plain-language reading of its likely weight, before you decide whether
          to read the full article.
        </p>
      </header>

      <section className="method__section">
        <h2 className="method__h2">Why it exists</h2>
        <p>
          Most days bring more news than anyone has time to read in full. Miqyas doesn't try to
          replace the original reporting, every card links back to the outlet that published it,
          it tries to make the headlines that matter easier to spot, by showing at a glance
          whether a story is likely to carry economic, political, or social weight.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">An independent, small project</h2>
        <p>
          Miqyas is built and run independently, not by a news outlet or a large company. The
          readings are AI-generated, not a newsroom's editorial judgment, and can be wrong, which
          is why every indicator can be reported and why the exact process behind each reading is
          published rather than kept opaque. See{" "}
          <a
            href="/methodology"
            onClick={(e) => {
              e.preventDefault();
              onNavigateMethodology();
            }}
          >
            how a reading gets generated
          </a>{" "}
          for the full process.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Get in touch</h2>
        <p>
          Questions, feedback, or a correction to report,{" "}
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigateContact();
            }}
          >
            reach out on the contact page
          </a>
          .
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
