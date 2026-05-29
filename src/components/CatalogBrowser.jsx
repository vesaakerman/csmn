import { useMemo, useState } from "react";
import Fuse from "fuse.js";

const languageLabel = {
  en: "EN",
  zh: "中文",
  nl: "NL",
  other: "Other",
};

export default function CatalogBrowser({ items, labels, initialKind = "all" }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState(initialKind);
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
      const typeMatches = kind === "all" || item.kind === kind;
      const languageMatches = language === "all" || item.languages?.includes(language);
      return typeMatches && languageMatches;
    });
  }, [fuse, items, kind, language, query]);

  const videoItems = filtered.filter((item) => item.kind === "video");
  const songItems = filtered.filter((item) => item.kind === "song");
  const showTypeFilter = initialKind === "all";

  return (
    <div className="catalog-browser">
      <div className="catalog-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder={labels.searchPlaceholder}
        />

        {showTypeFilter && (
          <select value={kind} onChange={(event) => setKind(event.target.value)} aria-label={labels.filterType}>
            <option value="all">{labels.allTypes}</option>
            <option value="video">{labels.videosOnly}</option>
            <option value="song">{labels.songsOnly}</option>
          </select>
        )}

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

      {!!videoItems.length && (
        <div className="video-grid">
          {videoItems.map((item) => (
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

      {!!songItems.length && (
        <div className="table-wrap">
          <table className="catalog-table">
            <thead>
              <tr>
                <th>{labels.songsOnly}</th>
                <th>{labels.artist}</th>
                <th>{labels.lyricsInVideo}</th>
                <th>{labels.lyricsLanguage}</th>
                <th>{labels.audio}</th>
                <th>{labels.open}</th>
              </tr>
            </thead>
            <tbody>
              {songItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a className="table-title" href={item.href}>
                      {item.title}
                    </a>
                    {item.description && <span>{item.description}</span>}
                  </td>
                  <td>{item.artist}</td>
                  <td>{item.lyricsInVideo ? <span className="checkmark">✓</span> : <span className="muted">—</span>}</td>
                  <td>
                    <MetaPills values={item.lyricsLanguages} tone="gold" />
                  </td>
                  <td>
                    <MetaPills values={item.audioLanguages} />
                  </td>
                  <td>
                    <a className="btn-small btn-green" href={item.href}>
                      {labels.stream}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
