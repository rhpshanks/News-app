import { useEffect } from "react";

export default function PrivacyPage({ onNavigateHome, onNavigateContact }) {
  useEffect(() => {
    document.title = "Privacy policy, Miqyas";
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
        <h1 className="method__title">Privacy policy</h1>
        <p className="method__intro">
          Miqyas doesn't require an account or a login to read the news. This page explains what
          little data the site does handle, and where it goes.
        </p>
      </header>

      <section className="method__section">
        <h2 className="method__h2">What Miqyas does not do</h2>
        <p>
          There's no account system, no password, and no personal profile. Reading headlines,
          filtering by date, searching, or following a topic all happen entirely in your own
          browser, none of it is sent to or stored on a server.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Information stored in your own browser</h2>
        <p>
          A few preferences, light/dark theme, followed topics, and the search or date filter you
          last used, are saved using your browser's local storage so they persist between visits.
          This data stays on your device, it is never transmitted anywhere.
        </p>
        <p>
          The daily digest email signup currently stores the address you type in that same local
          storage only, as a preview of a feature that hasn't launched yet. No email is actually
          sent and no address is transmitted off your device at this time. When a real digest
          launches, this policy will be updated to describe how that address is stored and used
          before the change goes live.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Analytics</h2>
        <p>
          Miqyas uses Vercel Web Analytics to understand overall traffic, such as which pages are
          visited and how many people visit, in aggregate. It does not use tracking cookies and
          does not collect personal information tied to an individual visitor.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Advertising</h2>
        <p>
          Miqyas shows ads served by Google AdSense. Google may use cookies or similar
          technology to serve ads based on your prior visits to this or other sites. You can
          review or opt out of personalized advertising through{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
            Google's Ad Settings
          </a>
          , and read more in{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
            Google's advertising policy
          </a>
          .
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Reported readings</h2>
        <p>
          Using "report this reading" on an indicator badge records that report for review, it
          is not linked to any personal information since no account or identity exists on this
          site.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Contact</h2>
        <p>
          Questions about this policy: <a href="mailto:hsyz2019@gmail.com">hsyz2019@gmail.com</a>{" "}
          or <a href="tel:+923195015013">+92 319 5015013</a>. See also the{" "}
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
