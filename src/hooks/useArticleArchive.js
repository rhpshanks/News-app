import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sampleArticles } from "../data/articles";

function sortByNewest(articles) {
  return [...articles].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : NaN;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : NaN;
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return bTime - aTime;
  });
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

// Each day-file numbers its own articles starting at 1, so once several days are
// loaded together those ids collide. Namespace them by date so every article has a
// globally unique id across the whole session (used as the React list key).
function withUniqueIds(articles, date) {
  return articles.map((a) => ({ ...a, id: date ? `${date}-${a.id}` : a.id }));
}

function toDayEntry(date, day) {
  return { date, generatedAt: day.generatedAt ?? null, articles: sortByNewest(withUniqueIds(day.articles ?? [], date)) };
}

// Archive is paginated one calendar day per file (public/articles/<date>.json), listed
// newest-first in public/articles/index.json. Only the index and the newest day are
// cache-busted, older days are immutable once written so the browser can cache them
// indefinitely, this is what keeps a multi-year archive from re-downloading itself on
// every visit.
export function useArticleArchive() {
  const [status, setStatus] = useState("loading"); // loading | live | fallback
  const [dateIndex, setDateIndex] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [loadedDays, setLoadedDays] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [history, setHistory] = useState([]);

  const loadedDatesRef = useRef(new Set());
  useEffect(() => {
    loadedDatesRef.current = new Set(loadedDays.map((d) => d.date));
  }, [loadedDays]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dates = await fetchJson(`/articles/index.json?t=${Date.now()}`);
        if (cancelled) return;
        if (!Array.isArray(dates) || dates.length === 0) throw new Error("empty index");

        const first = await fetchJson(`/articles/${dates[0]}.json?t=${Date.now()}`);
        if (cancelled) return;

        setDateIndex(dates);
        setLoadedDays([toDayEntry(dates[0], first)]);
        setCursor(1);
        setStatus("live");

        fetchJson(`/history.json?t=${Date.now()}`)
          .then((h) => !cancelled && setHistory(Array.isArray(h) ? h : []))
          .catch(() => {});
      } catch {
        if (cancelled) return;
        setDateIndex([]);
        setCursor(0);
        setLoadedDays([{ date: null, generatedAt: null, articles: sortByNewest(sampleArticles) }]);
        setStatus("fallback");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || cursor >= dateIndex.length) return;
    setLoadingMore(true);
    const date = dateIndex[cursor];
    try {
      if (loadedDatesRef.current.has(date)) return; // already fetched via a date-range pick
      // Older, already-published days never change, so no cache-busting query here,
      // the browser (and any CDN in front of it) can cache these responses forever.
      const day = await fetchJson(`/articles/${date}.json`);
      setLoadedDays((prev) => (prev.some((d) => d.date === date) ? prev : [...prev, toDayEntry(date, day)]));
    } catch {
      // A missing or broken day file shouldn't block the rest of the archive, skip it.
    } finally {
      setCursor((c) => c + 1);
      setLoadingMore(false);
    }
  }, [cursor, dateIndex, loadingMore]);

  // Fetches every day between fromDate and toDate (inclusive, YYYY-MM-DD strings) that
  // isn't already loaded, for the explicit date-range filter, distinct from the
  // sequential newest-first infinite scroll above.
  const loadDateRange = useCallback(
    async (fromDate, toDate) => {
      const [lo, hi] = fromDate <= toDate ? [fromDate, toDate] : [toDate, fromDate];
      const targets = dateIndex.filter((d) => d >= lo && d <= hi && !loadedDatesRef.current.has(d));
      if (targets.length === 0) return;
      setLoadingMore(true);
      try {
        const fetched = await Promise.all(
          targets.map((d) =>
            fetchJson(`/articles/${d}.json`)
              .then((day) => toDayEntry(d, day))
              .catch(() => null)
          )
        );
        setLoadedDays((prev) => {
          const existing = new Set(prev.map((d) => d.date));
          const toAdd = fetched.filter((d) => d && !existing.has(d.date));
          return [...prev, ...toAdd].sort((a, b) => (a.date < b.date ? 1 : -1));
        });
      } finally {
        setLoadingMore(false);
      }
    },
    [dateIndex]
  );

  const articles = useMemo(() => loadedDays.flatMap((d) => d.articles), [loadedDays]);
  const allDaysLoaded = status === "fallback" || (dateIndex.length > 0 && cursor >= dateIndex.length);

  return {
    status,
    articles,
    history,
    generatedAt: loadedDays[0]?.generatedAt ?? null,
    loadMore,
    loadDateRange,
    loadingMore,
    allDaysLoaded,
    daysLoadedCount: loadedDays.length,
    totalDaysAvailable: dateIndex.length,
    oldestDate: dateIndex[dateIndex.length - 1] ?? null,
    newestDate: dateIndex[0] ?? null,
  };
}
