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
  collection,
  category,
  tags,
  searchTerms,
  publishedAt,
  submittedBy,
  "thumbnailUrl": thumbnail.asset->url
}`;
