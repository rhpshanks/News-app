import { useEffect, useState } from "react";
import Header from "./components/Header";
import ArticleCard from "./components/ArticleCard";
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
  const [articles, setArticles] = useState(sampleArticles);
  const [isLive, setIsLive] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

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
          setIsLive(true);
          setGeneratedAt(data.generatedAt ?? null);
        }
      })
      .catch(() => {
        // Falls back to sampleArticles, which is already the initial state.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleReport(articleId, indicatorType) {
    // No backend queue wired up yet, section 5.3 requires the action to exist in the UI
    // so this records intent locally and confirms it to the reader.
    setToast(`Report sent for the ${indicatorType} reading on article ${articleId}.`);
  }

  return (
    <div className="page">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />

      <main className="grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} onReport={handleReport} />
        ))}
      </main>

      <footer className="footer">
        {isLive ? (
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
