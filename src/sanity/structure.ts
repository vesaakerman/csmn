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
      S.listItem()
        .title("My songs")
        .schemaType("song")
        .child(
          S.documentTypeList("song")
            .title("My songs")
            .filter('_type == "song" && submittedBy.userId == $userId')
            .params({ userId }),
        ),
      S.divider(),
      S.documentTypeListItem("video").title("All videos"),
      S.documentTypeListItem("song").title("All songs"),
    ]);
};
