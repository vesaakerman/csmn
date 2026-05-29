import { useMemo, useState } from "react";
import Fuse from "fuse.js";

const languageLabel = {
  en: "EN",
  zh: "中文",
  nl: "NL",
  other: "Other",
};

export default function CatalogBrowser({ items, labels }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "description", "artist", "category", "tags", "themes", "searchText"],
        threshold: 0.28,
        ignoreLocation: true,
      }),
    [items],
  );

  const languages = useMemo(() => {
    const found = new Set();
    items.forEach((item) => item.languages?.forEach((lang) => found.add(lang)));
    return Array.from(found);
  }, [items]);

  const filtered = useMemo(() => {
    const base = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : items;

    return base.filter((item) => {
      const languageMatches = language === "all" || item.languages?.includes(language);
      return languageMatches;
    });
  }, [fuse, items, language, query]);

  return (
    <div className="catalog-browser">
      <div className="catalog-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder={labels.searchPlaceholder}
        />

        <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={labels.filterLanguage}>
          <option value="all">{labels.allLanguages}</option>
          {languages.map((code) => (
            <option value={code} key={code}>
              {languageLabel[code] || code}
            </option>
          ))}
        </select>
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
                <p className="item-kicker">{item.category || labels.videoType}</p>
                <h2>
                  <a href={item.href}>{item.title}</a>
                </h2>
                {item.description && <p>{item.description}</p>}
                <MetaPills values={item.languages} />
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

function MetaPills({ values = [], tone = "blue" }) {
  if (!values.length) return <span className="muted">—</span>;

  return (
    <span className="pill-row">
      {values.map((value) => (
        <span className={`meta-pill meta-pill-${tone}`} key={value}>
          {languageLabel[value] || value}
        </span>
      ))}
    </span>
  );
}
