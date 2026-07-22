import { useState } from "react";

// This form is a preview only. It stores the address in this browser's local storage
// and confirms it back to the reader, but no email is actually sent, no real mailing
// list exists yet. Wiring it to a real provider is a separate, later step.
export default function DigestSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    const saved = JSON.parse(window.localStorage.getItem("digestWaitlist") ?? "[]");
    window.localStorage.setItem("digestWaitlist", JSON.stringify([...saved, email.trim()]));
    setSubmitted(true);
  }

  return (
    <section className="digest">
      <div className="digest__text">
        <p className="digest__eyebrow">Coming soon</p>
        <h2 className="digest__title">Get the daily digest by email</h2>
        <p className="digest__body">
          One email each morning with the day&#8217;s headlines and their impact reading, before
          you even open the app.
        </p>
      </div>

      {submitted ? (
        <p className="digest__confirm">You&#8217;re on the list, we&#8217;ll email you when this launches.</p>
      ) : (
        <form className="digest__form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            className="digest__input"
          />
          <button type="submit" className="digest__submit">
            Notify me
          </button>
        </form>
      )}
    </section>
  );
}
