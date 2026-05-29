import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

export default function SearchResults({ labels }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("s") || "";
    setQuery(initial);

    fetch("/search-index.json")
      .then((response) => response.json())
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(entries, {
      keys: ["title", "description", "content", "tags"],
      threshold: 0.28,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [entries]);

  const results = useMemo(() => {
    if (!query.trim()) return entries.slice(0, 12);
    return fuse.search(query.trim()).map((result) => result.item);
  }, [entries, fuse, query]);

  return (
    <div className="search-page">
      <div className="search-controls-large">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.placeholder}
          autoFocus
        />
      </div>

      <p className="result-count">
        {results.length} {labels.results}
      </p>

      {!results.length && <p className="empty-state">{labels.noResults}</p>}

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
  if (kind === "song") return labels.songType;
  return labels.pageType;
}
