import { useEffect } from "react";

export default function ContactPage({ onNavigateHome }) {
  useEffect(() => {
    document.title = "Contact, Miqyas";
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
        <h1 className="method__title">Contact</h1>
        <p className="method__intro">
          Questions about a reading, a correction to report, or general feedback, get in touch
          directly.
        </p>
      </header>

      <section className="method__section">
        <h2 className="method__h2">Email</h2>
        <p>
          <a href="mailto:hsyz2019@gmail.com">hsyz2019@gmail.com</a>
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Phone / WhatsApp</h2>
        <p>
          <a href="tel:+923195015013">+92 319 5015013</a>
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Reporting a reading</h2>
        <p>
          Every indicator badge on a headline card has its own "report this reading" action for
          flagging a specific AI-generated reading you think is wrong, that's the fastest way to
          get a specific reading looked at. Use email or phone above for anything else.
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
