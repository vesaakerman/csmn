import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

export default function SearchResults({ lang, labels }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("s") || "";
    setQuery(initial);

    fetch("/search-index.json")
      .then((response) => response.json())
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setHasLoaded(true));
  }, []);

  const localizedEntries = useMemo(() => {
    return entries.filter((entry) => entry.lang === lang);
  }, [entries, lang]);

  const fuse = useMemo(() => {
    return new Fuse(localizedEntries, {
      keys: [
        { name: "title", weight: 3 },
        { name: "tags", weight: 2 },
        { name: "description", weight: 1.4 },
        { name: "content", weight: 1 },
      ],
      threshold: 0.32,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [localizedEntries]);

  const results = useMemo(() => {
    if (!hasLoaded) return [];
    if (!query.trim()) return localizedEntries.slice(0, 12);
    return fuse.search(query.trim()).map((result) => result.item);
  }, [fuse, hasLoaded, localizedEntries, query]);

  function updateQuery(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    const url = new URL(window.location.href);
    if (nextQuery.trim()) {
      url.searchParams.set("s", nextQuery);
    } else {
      url.searchParams.delete("s");
    }
    window.history.replaceState({}, "", url);
  }

  return (
    <div className="search-page">
      <div className="search-controls-large">
        <input
          type="search"
          value={query}
          onChange={updateQuery}
          placeholder={labels.placeholder}
          autoFocus
        />
      </div>

      <p className="result-count">
        {hasLoaded ? `${results.length} ${labels.results}` : labels.loading || "Loading..."}
      </p>

      {hasLoaded && !results.length && <p className="empty-state">{labels.noResults}</p>}

      <div className="search-results-list">
        {results.map((entry) => (
          <a className="search-result" href={entry.href} key={`${entry.kind}-${entry.href}`}>
            <span>{kindLabel(entry.kind, labels)}</span>
            <h2>{entry.title}</h2>
            {entry.description && <p>{entry.description}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}

function kindLabel(kind, labels) {
  if (kind === "video") return labels.videoType;
  return labels.pageType;
}
