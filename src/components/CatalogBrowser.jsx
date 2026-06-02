import { useMemo, useState } from "react";
import Fuse from "fuse.js";

export default function CatalogBrowser({ items, labels }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "description", "languageLabel", "tags", "searchText"],
        threshold: 0.28,
        ignoreLocation: true,
      }),
    [items],
  );

  const filtered = useMemo(() => {
    return query.trim() ? fuse.search(query.trim()).map((result) => result.item) : items;
  }, [fuse, items, query]);

  return (
    <div className="catalog-browser">
      <div className="catalog-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder={labels.searchPlaceholder}
        />
      </div>

      {!filtered.length && <p className="empty-state">{labels.noResults}</p>}

      {!!filtered.length && (
        <div className="video-grid">
          {filtered.map((item) => (
            <article className="media-card" key={item.id}>
              <a href={item.href} className="media-thumb">
                <img src={item.thumbnailUrl} alt="" loading="lazy" />
                <span className="play-dot"></span>
              </a>
              <div className="media-card-body">
                <p className="item-kicker">{labels.videoType}</p>
                <h2>
                  <a href={item.href}>{item.title}</a>
                </h2>
                {item.description && <p>{item.description}</p>}
                <MetaPills values={[item.languageLabel, ...(item.tags || [])]} />
                <a className="btn-small" href={item.href}>
                  {labels.watch}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaPills({ values = [] }) {
  const cleanValues = values.filter(Boolean);
  if (!cleanValues.length) return null;

  return (
    <span className="pill-row">
      {cleanValues.slice(0, 5).map((value) => (
        <span className="meta-pill meta-pill-blue" key={value}>
          {value}
        </span>
      ))}
    </span>
  );
}
