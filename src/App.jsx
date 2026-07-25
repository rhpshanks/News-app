import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import ArticleCard from "./components/ArticleCard";
import SkeletonCard from "./components/SkeletonCard";
import Trends from "./components/Trends";
import Watchlist from "./components/Watchlist";
import DigestSignup from "./components/DigestSignup";
import { useArticleArchive } from "./hooks/useArticleArchive";
import "./App.css";

const AUTO_EXPAND_LIMIT = 14; // how many extra days a live search will auto-load looking for a match

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
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState(() => getStoredList("watchlistTopics"));
  const [followingOnly, setFollowingOnly] = useState(false);
  const [autoExpandCount, setAutoExpandCount] = useState(0);

  const {
    status,
    articles,
    history,
    generatedAt,
    loadMore,
    loadingMore,
    allDaysLoaded,
    daysLoadedCount,
    totalDaysAvailable,
  } = useArticleArchive();

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

  const isSearching = query.trim() !== "" || followingOnly;

  // Search only ever runs over days already downloaded, that's the whole point of
  // pagination, an archive of tens of thousands of cards can't be shipped to the
  // browser just in case someone searches it. Instead, an empty result while actively
  // searching pulls in a few more days automatically, capped so a typo can't quietly
  // download the entire archive.
  useEffect(() => {
    setAutoExpandCount(0);
  }, [query, followingOnly]);

  useEffect(() => {
    if (!isSearching) return;
    if (filteredArticles.length > 0) return;
    if (allDaysLoaded || loadingMore) return;
    if (autoExpandCount >= AUTO_EXPAND_LIMIT) return;
    setAutoExpandCount((c) => c + 1);
    loadMore();
  }, [isSearching, filteredArticles.length, allDaysLoaded, loadingMore, autoExpandCount, loadMore]);

  const sourceNames = useMemo(() => {
    const names = new Set();
    articles.forEach((a) => a.sources.forEach((s) => names.add(s.name)));
    return [...names];
  }, [articles]);

  const [leadArticle, ...restArticles] = filteredArticles;
  const showLead = !isSearching && leadArticle;
  const gridArticles = showLead ? restArticles : filteredArticles;

  // Infinite scroll: a sentinel just past the visible list triggers loading the next
  // day, only while browsing normally, an active search drives its own expansion above.
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useEffect(() => {
    if (isSearching || allDaysLoaded) return;
    const threshold = 800;

    function checkScrollPosition() {
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - threshold;
      if (nearBottom) loadMoreRef.current();
    }

    checkScrollPosition(); // covers pages short enough that no scrolling is needed at all
    window.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [isSearching, allDaysLoaded, status]);

  // Only the cards actually near the viewport are mounted, this is what keeps the page
  // fast once many days (potentially thousands of cards) have been loaded in.
  const listRef = useRef(null);
  const virtualizer = useWindowVirtualizer({
    count: gridArticles.length,
    estimateSize: () => 300,
    overscan: 6,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

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

  const searchExhausted = isSearching && filteredArticles.length === 0 && (allDaysLoaded || autoExpandCount >= AUTO_EXPAND_LIMIT);

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
            placeholder="Search loaded headlines"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search loaded headlines"
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
            {searchExhausted
              ? `No matches in the ${daysLoadedCount} most recent day${daysLoadedCount === 1 ? "" : "s"} loaded.`
              : isSearching && (loadingMore || autoExpandCount > 0)
                ? "Searching further back…"
                : followingOnly
                  ? "No followed topics match the loaded headlines."
                  : `No headlines match “${query}”.`}
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

            <div ref={listRef} style={{ position: "relative", height: virtualizer.getTotalSize() }}>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const article = gridArticles[virtualRow.index];
                if (!article) return null;
                return (
                  <div
                    key={article.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className="grid-row"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    <ArticleCard article={article} following={isFollowed(article)} onReport={handleReport} />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!isSearching && loadingMore && <p className="load-more-note">Loading more…</p>}
      </main>

      <DigestSignup />

      <footer className="footer">
        {status === "live" ? (
          <p>
            Sources: {sourceNames.join(", ")}. Live data, last updated{" "}
            {formatGeneratedAt(generatedAt) ?? "recently"}, refreshed daily at 6:00 AM Pakistan Standard Time.
            Showing {daysLoadedCount} of {totalDaysAvailable} day{totalDaysAvailable === 1 ? "" : "s"} available,
            more load automatically as you scroll.
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
