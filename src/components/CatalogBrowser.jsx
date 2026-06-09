import { useId, useMemo, useState } from "react";
import Fuse from "fuse.js";

export default function CatalogBrowser({ items, labels }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("");
  const [tag, setTag] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "description", "collectionLabel", "tags", "searchText"],
        threshold: 0.28,
        ignoreLocation: true,
      }),
    [items],
  );

  const options = useMemo(() => {
    const collections = new Map();
    const tags = new Set();
    const tagCounts = new Map();
    let itemsWithoutCollection = 0;

    items.forEach((item) => {
      if (item.collection && item.collectionLabel) collections.set(item.collection, item.collectionLabel);
      if (!item.collection) itemsWithoutCollection += 1;
      (item.tags || []).forEach((value) => {
        if (value) {
          tags.add(value);
          tagCounts.set(value, (tagCounts.get(value) || 0) + 1);
        }
      });
    });

    return {
      collections: Array.from(collections, ([value, label]) => ({ value, label })).sort(sortByCollectionOrder),
      tags: Array.from(tags).sort(sortText),
      hasCollectionSplit: collections.size > 1 || (collections.size === 1 && itemsWithoutCollection > 0),
      hasTagSplit: Array.from(tagCounts.values()).some((count) => count < items.length),
    };
  }, [items]);

  const filtered = useMemo(() => {
    const queryResults = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : items;

    return queryResults.filter((item) => {
      if (collection && item.collection !== collection) return false;
      if (tag && !(item.tags || []).includes(tag)) return false;
      return true;
    });
  }, [collection, fuse, items, query, tag]);

  const hasSelection = Boolean(query || collection || tag);

  function resetFilters() {
    setQuery("");
    setCollection("");
    setTag("");
  }

  return (
    <div className="catalog-browser">
      <div className="catalog-controls">
        <label className="visually-hidden" htmlFor={searchId}>
          {labels.searchLabel}
        </label>
        <input
          id={searchId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder={labels.searchPlaceholder}
        />
        <FilterSelect
          value={collection}
          onSelect={setCollection}
          label={labels.collectionFilter}
          defaultLabel={labels.allCollections}
          options={options.collections}
          disabled={!options.hasCollectionSplit}
        />
        <FilterSelect
          value={tag}
          onSelect={setTag}
          label={labels.tagFilter}
          defaultLabel={labels.allTags}
          options={options.tags.map((option) => ({ value: option, label: option }))}
          disabled={!options.hasTagSplit}
        />
      </div>

      <div className="catalog-filter-row">
        <button className="catalog-reset" type="button" onClick={resetFilters} disabled={!hasSelection}>
          {labels.resetFilters}
        </button>
      </div>

      <p className="catalog-result-count">
        {filtered.length} {filtered.length === 1 ? labels.resultSingular : labels.resultPlural}
      </p>

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
                <p className="item-kicker">{item.collectionLabel || labels.videoType}</p>
                <h2>
                  <a href={item.href}>{item.title}</a>
                </h2>
                <MetaPills values={item.tags || []} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onSelect, label, defaultLabel, options, disabled = false }) {
  function updateSelection(event) {
    onSelect(event.target.value);
  }

  return (
    <select value={value} onChange={updateSelection} aria-label={label} disabled={disabled}>
      <option value="">{defaultLabel}</option>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function sortText(a, b) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function sortByLabel(a, b) {
  return sortText(a.label, b.label);
}

function sortByCollectionOrder(a, b) {
  const order = ["chinese-worship", "english-worship", "videos"];
  const firstIndex = order.indexOf(a.value);
  const secondIndex = order.indexOf(b.value);
  if (firstIndex !== -1 && secondIndex !== -1) return firstIndex - secondIndex;
  if (firstIndex !== -1) return -1;
  if (secondIndex !== -1) return 1;
  return sortByLabel(a, b);
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
