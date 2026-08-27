import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ArticleCard from "./ArticleCard";
import SkeletonCard from "./SkeletonCard";
import Trends from "./Trends";
import { useArticleArchive } from "../hooks/useArticleArchive";

const CATEGORY_INFO = {
  economic: {
    label: "Economic",
    title: "Economic weight",
    description:
      "Stories Miqyas read as carrying likely economic weight, effect on jobs, prices, or business activity, positive or negative. Stories read as economically neutral are left out here, see the full headline list for everything.",
  },
  political: {
    label: "Political",
    title: "Political weight",
    description:
      "Stories Miqyas read as carrying likely political weight, effect on institutional or governance stability, positive or negative. Stories read as politically neutral are left out here, see the full headline list for everything.",
  },
  social: {
    label: "Social",
    title: "Social weight",
    description:
      "Stories Miqyas read as carrying likely social weight, effect on public wellbeing, safety, or daily life, positive or negative. Stories read as socially neutral are left out here, see the full headline list for everything.",
  },
};

// Once a raw day's cards are filtered down to just this category's non-neutral
// stories, a lot of days can come up short, keep pulling in older days
// automatically until there's a reasonable amount to show, same idea as the
// homepage's search auto-expand, just always on here since filtering is the point
// of this page rather than something the reader opted into.
const AUTO_EXPAND_MIN_RESULTS = 8;
const AUTO_EXPAND_LIMIT = 40;

export default function TopicPage({ category, onNavigateHome, onNavigateMethodology }) {
  const info = CATEGORY_INFO[category];
  const [autoExpandCount, setAutoExpandCount] = useState(0);

  const { status, articles, history, loadMore, loadingMore, allDaysLoaded, daysLoadedCount, totalDaysAvailable } =
    useArticleArchive();

  useEffect(() => {
    document.title = `${info.label} stories, Miqyas`;
  }, [info.label]);

  const filteredArticles = useMemo(
    () => articles.filter((a) => a.indicators?.[category]?.value !== "neutral"),
    [articles, category]
  );

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useEffect(() => {
    if (allDaysLoaded || loadingMore) return;
    if (filteredArticles.length >= AUTO_EXPAND_MIN_RESULTS) return;
    if (autoExpandCount >= AUTO_EXPAND_LIMIT) return;
    setAutoExpandCount((c) => c + 1);
    loadMoreRef.current();
  }, [allDaysLoaded, loadingMore, filteredArticles.length, autoExpandCount]);

  const scrollContainerRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: filteredArticles.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 300,
    overscan: 6,
  });

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (allDaysLoaded || !el) return;
    const threshold = 800;

    function checkScrollPosition() {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      if (nearBottom) loadMoreRef.current();
    }

    checkScrollPosition();
    el.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      el.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [allDaysLoaded, status, filteredArticles.length]);

  function handleReport() {
    // Reporting from a topic hub reuses the same badge component as the homepage,
    // but this page has no toast/state wiring of its own, the action itself (the
    // report) doesn't depend on a visible confirmation here.
  }

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
        <h1 className="method__title">{info.title}</h1>
        <p className="method__intro">
          {info.description} See{" "}
          <a
            href="/methodology"
            onClick={(e) => {
              e.preventDefault();
              onNavigateMethodology();
            }}
          >
            how a reading gets generated
          </a>
          .
        </p>
      </header>

      {history.length > 0 && (
        <div className="trends-wrap">
          <Trends history={history} forceCategory={category} />
        </div>
      )}

      {status === "loading" && (
        <div className="grid">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {status !== "loading" && filteredArticles.length === 0 && (allDaysLoaded || autoExpandCount >= AUTO_EXPAND_LIMIT) && (
        <p className="empty-state">
          No {info.label.toLowerCase()} stories in the {daysLoadedCount} day{daysLoadedCount === 1 ? "" : "s"} loaded.
        </p>
      )}

      {status !== "loading" && filteredArticles.length === 0 && !allDaysLoaded && autoExpandCount < AUTO_EXPAND_LIMIT && (
        <p className="empty-state">Looking further back…</p>
      )}

      {status !== "loading" && filteredArticles.length > 0 && (
        <div ref={scrollContainerRef} className="article-scroll">
          <div style={{ position: "relative", height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const article = filteredArticles[virtualRow.index];
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
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ArticleCard article={article} onReport={handleReport} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loadingMore && <p className="load-more-note">Loading more…</p>}

      {status === "live" && (
        <p className="footer" style={{ marginTop: "var(--space-6)" }}>
          Showing {daysLoadedCount} of {totalDaysAvailable} day{totalDaysAvailable === 1 ? "" : "s"} of archive, filtered to{" "}
          {info.label.toLowerCase()} stories only.
        </p>
      )}

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
