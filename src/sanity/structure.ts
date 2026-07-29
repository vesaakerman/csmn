import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S, context) => {
  const userId = context.currentUser?.id || "";

  return S.list()
    .title("CSMN content")
    .items([
      S.listItem()
        .title("My videos")
        .schemaType("video")
        .child(
          S.documentTypeList("video")
            .title("My videos")
            .filter('_type == "video" && submittedBy.userId == $userId')
            .params({ userId }),
        ),
      S.divider(),
      S.listItem()
        .title("Discover Life evenings")
        .schemaType("discoverLifeDate")
        .child(
          S.documentTypeList("discoverLifeDate")
            .title("Discover Life evenings")
            .defaultOrdering([{ field: "date", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Chinese recipes")
        .schemaType("chineseRecipe")
        .child(
          S.documentTypeList("chineseRecipe")
            .title("Chinese recipes")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      S.divider(),
      S.documentTypeListItem("video").title("Videos"),
    ]);
};
