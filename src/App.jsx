import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import ArticleCard from "./components/ArticleCard";
import SkeletonCard from "./components/SkeletonCard";
import Trends from "./components/Trends";
import Watchlist from "./components/Watchlist";
import DigestSignup from "./components/DigestSignup";
import { sampleArticles } from "./data/articles";
import "./App.css";

function getInitialTheme() {
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredList(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatGeneratedAt(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | live | fallback
  const [articles, setArticles] = useState([]);
  const [history, setHistory] = useState([]);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState(() => getStoredList("watchlistTopics"));
  const [followingOnly, setFollowingOnly] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("watchlistTopics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    // public/articles.json and public/history.json are written daily at 6am by the
    // "news-app-daily-crawl" scheduled task. Cache-bust so a stale browser cache
    // never masks a new run.
    const bust = Date.now();
    Promise.all([
      fetch(`/articles.json?t=${bust}`).then((res) => (res.ok ? res.json() : Promise.reject(res.status))),
      fetch(`/history.json?t=${bust}`).then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ])
      .then(([articlesData, historyData]) => {
        if (cancelled) return;
        if (Array.isArray(articlesData.articles) && articlesData.articles.length > 0) {
          setArticles(articlesData.articles);
          setStatus("live");
          setGeneratedAt(articlesData.generatedAt ?? null);
          setHistory(Array.isArray(historyData) ? historyData : []);
        } else {
          setArticles(sampleArticles);
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setArticles(sampleArticles);
        setStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function matchesText(article, text) {
    const q = text.trim().toLowerCase();
    if (!q) return true;
    return article.headline.toLowerCase().includes(q) || article.summary.toLowerCase().includes(q);
  }

  const followingSet = useMemo(() => topics.map((t) => t.toLowerCase()), [topics]);

  function isFollowed(article) {
    return followingSet.some((topic) => matchesText(article, topic));
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => matchesText(a, query) && (!followingOnly || isFollowed(a)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, query, followingOnly, followingSet]);

  const sourceNames = useMemo(() => {
    const names = new Set();
    articles.forEach((a) => a.sources.forEach((s) => names.add(s.name)));
    return [...names];
  }, [articles]);

  const isSearching = query.trim() !== "" || followingOnly;
  const [leadArticle, ...restArticles] = filteredArticles;
  const showLead = !isSearching && leadArticle;
  const gridArticles = showLead ? restArticles : filteredArticles;

  function handleReport(articleId, indicatorType) {
    // No backend queue wired up yet, section 5.3 requires the action to exist in the UI
    // so this records intent locally and confirms it to the reader.
    setToast(`Report sent for the ${indicatorType} reading on article ${articleId}.`);
  }

  function handleAddTopic(topic) {
    setTopics((current) => (current.some((t) => t.toLowerCase() === topic.toLowerCase()) ? current : [...current, topic]));
  }

  function handleRemoveTopic(topic) {
    setTopics((current) => current.filter((t) => t !== topic));
    setFollowingOnly(false);
  }

  return (
    <div className="page">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />

      <div className="toolbar">
        <div className="search">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" className="search__icon">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="search__input"
            placeholder="Search today's headlines"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search today's headlines"
          />
        </div>
      </div>

      <Watchlist
        topics={topics}
        onAdd={handleAddTopic}
        onRemove={handleRemoveTopic}
        followingOnly={followingOnly}
        onToggleFollowingOnly={() => setFollowingOnly((v) => !v)}
      />

      <main>
        {status === "loading" && (
          <div className="grid">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {status !== "loading" && filteredArticles.length === 0 && (
          <p className="empty-state">
            {followingOnly ? "No followed topics match today's headlines." : `No headlines match “${query}”.`}
          </p>
        )}

        {status !== "loading" && filteredArticles.length > 0 && (
          <>
            {showLead && (
              <div className="lead">
                <ArticleCard
                  article={leadArticle}
                  featured
                  following={isFollowed(leadArticle)}
                  onReport={handleReport}
                />
              </div>
            )}

            <div className="trends-wrap">
              <Trends history={history} />
            </div>

            <div className="grid">
              {gridArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  following={isFollowed(article)}
                  onReport={handleReport}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <DigestSignup />

      <footer className="footer">
        {status === "live" ? (
          <p>
            Sources: {sourceNames.join(", ")}. Live data, last updated{" "}
            {formatGeneratedAt(generatedAt) ?? "recently"}, refreshed daily at 6:00 AM Pakistan Standard
            Time.
          </p>
        ) : (
          <p>Source: Dawn News. Sample data shown, the daily live update has not run yet.</p>
        )}
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      <Analytics />
    </div>
  );
}

export default App;
