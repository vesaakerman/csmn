import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) => {
  return S.list()
    .title("CSMN content")
    .items([
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
      S.listItem()
        .title("Topical studies")
        .schemaType("topicalStudy")
        .child(
          S.documentTypeList("topicalStudy")
            .title("Topical studies")
            .defaultOrdering([
              { field: "date", direction: "desc" },
              { field: "title", direction: "asc" },
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("video").title("Videos"),
    ]);
};
