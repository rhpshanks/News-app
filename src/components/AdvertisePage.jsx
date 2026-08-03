import { useEffect } from "react";

export default function AdvertisePage({ onNavigateHome, onNavigateContact }) {
  useEffect(() => {
    document.title = "Advertise, Miqyas";
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
        <h1 className="method__title">Advertise on Miqyas</h1>
        <p className="method__intro">
          Miqyas reaches readers who come back daily for a fast, plain-language read of
          Pakistani news, the kind of habitual, attentive visit that works well for a sponsor.
        </p>
      </header>

      <section className="method__section">
        <h2 className="method__h2">Who reads Miqyas</h2>
        <p>
          Readers checking Miqyas are actively following Pakistani current affairs, economic,
          political, and social news pulled daily from outlets like Dawn News, Geo News, and
          Business Recorder, and are comfortable enough online to want a faster way to scan it.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Current ad placement</h2>
        <p>
          Miqyas currently runs Google AdSense placements across the site. Direct sponsorship
          slots, a placement outside the AdSense network, are available on request, get in touch
          to discuss current reach, formats, and rates.
        </p>
      </section>

      <section className="method__section">
        <h2 className="method__h2">Get in touch</h2>
        <p>
          Email <a href="mailto:hsyz2019@gmail.com">hsyz2019@gmail.com</a> or call/WhatsApp{" "}
          <a href="tel:+923195015013">+92 319 5015013</a> to talk about advertising on Miqyas.
          See also the{" "}
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
