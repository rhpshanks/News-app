import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ArticleCard from "./components/ArticleCard";
import SkeletonCard from "./components/SkeletonCard";
import { sampleArticles } from "./data/articles";
import "./App.css";

function getInitialTheme() {
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
  const [generatedAt, setGeneratedAt] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    // public/articles.json is written daily at 6am by the "news-app-daily-crawl"
    // scheduled task. Cache-bust so a stale browser cache never masks a new run.
    fetch(`/articles.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          setStatus("live");
          setGeneratedAt(data.generatedAt ?? null);
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

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) => a.headline.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }, [articles, query]);

  const isSearching = query.trim() !== "";
  const [leadArticle, ...restArticles] = filteredArticles;
  const showLead = !isSearching && leadArticle;

  function handleReport(articleId, indicatorType) {
    // No backend queue wired up yet, section 5.3 requires the action to exist in the UI
    // so this records intent locally and confirms it to the reader.
    setToast(`Report sent for the ${indicatorType} reading on article ${articleId}.`);
  }

  return (
    <div className="page">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />

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

      <main>
        {status === "loading" && (
          <div className="grid">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {status !== "loading" && filteredArticles.length === 0 && (
          <p className="empty-state">No headlines match &#8220;{query}&#8221;.</p>
        )}

        {status !== "loading" && filteredArticles.length > 0 && (
          <>
            {showLead && (
              <div className="lead">
                <ArticleCard article={leadArticle} featured onReport={handleReport} />
              </div>
            )}
            <div className="grid">
              {(showLead ? restArticles : filteredArticles).map((article) => (
                <ArticleCard key={article.id} article={article} onReport={handleReport} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        {status === "live" ? (
          <p>
            Source: Dawn News. Live data, last updated {formatGeneratedAt(generatedAt) ?? "recently"},
            refreshed daily at 6:00 AM Pakistan Standard Time.
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
    </div>
  );
}

export default App;
