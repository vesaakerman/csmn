export const catalogQuery = `*[
  _type in ["video", "song"] &&
  defined(slug.current)
] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  description,
  videoUrl,
  provider,
  category,
  speaker,
  artist,
  streamingUrl,
  lyricsUrl,
  lyricsText,
  lyricsInVideo,
  lyricsLanguages,
  audioLanguages,
  languages,
  tags,
  themes,
  searchTerms,
  publishedAt,
  featured,
  submittedBy,
  "thumbnailUrl": thumbnail.asset->url
}`;
