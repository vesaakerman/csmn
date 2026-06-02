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
  language,
  languages,
  tags,
  searchTerms,
  publishedAt,
  featured,
  submittedBy,
  "thumbnailUrl": thumbnail.asset->url
}`;
