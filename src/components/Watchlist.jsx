import { useState } from "react";

export default function Watchlist({ topics, onAdd, onRemove, followingOnly, onToggleFollowingOnly }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const topic = value.trim();
    if (!topic) return;
    onAdd(topic);
    setValue("");
  }

  return (
    <section className="watchlist">
      <form className="watchlist__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="watchlist__input"
          placeholder="Follow a topic, e.g. economy, Balochistan"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Follow a topic"
        />
        <button type="submit" className="watchlist__add">
          Follow
        </button>
      </form>

      {topics.length > 0 && (
        <div className="watchlist__row">
          <div className="watchlist__chips">
            {topics.map((topic) => (
              <span key={topic} className="watchlist__chip">
                {topic}
                <button
                  type="button"
                  aria-label={`Stop following ${topic}`}
                  onClick={() => onRemove(topic)}
                >
                  &#215;
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className={followingOnly ? "watchlist__filter watchlist__filter--active" : "watchlist__filter"}
            onClick={onToggleFollowingOnly}
            aria-pressed={followingOnly}
          >
            Following only
          </button>
        </div>
      )}
    </section>
  );
}
