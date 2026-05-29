export const catalogQuery = `*[
  _type == "video" &&
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
  languages,
  tags,
  themes,
  searchTerms,
  publishedAt,
  featured,
  submittedBy,
  "thumbnailUrl": thumbnail.asset->url
}`;
