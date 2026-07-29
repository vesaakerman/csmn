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
  tags,
  searchTerms,
  publishedAt,
  submittedBy,
  "thumbnailUrl": thumbnail.asset->url
}`;

export const discoverLifeDatesQuery = `*[
  _type == "discoverLifeDate" &&
  defined(date) &&
  !(_id in path("drafts.**"))
] | order(date asc) {
  date
}`;

export const chineseRecipesQuery = `*[
  _type == "chineseRecipe" &&
  defined(title) &&
  defined(file.asset) &&
  !(_id in path("drafts.**"))
] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename,
  "fileSize": file.asset->size
}`;

export const topicalStudiesQuery = `*[
  _type == "topicalStudy" &&
  defined(title) &&
  defined(date) &&
  defined(file.asset) &&
  !(_id in path("drafts.**"))
] | order(date desc, title asc) {
  _id,
  _type,
  title,
  slug,
  date,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename,
  "fileSize": file.asset->size,
  "mimeType": file.asset->mimeType
}`;
